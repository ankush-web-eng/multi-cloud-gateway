package routes

import (
	"github.com/ankush-web-eng/b-iiit/handlers"

	"github.com/gorilla/mux"
)

func RegisterRoutes() *mux.Router {
	r := mux.NewRouter()
	r.HandleFunc("/register", handlers.RegisterHandler).Methods("POST")
	r.HandleFunc("/user/{id}", handlers.GetUserHandler).Methods("GET")
	r.HandleFunc("/graphql", handlers.GraphQLHandler).Methods("GET")
	r.HandleFunc("/tasks", handlers.GetTasksHandler).Methods("GET")
	r.HandleFunc("/tasks", handlers.SaveTaskHandler).Methods("POST")
	r.HandleFunc("/tasks/{id}", handlers.UpdateTaskHandler).Methods("PUT")
	r.HandleFunc("/tasks/{id}", handlers.DeleteTaskHandler).Methods("DELETE")
	return r
}
