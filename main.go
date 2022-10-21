package main

import (
	"os"
	"net/http"

	"github.com/gin-gonic/gin"
)

func setupRouter() *gin.Engine {

	r := gin.Default()
	r.LoadHTMLGlob("templates/*")

	r.GET("/", func(c *gin.Context) {
		c.Redirect(http.StatusMovedPermanently, "/dashboard")
	})

	r.GET("/dashboard", func(c *gin.Context) {
		c.HTML(http.StatusOK, "dashboard.tmpl", gin.H{
			"title": "Prévision Météo",
		})
	})

	r.GET("/api/meteo", func(c *gin.Context) {
		lat := c.DefaultQuery("lat", "48.852969")
		lon := c.DefaultQuery("lon", "2.349903")
		meteoJson := getMeteo(lat, lon)
		c.JSON(http.StatusOK, meteoJson)
	})

	return r
}

func main() {
	serverPort := os.Getenv("SERVER_PORT")
	if (serverPort == "") {serverPort = "8080"}

	r := setupRouter()
	r.Static("/static", "./static")
	r.Run(":" + serverPort)
}
