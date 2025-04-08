package models

import "time"

type JobLog struct {
	JobID     string      `bson:"jobId"`
	Service   string      `bson:"service"`
	Status    string      `bson:"status"` // "pending", "processing", "done", "failed"
	Payload   interface{} `bson:"payload"`
	Response  interface{} `bson:"response,omitempty"`
	CreatedAt time.Time   `bson:"createdAt"`
}
