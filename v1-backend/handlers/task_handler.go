package handlers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"
	"sync"

	_ "github.com/go-sql-driver/mysql"
	"github.com/google/uuid"
	"github.com/gorilla/mux"
	_ "github.com/lib/pq"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Task struct {
	ID        string  `json:"id"`
	Title     string  `json:"title"`
	Completed bool    `json:"completed"`
	DueDate   *string `json:"due_date,omitempty"`
	Priority  *string `json:"priority,omitempty"`
}

// Save Task
func saveTask(task Task) error {
	log.Printf("Starting saveTask operation for task ID: %s\n", task.ID)
	success := false
	for dbName, dbConn := range dbConfigs {
		log.Printf("Attempting to save task in database: %s\n", dbName)
		schemaMap := getSchemaMapping(dbName)
		if schemaMap == nil {
			log.Printf("Schema mapping not found for database: %s\n", dbName)
			continue
		}

		if dbName == "mongo" {
			client, err := mongo.Connect(ctx, options.Client().ApplyURI(dbConn))
			if err != nil {
				log.Printf("MongoDB connection error: %v\n", err)
				continue
			}
			defer client.Disconnect(ctx)
			log.Printf("Successfully connected to MongoDB\n")

			collection := client.Database("users").Collection("tasks")

			// Create filter for update operations
			filter := bson.M{schemaMap["id"]: task.ID}

			// Create update document
			update := bson.M{
				"$set": bson.M{
					schemaMap["id"]:        task.ID,
					schemaMap["title"]:     task.Title,
					schemaMap["completed"]: task.Completed,
					schemaMap["due_date"]:  task.DueDate,
					schemaMap["priority"]:  task.Priority,
				},
			}

			// Use upsert to either insert or update
			opts := options.Update().SetUpsert(true)
			_, err = collection.UpdateOne(ctx, filter, update, opts)
			if err == nil {
				log.Printf("Successfully saved task in MongoDB\n")
				success = true
			} else {
				log.Printf("Error saving task in MongoDB: %v\n", err)
			}
		} else {
			db, err := sql.Open("mysql", dbConn)
			if dbName == "postgres" {
				db, err = sql.Open("postgres", dbConn)
			}
			if err != nil {
				log.Printf("SQL connection error for %s: %v\n", dbName, err)
				continue
			}
			defer db.Close()
			log.Printf("Successfully connected to %s\n", dbName)

			// Updated query to handle all fields
			query := fmt.Sprintf(`
				INSERT INTO tasks (%s, %s, %s, %s, %s) 
				VALUES (?, ?, ?, ?, ?)
				ON DUPLICATE KEY UPDATE 
					%s = VALUES(%s),
					%s = VALUES(%s),
					%s = VALUES(%s),
					%s = VALUES(%s)`,
				schemaMap["id"], schemaMap["title"], schemaMap["completed"],
				schemaMap["due_date"], schemaMap["priority"],
				schemaMap["title"], schemaMap["title"],
				schemaMap["completed"], schemaMap["completed"],
				schemaMap["due_date"], schemaMap["due_date"],
				schemaMap["priority"], schemaMap["priority"])

			if dbName == "postgres" {
				query = strings.Replace(query, "ON DUPLICATE KEY UPDATE",
					"ON CONFLICT (id) DO UPDATE SET", -1)
				query = strings.Replace(query, "VALUES", "EXCLUDED", -1)
				query = strings.Replace(query, "?", "$", -1)
			}

			_, err = db.Exec(query, task.ID, task.Title, task.Completed, task.DueDate, task.Priority)
			if err == nil {
				log.Printf("Successfully saved task in %s\n", dbName)
				success = true
			} else {
				log.Printf("Error saving task in %s: %v\n", dbName, err)
			}
		}
	}
	if success {
		log.Printf("Task saved successfully in at least one database\n")
		return nil
	}
	return fmt.Errorf("failed to save task in any database")
}

func SaveTaskHandler(w http.ResponseWriter, r *http.Request) {
	log.Printf("Received SaveTaskHandler request from %s\n", r.RemoteAddr)
	var task Task
	if err := json.NewDecoder(r.Body).Decode(&task); err != nil {
		log.Printf("Error decoding request body: %v\n", err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Generate new UUID only if ID is empty (new task)
	if task.ID == "" {
		task.ID = uuid.New().String()
		log.Printf("Generated new task ID: %s\n", task.ID)
	}

	if err := saveTask(task); err != nil {
		log.Printf("Error saving task: %v\n", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	log.Printf("Successfully saved task with ID: %s\n", task.ID)
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(task)
}

// Fetch Tasks
func GetTasksHandler(w http.ResponseWriter, r *http.Request) {
	log.Printf("Received GetTasksHandler request from %s\n", r.RemoteAddr)
	var tasks []Task
	var wg sync.WaitGroup
	resultChan := make(chan Task, len(dbConfigs))

	for dbName, dbConn := range dbConfigs {
		wg.Add(1)
		go func(dbName, dbConn string) {
			defer wg.Done()
			schemaMap := getSchemaMapping(dbName)
			if schemaMap == nil {
				return
			}

			if dbName == "mongo" {
				client, err := mongo.Connect(ctx, options.Client().ApplyURI(dbConn))
				if err != nil {
					return
				}
				defer client.Disconnect(ctx)

				collection := client.Database("users").Collection("tasks")
				cursor, err := collection.Find(ctx, bson.M{})
				if err == nil {
					defer cursor.Close(ctx)
					for cursor.Next(ctx) {
						var result bson.M
						err := cursor.Decode(&result)
						if err == nil {
							task := Task{
								ID:        result[schemaMap["id"]].(string),
								Title:     result[schemaMap["title"]].(string),
								Completed: result[schemaMap["completed"]].(bool),
							}
							if dueDate, ok := result[schemaMap["due_date"]].(string); ok {
								task.DueDate = &dueDate
							}
							if priority, ok := result[schemaMap["priority"]].(string); ok {
								task.Priority = &priority
							}
							resultChan <- task
						}
					}
				}
			} else {
				db, err := sql.Open("mysql", dbConn)
				// if dbName == "postgres" {
				// 	db, err = sql.Open("postgres", dbConn)
				// }
				if err != nil {
					return
				}
				defer db.Close()

				query := fmt.Sprintf("SELECT %s, %s, %s, %s, %s FROM tasks",
					schemaMap["id"],
					schemaMap["title"],
					schemaMap["completed"],
					schemaMap["due_date"],
					schemaMap["priority"])
				rows, err := db.Query(query)
				if err == nil {
					defer rows.Close()
					for rows.Next() {
						var task Task
						rows.Scan(&task.ID, &task.Title, &task.Completed, &task.DueDate, &task.Priority)
						resultChan <- task
					}
				}
			}
		}(dbName, dbConn)
	}

	wg.Wait()
	close(resultChan)

	for task := range resultChan {
		tasks = append(tasks, task)
	}

	log.Printf("Retrieved %d tasks\n", len(tasks))
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(tasks)
}

// Update Task
func UpdateTaskHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	taskID := vars["id"]
	log.Printf("Received UpdateTaskHandler request for task ID: %s from %s\n", taskID, r.RemoteAddr)

	var updatedTask Task
	if err := json.NewDecoder(r.Body).Decode(&updatedTask); err != nil {
		log.Printf("Error decoding update request body: %v\n", err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	updatedTask.ID = taskID
	if err := saveTask(updatedTask); err != nil {
		log.Printf("Error updating task %s: %v\n", taskID, err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	log.Printf("Successfully updated task with ID: %s\n", taskID)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(w).Encode(updatedTask); err != nil {
		log.Printf("Error encoding response for task %s: %v\n", taskID, err)
		http.Error(w, "Error encoding response", http.StatusInternalServerError)
		return
	}
}

// Delete Task
func DeleteTaskHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	taskID := vars["id"]
	log.Printf("Received DeleteTaskHandler request for task ID: %s from %s\n", taskID, r.RemoteAddr)
	deleted := false

	for dbName, dbConn := range dbConfigs {
		schemaMap := getSchemaMapping(dbName)
		if schemaMap == nil {
			continue
		}

		if dbName == "mongo" {
			client, err := mongo.Connect(ctx, options.Client().ApplyURI(dbConn))
			if err != nil {
				continue
			}
			defer client.Disconnect(ctx)

			collection := client.Database("users").Collection("tasks")
			_, err = collection.DeleteOne(ctx, bson.M{schemaMap["id"]: taskID})
			if err == nil {
				deleted = true
				w.Header().Set("Content-Type", "application/json")
				w.WriteHeader(http.StatusOK)
				json.NewEncoder(w).Encode(map[string]string{
					"message": "Task deleted successfully",
					"id":      taskID,
				})
				return
			}
		} else {
			db, err := sql.Open("mysql", dbConn)
			if dbName == "postgres" {
				db, err = sql.Open("postgres", dbConn)
			}
			if err != nil {
				continue
			}
			defer db.Close()

			query := fmt.Sprintf("DELETE FROM tasks WHERE %s = ?", schemaMap["id"])
			if dbName == "postgres" {
				query = strings.Replace(query, "?", "$1", -1)
			}

			_, err = db.Exec(query, taskID)
			if err == nil {
				deleted = true
				w.Header().Set("Content-Type", "application/json")
				w.WriteHeader(http.StatusOK)
				json.NewEncoder(w).Encode(map[string]string{
					"message": "Task deleted successfully",
					"id":      taskID,
				})
				return
			}
		}
	}

	if !deleted {
		log.Printf("Task %s not found in any database\n", taskID)
		http.Error(w, "Task not found", http.StatusNotFound)
	} else {
		log.Printf("Successfully deleted task with ID: %s\n", taskID)
	}
}
