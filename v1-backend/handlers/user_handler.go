package handlers

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"
	"sync"
	"time"

	"github.com/go-redis/redis/v8"
	_ "github.com/go-sql-driver/mysql"
	"github.com/google/uuid"
	"github.com/gorilla/mux"
	_ "github.com/lib/pq"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type User struct {
	ID       string `json:"id"`
	Email    string `json:"email"`
	Password string `json:"password"`
	Username string `json:"username"`
}

var ctx = context.Background()

var dbConfigs = map[string]string{
	"postgres": "host=localhost port=5433 user=admin password=admin dbname=users sslmode=disable",
	"mysql":    "root:admin@tcp(localhost:3306)/users",
	"mongo":    "mongodb://admin:admin@localhost:27017/users?authSource=admin",
}

var redisClient = redis.NewClient(&redis.Options{
	Addr: "localhost:6379",
})

func getSchemaMapping(dbName string) map[string]string {
	mapping, err := redisClient.HGetAll(ctx, "schema:"+dbName).Result()
	if err != nil || len(mapping) == 0 {
		log.Printf("Warning: No schema mapping found for %s\n", dbName)
		return nil
	}
	return mapping
}
func saveUser(user User) error {
	for dbName, dbConn := range dbConfigs {
		schemaMap := getSchemaMapping(dbName)
		if schemaMap == nil {
			log.Printf("[ERROR] Database %s: Schema mapping not found\n", dbName)
			continue
		}

		if dbName == "mongo" {
			client, err := mongo.Connect(ctx, options.Client().ApplyURI(dbConn))
			if err != nil {
				log.Printf("[ERROR] MongoDB connection error for %s: %v\n", dbName, err)
				continue
			}
			defer func() {
				if err := client.Disconnect(ctx); err != nil {
					log.Printf("[ERROR] MongoDB disconnect error for %s: %v\n", dbName, err)
				}
			}()

			collection := client.Database("users").Collection("users")
			_, err = collection.InsertOne(ctx, bson.M{
				schemaMap["id"]:       user.ID,
				schemaMap["email"]:    user.Email,
				schemaMap["password"]: user.Password,
				schemaMap["username"]: user.Username,
			})
			if err != nil {
				log.Printf("[ERROR] MongoDB insert error for %s: %v\n", dbName, err)
				continue
			}

			if err := redisClient.Set(ctx, user.ID, fmt.Sprintf("User: %s (DB: %s)", user.Username, dbName), 10*time.Minute).Err(); err != nil {
				log.Printf("[WARNING] Redis cache set failed: %v\n", err)
			}
			return nil
		} else {
			db, err := sql.Open("mysql", dbConn)
			if dbName == "postgres" {
				db, err = sql.Open("postgres", dbConn)
			}
			if err != nil {
				log.Printf("[ERROR] SQL connection error for %s: %v\n", dbName, err)
				continue
			}
			defer func() {
				if err := db.Close(); err != nil {
					log.Printf("[ERROR] Database close error for %s: %v\n", dbName, err)
				}
			}()

			query := fmt.Sprintf("INSERT INTO users (%s, %s, %s, %s) VALUES ($1, $2, $3, $4)",
				schemaMap["id"], schemaMap["email"], schemaMap["password"], schemaMap["username"])

			if dbName == "postgres" {
				query = strings.Replace(query, "?", "$", -1)
			}

			_, err = db.Exec(query, user.ID, user.Email, user.Password, user.Username)
			if err != nil {
				log.Printf("[ERROR] SQL insert error for %s: %v\n", dbName, err)
				continue
			}

			if err := redisClient.Set(ctx, user.ID, fmt.Sprintf("User: %s (DB: %s)", user.Username, dbName), 10*time.Minute).Err(); err != nil {
				log.Printf("[WARNING] Redis cache set failed: %v\n", err)
			}
			return nil
		}
	}
	return fmt.Errorf("failed to save user in any database after trying all configurations")
}

func getUser(userID string) string {
	cachedUser, err := redisClient.Get(ctx, userID).Result()
	if err == nil {
		return cachedUser
	}

	var wg sync.WaitGroup
	resultChan := make(chan string, len(dbConfigs))

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

				collection := client.Database("users").Collection("users")
				var result bson.M
				err = collection.FindOne(ctx, bson.M{schemaMap["id"]: userID}).Decode(&result)
				if err == nil {
					resultChan <- fmt.Sprintf("User: %s (DB: %s)", result[schemaMap["username"]], dbName)
				}
			} else {
				db, err := sql.Open("mysql", dbConn)
				if dbName == "postgres" {
					db, err = sql.Open("postgres", dbConn)
				}
				if err != nil {
					return
				}
				defer db.Close()

				query := fmt.Sprintf("SELECT %s FROM users WHERE %s = ?",
					schemaMap["username"], schemaMap["id"])
				if dbName == "postgres" {
					query = strings.Replace(query, "?", "$1", -1)
				}

				var username string
				err = db.QueryRow(query, userID).Scan(&username)
				if err == nil {
					resultChan <- fmt.Sprintf("User: %s (DB: %s)", username, dbName)
				}
			}
		}(dbName, dbConn)
	}

	wg.Wait()
	close(resultChan)

	for res := range resultChan {
		return res
	}

	return "User not found"
}

func RegisterHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var user User
	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		http.Error(w, "Invalid JSON input", http.StatusBadRequest)
		return
	}

	user.ID = uuid.New().String()
	user.Username = user.Email[:strings.Index(user.Email, "@")]

	if err := saveUser(user); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	response := map[string]string{"id": user.ID, "message": "User registered successfully"}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func GetUserHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	userID := vars["id"]

	log.Println("Requested user ID:", userID)

	userData := getUser(userID)
	response := map[string]string{"data": userData}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}
