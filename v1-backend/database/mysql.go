package database

import (
	"database/sql"

	_ "github.com/go-sql-driver/mysql"
)

func QueryMySQL(dbConn string, userID string) (string, error) {
	db, err := sql.Open("mysql", dbConn)
	if err != nil {
		return "", err
	}
	defer db.Close()

	var username string
	err = db.QueryRow("SELECT username FROM users WHERE id=?", userID).Scan(&username)
	if err != nil {
		return "", err
	}
	return username, nil
}
