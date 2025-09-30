package main

import (
	"fmt"
	"time"

	"github.com/vsimakhin/flight/internal/nighttime"
)

func (app *application) calculateNightTime(fr FlightRecord) (time.Duration, error) {
	night := time.Duration(0)
	if fr.Departure.Place == "" || fr.Arrival.Place == "" || fr.Departure.Time == "" || fr.Arrival.Time == "" {
		return night, nil
	}

	departure_place := app.GetAirportByID(fr.Departure.Place)
	if departure_place == nil {
		return night, fmt.Errorf("error calculating night time, cannot find %s", fr.Departure.Place)
	}

	departure_time, err := time.Parse("02/01/2006 1504", fmt.Sprintf("%s %s", fr.Date, fr.Departure.Time))
	if err != nil {
		return night, fmt.Errorf("error calculating night time, wrong date format %s - %s", fmt.Sprintf("%s %s", fr.Date, fr.Departure.Time), err)
	}

	arrival_place := app.GetAirportByID(fr.Arrival.Place)
	if arrival_place == nil {
		return night, fmt.Errorf("error calculating night time, cannot find %s", fr.Arrival.Place)
	}

	arrival_time, err := time.Parse("02/01/2006 1504", fmt.Sprintf("%s %s", fr.Date, fr.Arrival.Time))
	if err != nil {
		return night, fmt.Errorf("error calculating night time, wrong date format %s - %s", fmt.Sprintf("%s %s", fr.Date, fr.Arrival.Time), err)
	}

	// correct arrival time if the flight is through midnight
	if arrival_time.Before(departure_time) {
		arrival_time = arrival_time.Add(24 * time.Hour)
	}

	route := nighttime.Route{
		Departure: nighttime.Place{
			Lat:  departure_place.Lat,
			Lon:  departure_place.Lon,
			Time: departure_time,
		},
		Arrival: nighttime.Place{
			Lat:  arrival_place.Lat,
			Lon:  arrival_place.Lon,
			Time: arrival_time,
		},
	}
	night = route.NightTime()

	return night, nil
}
