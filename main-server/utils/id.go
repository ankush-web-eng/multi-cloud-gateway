package utils

import "github.com/google/uuid"

func GenerateJobID() string {
	return uuid.New().String()
}
