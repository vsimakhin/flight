package main

import (
	"embed"
	"encoding/json"
	"io/fs"
	"math"
	"net/http"
	"strings"

	"github.com/go-chi/chi/v5"
)

//go:embed ui/dist/*
var ui embed.FS

func (app *application) HandlerUI() http.Handler {
	// Subdirectory inside the embedded FS where the React build is located
	dist, _ := fs.Sub(ui, "ui/dist")

	fileServer := http.FileServer(http.FS(dist))

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		requestedPath := r.URL.Path

		if requestedPath != "/" && !strings.Contains(requestedPath, "assets") {
			r.URL.Path = "/"
		}

		fileServer.ServeHTTP(w, r)
	})
}

func (app *application) HandlerVersion(w http.ResponseWriter, r *http.Request) {
	app.writeJSON(w, http.StatusOK, app.version)
}

func (app *application) HandlerApiAirportByID(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	if ap := app.GetAirportByID(id); ap != nil {
		app.writeJSON(w, http.StatusOK, ap)
		return
	}

	app.writeJSON(w, http.StatusNotFound, "Airport not found")
}

// HandlerNightTime is a handler for calculating night time
func (app *application) HandlerApiNightTime(w http.ResponseWriter, r *http.Request) {
	var fr FlightRecord

	err := json.NewDecoder(r.Body).Decode(&fr)
	if err != nil {
		app.handleError(w, err)
		return
	}

	night, err := app.calculateNightTime(fr)
	if err != nil {
		app.writeErrorResponse(w, http.StatusBadRequest, err.Error())
		return
	}

	app.writeJSON(w, http.StatusOK, int(math.Round(night.Minutes())))
}

func (app *application) HandlerApiDistance(w http.ResponseWriter, r *http.Request) {
	dep := chi.URLParam(r, "departure")
	arr := chi.URLParam(r, "arrival")
	distance := app.Distance(dep, arr)
	app.writeJSON(w, http.StatusOK, distance)
}
