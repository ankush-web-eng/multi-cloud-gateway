package config

import (
	"database/sql"
	"log"

	_ "github.com/go-sql-driver/mysql"
	_ "github.com/lib/pq"
)

func UpdateSchemaInRedis(dbName string, dbConn string) {
	var schemaMap map[string]string

	if dbName == "postgres" {
		db, err := sql.Open("postgres", dbConn)
		if err != nil {
			log.Println("Error connecting to PostgreSQL:", err)
			return
		}
		defer db.Close()

		rows, err := db.Query("SELECT column_name FROM information_schema.columns WHERE table_name = 'users'")
		if err != nil {
			log.Println("Error fetching PostgreSQL schema:", err)
			return
		}
		defer rows.Close()

		schemaMap = make(map[string]string)
		for rows.Next() {
			var columnName string
			rows.Scan(&columnName)
			schemaMap[columnName] = columnName
		}
	} else if dbName == "mysql" {
		db, err := sql.Open("mysql", dbConn)
		if err != nil {
			log.Println("Error connecting to MySQL:", err)
			return
		}
		defer db.Close()

		rows, err := db.Query("SHOW COLUMNS FROM users")
		if err != nil {
			log.Println("Error fetching MySQL schema:", err)
			return
		}
		defer rows.Close()

		schemaMap = make(map[string]string)
		for rows.Next() {
			var columnName, dataType string
			rows.Scan(&columnName, &dataType)
			schemaMap[columnName] = columnName
		}
	}

	// Store updated schema in Redis
	if len(schemaMap) > 0 {
		redisClient.HMSet(ctx, "schema:"+dbName, schemaMap)
		log.Printf("Schema updated in Redis for %s: %v\n", dbName, schemaMap)
	}
}
