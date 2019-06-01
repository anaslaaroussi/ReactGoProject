package main

// import  ("go.mongodb.org/mongo-driver/mongo" "fmt")
import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	// "log"
	"net/http"

	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type User struct {
	// ID     *primitive.ObjectID `json:"ID" bson:"_id,omitempty"`
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
	response.Header().Add("content-type", "application/json")
	// fmt.Println(request.URL.Query()["id"]
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
	var user User
	id := request.URL.Query()["id"]
	objID, _ := primitive.ObjectIDFromHex(id)
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

func main() {
	clientOptions := options.Client().ApplyURI("mongodb://localhost:27017")
	client, _ = mongo.Connect(context.TODO(), clientOptions)

	router := mux.NewRouter()
	router.HandleFunc("/user", GetUserById).Methods("GET")
	router.HandleFunc("/user", CreateUser).Methods("POST")
	http.ListenAndServe(":8888", router)

}
