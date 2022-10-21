
// Palette de couleurs utilisée par tous les graphiques
var colors = ["#1D507A", "#2F6999", "#66A0D1", "#8FC0E9", "#4682B4"];

// Initialisation de la carte avec les coordonnées de Paris
var lat = 48.852969;
var lon = 2.349903;
var city = "";
var country = "";
var macarte = null;

var chartTemp
var chartPres
var chartHum

window.onload = function() {
    initMap();
    weather_data_load(lat, lon)
};

function weather_data_load(lat, lon) {
    // Chargement des données météo
    d3.json('/api/meteo?lat=' + lat + '&lon=' + lon, create_graph);
}

function weather_data_update(lat, lon) {
    // Chargement des données météo
    d3.json('/api/meteo?lat=' + lat + '&lon=' + lon, update_graph);
}

function create_graph(data) {
    
    if (data != null) {
        display_city_country(data)
        display_temp_graph(data.Weather)
        display_pressure_graph(data.Weather)
        display_humidity_graph(data.Weather)
    }
}

function update_graph(data) {
    
    if (data != null) {
        display_city_country(data)
        update_temp_graph(data.Weather)
        update_pres_graph(data.Weather)
        update_hum_graph(data.Weather)
    }
}

function initMap() {
    macarte = L.map('map').setView([lat, lon], 5);
 
    L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
        attribution: 'données © <a href="//osm.org/copyright">OpenStreetMap</a>/ODbL - rendu <a href="//openstreetmap.fr">OSM France</a>',
        minZoom: 1,
        maxZoom: 20
    }).addTo(macarte);

    var markerOptions = {
        clickable: true,
        draggable: true
    }
    var marker = L.marker([lat, lon], markerOptions);
    marker.addTo(macarte);

    macarte.on('click', function(e){
        //var marker = new L.marker(e.latlng).addTo(macarte);
        marker.setLatLng(e.latlng)
        console.log(e.latlng)
        weather_data_update(e.latlng.lat, e.latlng.lng)
    });
}

function display_city_country(data) {
    $('#city').text("Ville : " + data.CityName + " (" + data.CountryName + ")");
}

function display_temp_graph(data) {

    var temperature_data_tmp = []
    for (item of data) {
        data_line = [item.Timestamp * 1000, item.Temperature]
        temperature_data_tmp.push(data_line)
    }

    var temperature_data = [{
        key: 'Température',
        values: temperature_data_tmp
    }]

    var first_date = temperature_data[0]['values'][0][0];

    nv.addGraph(function() {

        chartTemp = nv.models.lineWithFocusChart()
            .x(function(d) {
                return d[0]
            })
            .y(function(d) {
                return d[1]
            })
            .yDomain([-5, 35])
            .height(270)
            .color(colors);

        chartTemp.brushExtent([new Date(first_date), new Date(first_date + 24*3600*1000)]); // 24*3600*1000ms = 1jour

        chartTemp.xAxis
            .showMaxMin(false)
            .tickFormat(function(d) {
                return d3.time.format('%H:00 (%a)')(new Date(d))
            });

        chartTemp.x2Axis
            .showMaxMin(false)
            .tickFormat(function(d) {
                return d3.time.format('%a %-d/%-m')(new Date(d))
            });

        chartTemp.yAxis
            .showMaxMin(false)
            .axisLabel('Température (°c)')
            .tickFormat(d3.format('.00f'));

        chartTemp.y2Axis
            .showMaxMin(false)
            .ticks(false);

        d3.select('#temperature svg')
            .datum(temperature_data)
            .call(chartTemp);

        //Update the chart when window resizes.
        nv.utils.windowResize(chartTemp.update);

        return chartTemp;
    });
}

function update_temp_graph(data) {

    var temperature_data_tmp = []
    for (item of data) {
        data_line = [item.Timestamp * 1000, item.Temperature]
        temperature_data_tmp.push(data_line)
    }

    var temperature_data = [{
        key: 'Température',
        values: temperature_data_tmp
    }]
    d3.select('#temperature svg')
            .datum(temperature_data)
            .call(chartTemp);
}

function display_pressure_graph(data) {

    var pressure_data_tmp = []
    for (item of data) {
        data_line = [item.Timestamp * 1000, item.Pressure]
        pressure_data_tmp.push(data_line)
    }

    var pressure_data = [{
        key: 'Pression',
        values: pressure_data_tmp
    }]

    var first_date = pressure_data[0]['values'][0][0];

    nv.addGraph(function() {

        chartPres = nv.models.lineWithFocusChart()
            .x(function(d) {
                return d[0]
            })
            .y(function(d) {
                return d[1]
            })
            .yDomain([950, 1050])
            .height(270)
            .color(colors);

        chartPres.brushExtent([new Date(first_date), new Date(first_date + 24*3600*1000)]); // 24*3600*1000ms = 1jour

        chartPres.xAxis
            .showMaxMin(false)
            .tickFormat(function(d) {
                return d3.time.format('%H:00 (%a)')(new Date(d))
            });

        chartPres.x2Axis
            .showMaxMin(false)
            .tickFormat(function(d) {
                return d3.time.format('%a %-d/%-m')(new Date(d))
            });

        chartPres.yAxis
            .showMaxMin(false)
            .axisLabel('Pression (hPa)')
            .tickFormat(d3.format('.00f'));

        chartPres.y2Axis
            .showMaxMin(false)
            .ticks(false);

        d3.select('#pressure svg')
            .datum(pressure_data)
            .call(chartPres);

        //Update the chart when window resizes.
        nv.utils.windowResize(chartPres.update);

        return chartPres;
    });
}

function update_pres_graph(data) {

    var pressure_data_tmp = []
    for (item of data) {
        data_line = [item.Timestamp * 1000, item.Pressure]
        pressure_data_tmp.push(data_line)
    }

    var pressure_data = [{
        key: 'Pression',
        values: pressure_data_tmp
    }]
    d3.select('#pressure svg')
            .datum(pressure_data)
            .call(chartPres);
}

function display_humidity_graph(data) {

    var humidity_data_tmp = []
    for (item of data) {
        data_line = [item.Timestamp * 1000, item.Humidity]
        humidity_data_tmp.push(data_line)
    }

    var humidity_data = [{
        key: 'Humidité',
        values: humidity_data_tmp
    }]

    var first_date = humidity_data[0]['values'][0][0];

    nv.addGraph(function() {

        chartHum = nv.models.lineWithFocusChart()
            .x(function(d) {
                return d[0]
            })
            .y(function(d) {
                return d[1]
            })
            .yDomain([30, 105])
            .height(270)
            .color(colors);

        chartHum.brushExtent([new Date(first_date), new Date(first_date + 24*3600*1000)]); // 24*3600*1000ms = 1jour

        chartHum.xAxis
            .showMaxMin(false)
            .tickFormat(function(d) {
                return d3.time.format('%H:00 (%a)')(new Date(d))
            });

        chartHum.x2Axis
            .showMaxMin(false)
            .tickFormat(function(d) {
                return d3.time.format('%a %-d/%-m')(new Date(d))
            });

        chartHum.yAxis
            .showMaxMin(false)
            .axisLabel('Humidité (%)')
            .tickFormat(d3.format('.00f'));

        chartHum.y2Axis
            .showMaxMin(false)
            .ticks(false);

        d3.select('#humidity svg')
            .datum(humidity_data)
            .call(chartHum);

        //Update the chart when window resizes.
        nv.utils.windowResize(chartHum.update);

        return chartHum;
    });
}

function update_hum_graph(data) {

    var humidity_data_tmp = []
    for (item of data) {
        data_line = [item.Timestamp * 1000, item.Humidity]
        humidity_data_tmp.push(data_line)
    }

    var humidity_data = [{
        key: 'Humidité',
        values: humidity_data_tmp
    }]
    d3.select('#humidity svg')
            .datum(humidity_data)
            .call(chartHum);
}
