package main

import (
	"database/sql"
	"encoding/json"
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

	type Request struct {
		ID string `json:"id"`
	}

	var req Request
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}

	sqlStatement := `SELECT id, card_data FROM virtual_cards WHERE id = $1`
	var rawData []byte
	var cardID string

	row := db.QueryRow(sqlStatement, req.ID)
	err := row.Scan(&cardID, &rawData)
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "card not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "database error"})
		return
	}

	var cardData CardData
	if err := json.Unmarshal(rawData, &cardData); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to parse card data"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": cardData,
	})
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

	if os.Getenv("FLY_REGION") == "" {
		err := godotenv.Load(".env")
		if err != nil {
			log.Println("No .env file found, continuing with existing environment variables")
		}
	}

	dsn, exists := os.LookupEnv("DATABASE_URL")
	if !exists {
		log.Fatalf("Couldn't find env variable")
	}

	db, err := sql.Open("postgres", dsn)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

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

	router.POST("/add-card", addNewVirtualCard)
	router.POST("/get-card", getVirtualCard)

	router.Run()
}
