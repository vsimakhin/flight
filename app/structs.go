package main

type Airport struct {
	ICAO      string  `json:"icao"`
	IATA      string  `json:"iata"`
	Name      string  `json:"name"`
	City      string  `json:"city"`
	Country   string  `json:"country"`
	Elevation int     `json:"elevation"`
	Lat       float64 `json:"lat"`
	Lon       float64 `json:"lon"`
}

type Airports struct {
	icaoIndex map[string]*Airport
	iataIndex map[string]*Airport
}

type FlightRecord struct {
	Date      string `json:"date"`
	Departure struct {
		Place string `json:"place"`
		Time  string `json:"time"`
	} `json:"departure"`
	Arrival struct {
		Place string `json:"place"`
		Time  string `json:"time"`
	} `json:"arrival"`
}

type JSONResponse struct {
	OK          bool   `json:"ok"`
	Message     string `json:"message,omitempty"`
	RedirectURL string `json:"redirect_url,omitempty"`
	Data        string `json:"data,omitempty"`
}
