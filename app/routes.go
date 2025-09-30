package main

import (
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
)

func (app *application) routes() *chi.Mux {
	r := chi.NewRouter()

	if app.config.env == "dev" {
		r.Use(middleware.Logger)
	}

	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	r.Route("/api", func(r chi.Router) {

		r.Get("/airport/{id}", app.HandlerApiAirportByID)
		r.Post("/night", app.HandlerApiNightTime)
		r.Get("/distance/{departure}/{arrival}", app.HandlerApiDistance)
		r.Get("/version", app.HandlerVersion)
	})

	r.Handle("/*", middleware.Compress(5)(app.HandlerUI()))

	return r
}
