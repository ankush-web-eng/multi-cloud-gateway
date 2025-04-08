package kafka

import (
	"context"
	"log"
	"time"

	"github.com/segmentio/kafka-go"
)

var Writer *kafka.Writer

func InitKafka() {
	Writer = &kafka.Writer{
		Addr:         kafka.TCP("localhost:9092"),
		WriteTimeout: 10 * time.Second,
		ReadTimeout:  10 * time.Second,
		RequiredAcks: kafka.RequireOne,
	}
}

func SendMessage(topic string, key string, value []byte) error {
	msg := kafka.Message{
		Key:   []byte(key),
		Value: value,
	}

	err := Writer.WriteMessages(context.Background(), msg)
	if err != nil {
		log.Printf("Kafka write error: %v", err)
		return err
	}

	return nil
}
