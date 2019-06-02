package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var client *mongo.Client

type User struct {
	ID     *primitive.ObjectID `json:"ID" bson:"_id,omitempty"`
	Name   string
	Email  string
	Avatar string
}

func CreateUser(response http.ResponseWriter, request *http.Request) {
	response.Header().Add("content-type", "application/json")
	userCollection := client.Database("users").Collection("profils")
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
	var user User

	json.NewDecoder(request.Body).Decode(&user)
	result, _ := userCollection.InsertOne(ctx, user)
	json.NewEncoder(response).Encode(result)

}

func GetUsers(response http.ResponseWriter, request *http.Request) {
	response.Header().Add("content-type", "application/json")
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
	var users []*User
	userCollection := client.Database("users").Collection("profils")

	cur, err := userCollection.Find(ctx, bson.D{})
	if err != nil {
		response.WriteHeader(http.StatusInternalServerError)
		response.Write([]byte(`{"message"}` + err.Error() + `"}`))
		return
	}
	fmt.Println(cur)
	defer cur.Close(ctx)
	// Finding multiple documents returns a cursor
	// Iterating through the cursor allows us to decode documents one at a time
	for cur.Next(ctx) {

		// create a value into which the single document can be decoded
		var user User
		err := cur.Decode(&user)
		if err != nil {
			log.Fatal(err)
		}

		users = append(users, &user)
	}

	if err := cur.Err(); err != nil {
		response.WriteHeader(http.StatusInternalServerError)
		response.Write([]byte(`{"message"}` + err.Error() + `"}`))
		return
	}

	fmt.Println(cur)
	json.NewEncoder(response).Encode(users)
}

func GetUserById(response http.ResponseWriter, request *http.Request) {
	response.Header().Add("content-type", "application/json")
	fmt.Println(request.URL.Query()["id"])
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
	var user User
	id := request.URL.Query()["id"]
	fmt.Println(id[0])
	objID, _ := primitive.ObjectIDFromHex(id[0])
	filter := bson.M{"_id": objID}
	fmt.Println(objID)
	userCollection := client.Database("users").Collection("profils")
	err := userCollection.FindOne(ctx, filter).Decode(&user)
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println(user)
	json.NewEncoder(response).Encode(user)
}

func UpdateUserById(response http.ResponseWriter, request *http.Request) {
	response.Header().Add("content-type", "application/json")
	var user User
	json.NewDecoder(request.Body).Decode(&user)
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
	id := request.URL.Query()["id"]
	objID, _ := primitive.ObjectIDFromHex(id[0])
	filter := bson.M{"_id": objID}

	userCollection := client.Database("users").Collection("profils")
	update := bson.D{

		{"$set", bson.D{{"avatar", user.Avatar}}},
		{"$set", bson.D{{"name", user.Name}}},
		{"$set", bson.D{{"email", user.Email}}},
	}
	updateResult, err := userCollection.UpdateOne(ctx, filter, update)
	if err != nil {
		fmt.Println(err)
	}
	json.NewEncoder(response).Encode(updateResult)
}

func main() {
	clientOptions := options.Client().ApplyURI("mongodb://localhost:27017")
	client, _ = mongo.Connect(context.TODO(), clientOptions)

	router := mux.NewRouter()
	router.HandleFunc("/user", GetUserById).Methods("GET")
	router.HandleFunc("/user", CreateUser).Methods("POST")
	router.HandleFunc("/user", UpdateUserById).Methods("PUT")
	router.HandleFunc("/user/all", GetUsers).Methods("GET")

	http.ListenAndServe(":8888", router)

}
