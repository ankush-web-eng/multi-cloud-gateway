package main

import (
	"bytes"
	"encoding/json"
	"log"
	"net/http"
	"time"

	"main-server/kafka"
	"main-server/models"
	"main-server/mongo"
	"main-server/utils"
)

type returnJob struct {
	JobID     string `json:"jobId"`
	ReturnURL string `json:"returnUrl"`
}

var jobIDStack []returnJob

type RequestPayload struct {
	Service string      `json:"service"`
	Data    interface{} `json:"data"`
}

func handleRequest(w http.ResponseWriter, r *http.Request) {
	var req RequestPayload
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid payload", http.StatusBadRequest)
		return
	}

	jobID := utils.GenerateJobID()

	job := models.JobLog{
		JobID:     jobID,
		Service:   req.Service,
		Status:    "pending",
		Payload:   req.Data,
		CreatedAt: time.Now(),
	}

	_, err := mongo.LogsCollection.InsertOne(r.Context(), job)
	if err != nil {
		log.Printf("Mongo insert error: %v", err)
		http.Error(w, "Failed to store log", http.StatusInternalServerError)
		return
	}

	jobWithID := map[string]interface{}{
		"jobId":   jobID,
		"service": req.Service,
		"data":    req.Data,
	}

	payload, _ := json.Marshal(jobWithID)

	err = kafka.SendMessage(req.Service, jobID, payload)
	if err != nil {
		http.Error(w, "Failed to queue job", http.StatusInternalServerError)
		return
	}

	jobIDStack = append(jobIDStack, returnJob{
		JobID:     jobID,
		ReturnURL: req.Data.(map[string]interface{})["returnUrl"].(string),
	})

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"jobId":  jobID,
		"status": "queued",
	})
}

type UpdatePayload struct {
	Status string      `json:"status"`
	Key    string      `json:"key"`
	Result interface{} `json:"result"`
	Error  interface{} `json:"error"`
}

func handleUpdate(w http.ResponseWriter, r *http.Request) {
	var req UpdatePayload
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid payload", http.StatusBadRequest)
		return
	}

	jobID := req.Key

	filter := map[string]interface{}{"jobId": jobID}
	update := map[string]interface{}{"$set": map[string]interface{}{"status": req.Status}}

	_, err := mongo.LogsCollection.UpdateOne(r.Context(), filter, update)
	if err != nil {
		log.Printf("Mongo update error: %v", err)
		http.Error(w, "Failed to update log", http.StatusInternalServerError)
		return
	}

	var returnURL string

	for i, job := range jobIDStack {
		if job.JobID == jobID {
			returnURL = job.ReturnURL
			jobIDStack = append(jobIDStack[:i], jobIDStack[i+1:]...)
			break
		}
	}

	if returnURL != "" {
		response := make(map[string]interface{})
		if req.Status == "success" {
			if result, ok := req.Result.(map[string]interface{}); ok {
				response["url"] = result["url"]
			}
		} else if req.Status == "failed" {
			response["error"] = req.Error
		}

		jsonData, _ := json.Marshal(response)
		_, err := http.Post(returnURL, "application/json", bytes.NewBuffer(jsonData))
		if err != nil {
			log.Printf("Failed to send callback to %s: %v", returnURL, err)
		}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"jobId":  jobID,
		"status": req.Status,
	})
}

func main() {
	mongo.InitMongo()
	kafka.InitKafka()

	http.HandleFunc("/request", handleRequest)
	http.HandleFunc("/update", handleUpdate)

	log.Println("Main server running on :8000")
	log.Fatal(http.ListenAndServe(":8000", nil))
}
