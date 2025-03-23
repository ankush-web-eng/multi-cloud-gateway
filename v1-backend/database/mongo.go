package database

import (
	"context"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func QueryMongo(dbConn string, userID string) (string, error) {
	client, err := mongo.Connect(context.Background(), options.Client().ApplyURI(dbConn))
	if err != nil {
		return "", err
	}
	defer client.Disconnect(context.Background())

	collection := client.Database("users").Collection("users")
	var result bson.M
	err = collection.FindOne(context.Background(), bson.M{"_id": userID}).Decode(&result)
	if err != nil {
		return "", err
	}
	return result["username"].(string), nil
}
