# Dashboard application

## About The Project

This demo application allows you to obtain the 5-day weather forecast on a specific point of the globe.

It is possible to select any point, via the map, and get the associated forecasts.

It is developed in Go with Gin framework.

The Openweather API is also used.
For the application to work, it is necessary to get a token by registering on the site https://openweathermap.org/.

The Openstreetmap API is also used via the Leaflejs library (https://leafletjs.com/).

[![Product Name Screen Shot][product-screenshot]](http://localhost:8080/)

## Init

Here is an example of a command to build a container image:
```sh
  docker build --force-rm -t graph-app .
  ```
Export an environment variable carrying the Openweathermap API token (replace {{YOUR_API_TOKEN}} with yours): 
```sh
  export METEO_API_TOKEN="{{YOUR_API_TOKEN}}"
  ```

Launch a container:
```sh
  docker run -d -p 8080:8080 -e METEO_API_TOKEN=${METEO_API_TOKEN} --name graph-app graph-app
  ```

Connect to the app:
http://localhost:8080/



<!-- MARKDOWN LINKS & IMAGES -->
[product-screenshot]: images/screenshot_app.png