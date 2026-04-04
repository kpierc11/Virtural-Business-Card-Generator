package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

var db *sql.DB

type CardData struct {
	ID                     string `json:"id"`
	Name                   string `json:"name"`
	Email                  string `json:"email"`
	Phone                  string `json:"phone"`
	Color                  string `json:"color"`
	WebsiteLink            string `json:"websiteLink"`
	CompanyName            string `json:"companyName"`
	JobTitle               string `json:"jobTitle"`
	PreviewBackgroundImage string `json:"previewBackgroundImage"`
	PreviewImage           string `json:"previewImage"`
}

func getVirtualCard(c *gin.Context) {
	var id = c.PostForm("id")
	var cardData CardData
	var rawData []byte

	fmt.Printf("ID: %v", id)

	sqlStatement := `SELECT id, card_data FROM virtual_cards WHERE id=$1`
	row := db.QueryRow(sqlStatement, id)

	switch err := row.Scan(&id, &rawData); err {
	case sql.ErrNoRows:
		fmt.Println("No rows were returned!")
	case nil:
		if err := json.Unmarshal(rawData, &cardData); err != nil {
			panic(err)
		}

		fmt.Println(id, cardData)
		c.JSON(http.StatusOK, cardData)
	default:
		panic(err)
	}
}

func addNewVirtualCard(c *gin.Context) {
	var card CardData

	if err := c.ShouldBindJSON(&card); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	if card.ID == "" {
		c.JSON(http.StatusNotFound, gin.H{"error": "missing ID"})
		return
	}

	jsonData, err := json.Marshal(card)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to encode JSON"})
		return
	}

	sqlStatement := `
		INSERT INTO virtual_cards (id, card_data)
		VALUES ($1, $2)
	`

	_, err = db.Exec(sqlStatement, card.ID, jsonData)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "database error"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Record Added",
	})
}

func main() {

	err := godotenv.Load(".env")

	if err != nil {
		log.Print("No .env file found")
	}

	dsn, exists := os.LookupEnv("DATABASE_URL")
	if !exists {
		log.Fatalf("Couldn't find env variable")
	}

	db, err = sql.Open("postgres", dsn)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	// Verify the connection is alive
	if err := db.Ping(); err != nil {
		log.Fatal(err)
	}

	router := gin.Default()
	router.SetTrustedProxies([]string{"localhost:5173"})

	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:5173"}
	config.AllowCredentials = true
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	config.AllowHeaders = []string{"Origin", "Content-Type", "Authorization"}

	router.Use(cors.New(config))

	// Define a simple GET endpoint
	router.POST("/add-card", addNewVirtualCard)
	router.GET("/get-card", getVirtualCard)

	// Start server on port 8080 (default)
	// Server will listen on 0.0.0.0:8080 (localhost:8080 on Windows)
	router.Run()
}
