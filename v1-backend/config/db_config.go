package config

import (
	"context"
	"log"

	"github.com/go-redis/redis/v8"
)

var ctx = context.Background()
var redisClient = redis.NewClient(&redis.Options{
	Addr: "localhost:6379",
})

func LoadDatabaseConfigs() map[string]string {
	configs, err := redisClient.HGetAll(ctx, "databases").Result()
	if err != nil || len(configs) == 0 {
		log.Println("Warning: No database configurations found in Redis!")
		return nil
	}
	return configs
}
