package main

import (
	"encoding/json"
	"log"
	"net/http"
	"time"

	"main-server/kafka"
	"main-server/models"
	"main-server/mongo"
	"main-server/utils"
)

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

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"jobId":  jobID,
		"status": "queued",
	})
}

func main() {
	mongo.InitMongo()
	kafka.InitKafka()

	http.HandleFunc("/request", handleRequest)

	log.Println("Main server running on :8000")
	log.Fatal(http.ListenAndServe(":8000", nil))
}
