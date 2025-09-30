package main

import (
	"encoding/json"
	"net/http"
	"path"
	"runtime"
)

// writeJSON writes arbitrary data out as JSON
func (app *application) writeJSON(w http.ResponseWriter, status int, data interface{}, headers ...http.Header) {
	out, err := json.Marshal(data)
	if err != nil {
		app.errorLog.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	if len(headers) > 0 {
		for k, v := range headers[0] {
			w.Header()[k] = v
		}
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_, err = w.Write(out)
	if err != nil {
		app.errorLog.Println(err)
	}
}

func (app *application) writeErrorResponse(w http.ResponseWriter, status int, message string) {
	response := JSONResponse{
		OK:      false,
		Message: message,
	}
	app.writeJSON(w, status, response)
}

func (app *application) writeOkResponse(w http.ResponseWriter, message string) {
	response := JSONResponse{
		OK:      true,
		Message: message,
	}
	app.writeJSON(w, http.StatusOK, response)
}

func (app *application) handleError(w http.ResponseWriter, err error) {
	// Capture the file and line number of the original error
	_, file, line, ok := runtime.Caller(1)
	if ok {
		app.errorLog.Printf("%s:%d: %v", path.Base(file), line, err)
	} else {
		app.errorLog.Println(err)
	}
	app.errorLog.Println(err)
	app.writeErrorResponse(w, http.StatusInternalServerError, err.Error())
}
