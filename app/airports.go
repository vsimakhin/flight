package main

import (
	"embed"
	"encoding/json"
	"strings"
)

//go:embed db/*
var airportsDB embed.FS

func (app *application) LoadAirports() error {
	file, err := airportsDB.Open("db/airports.json")
	if err != nil {
		return err
	}
	defer file.Close()

	var list []Airport
	if err := json.NewDecoder(file).Decode(&list); err != nil {
		return err
	}

	// Initialize maps
	app.airports.icaoIndex = make(map[string]*Airport)
	app.airports.iataIndex = make(map[string]*Airport)

	for i := range list {
		ap := &list[i]
		app.airports.icaoIndex[strings.ToUpper(ap.ICAO)] = ap
		if ap.IATA != "" {
			app.airports.iataIndex[strings.ToUpper(ap.IATA)] = ap
		}
	}

	app.infoLog.Printf("loaded %d ICAO and %d IATA airports", len(app.airports.icaoIndex), len(app.airports.iataIndex))
	return nil
}

func (app *application) FindByICAO(code string) *Airport {
	return app.airports.icaoIndex[strings.ToUpper(code)]
}

func (app *application) FindByIATA(code string) *Airport {
	return app.airports.iataIndex[strings.ToUpper(code)]
}

func (app *application) GetAirportByID(id string) *Airport {
	if ap := app.FindByICAO(id); ap != nil {
		return ap
	}

	if ap := app.FindByIATA(id); ap != nil {
		return ap
	}

	return nil
}
