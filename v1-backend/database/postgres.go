package database

import (
	"database/sql"

	_ "github.com/lib/pq"
)

func QueryPostgres(dbConn string, userID string) (string, error) {
	db, err := sql.Open("postgres", dbConn)
	if err != nil {
		return "", err
	}
	defer db.Close()

	var username string
	err = db.QueryRow("SELECT username FROM users WHERE id=$1", userID).Scan(&username)
	if err != nil {
		return "", err
	}
	return username, nil
}
