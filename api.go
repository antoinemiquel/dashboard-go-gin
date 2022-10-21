package main

import (
	"os"
	"net/http"
	"io"
	"encoding/json"
	"math"
)

type WeatherUnit struct {
	Timestamp int64
	Temperature float64
	Pressure int
	Humidity int
}

type Weather struct {
	CityName string
	CountryName string
	Weather []WeatherUnit
}

const sampleMeteoFilePath = "static/sampleMeteo.json"

func getMeteo(lat string, lon string) Weather {

    type TmpWeather struct {
		TimestampNumbers int `json:"cnt"`
		TimestampList []struct {
			Timestamp int64 `json:"dt"`
			Temperature struct {
				Temperature float64 `json:"temp"`
				Pressure int `json:"pressure"`
				Humidity int `json:"humidity"`
			} `json:"main"`
		} `json:"list"`
		City struct {
			Name string `json:"name"`
			Country string `json:"country"`
		} `json:"city"`
    }

	var w Weather
	var tmpW TmpWeather

	METEO_API_TOKEN := os.Getenv("METEO_API_TOKEN")

	if (METEO_API_TOKEN != "") {
		// get data with API call (https://openweathermap.org/)
		METEO_API_URL := "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + METEO_API_TOKEN
	
		resp, err := http.Get(METEO_API_URL)
		   if err != nil {
			panic(err)
		   }
	
		body, err := io.ReadAll(resp.Body)
		if err != nil {
			panic(err)
		}

		err = json.Unmarshal(body, &tmpW)
		if err != nil {
			panic(err)
		}
	
	} else {
		// get data in sampleMeteo.json
		file, err := os.ReadFile(sampleMeteoFilePath)
		if err != nil {
			panic(err)
		}

		err = json.Unmarshal(file, &tmpW)
		if err != nil {
			panic(err)
		}
	}

	w.CityName = tmpW.City.Name
	w.CountryName = tmpW.City.Country

	for _,tsp := range tmpW.TimestampList {
		var wu WeatherUnit
		wu.Timestamp = tsp.Timestamp
		wu.Temperature = math.Round((tsp.Temperature.Temperature - 273.15) * 100) / 100
		wu.Pressure = tsp.Temperature.Pressure
		wu.Humidity = tsp.Temperature.Humidity

		w.Weather = append(w.Weather, wu)
	}

	return w
}