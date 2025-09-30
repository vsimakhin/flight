package main

import (
	"fmt"
	"math"
	"strings"
	"sync"
)

var distanceCache sync.Map

func deg2rad(degrees float64) float64 {
	return degrees * math.Pi / 180
}

func hsin(theta float64) float64 {
	return math.Pow(math.Sin(theta/2), 2)
}

// calculates a distance between 2 geo points
func distance(lat1, lon1, lat2, lon2 float64) float64 {
	lat1 = deg2rad(lat1)
	lon1 = deg2rad(lon1)
	lat2 = deg2rad(lat2)
	lon2 = deg2rad(lon2)

	r := 6378100.0
	h := hsin(lat2-lat1) + math.Cos(lat1)*math.Cos(lat2)*hsin(lon2-lon1)

	return 2 * r * math.Asin(math.Sqrt(h)) / 1000 / 1.852 // nautical miles
}

// distance calculates distance between 2 airports
func (app *application) Distance(departure, arrival string) float64 {
	if departure == arrival {
		return 0
	}

	var key string
	if strings.Compare(departure, arrival) > 0 {
		key = fmt.Sprintf("%s%s", departure, arrival)
	} else {
		key = fmt.Sprintf("%s%s", arrival, departure)
	}

	if cachedDistance, ok := distanceCache.Load(key); ok {
		return cachedDistance.(float64)
	}

	dep := app.GetAirportByID(departure)
	arr := app.GetAirportByID(arrival)
	if dep == nil || arr == nil {
		return 0
	}

	d := distance(dep.Lat, dep.Lon, arr.Lat, arr.Lon)
	distanceCache.Store(key, d)
	return d
}
