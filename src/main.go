package main

import (
	"context"
	"encoding/json"
	"time"

	// "log"
	"net/http"

	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type User struct {
	Name   string
	Email  string
	Avatar string
}

var client *mongo.Client

func CreateUser(response http.ResponseWriter, request *http.Request) {
	response.Header().Add("content-type", "application/json")
	userCollection := client.Database("users").Collection("profils")
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
	var user User

	json.NewDecoder(request.Body).Decode(&user)
	result, _ := userCollection.InsertOne(ctx, user)
	json.NewEncoder(response).Encode(result)

}

func GetUserById(response http.ResponseWriter, request *http.Request) {

}

func main() {
	clientOptions := options.Client().ApplyURI("mongodb://localhost:27017")
	client, _ = mongo.Connect(context.TODO(), clientOptions)

	router := mux.NewRouter()
	router.HandleFunc("/user:id", GetUserById).Methods("GET")
	router.HandleFunc("/user", CreateUser).Methods("POST")
	http.ListenAndServe(":8888", router)

}
