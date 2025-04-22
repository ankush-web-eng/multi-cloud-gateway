package main

import (
	"log"
	"net/http"

	routes "main-server/handlers"
	"main-server/kafka"
	"main-server/mongo"

	"github.com/rs/cors"
)

func main() {
	mongo.InitMongo()
	kafka.InitKafka()

	// Configure CORS
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000", "http://127.0.0.1:5002", "http://localhost:5000"},
		AllowCredentials: true,
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"*"},
	})

	// Wrap your handlers with the CORS middleware
	http.HandleFunc("/request", routes.HandleRequest)
	http.HandleFunc("/update", routes.HandleUpdate)
	http.HandleFunc("/logs", routes.HandleDatabase)

	handler := c.Handler(http.DefaultServeMux)

	log.Println("Main server running on :8000")
	log.Fatal(http.ListenAndServe(":8000", handler))
}
