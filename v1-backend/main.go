package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/ankush-web-eng/b-iiit/routes"
	"github.com/gorilla/handlers"
)

func main() {
	r := routes.RegisterRoutes()

	headers := handlers.AllowedHeaders([]string{"Content-Type", "Authorization"})
	methods := handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE", "OPTIONS"})
	origins := handlers.AllowedOrigins([]string{"http://localhost:3000"})

	fmt.Println("Server starting on port 8080...")
	log.Fatal(http.ListenAndServe(":8080", handlers.CORS(headers, methods, origins)(r)))
}
