package main

import (
	"crypto/tls"
	"flag"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
)

const (
	version = "0.0.1"

	infoLogPrefix    = "INFO\t"
	errorLogPrefix   = "ERROR\t"
	warningLogPrefix = "WARNING\t"
)

type config struct {
	url  string
	port int
	env  string
	tls  struct {
		enabled bool
		key     string
		crt     string
	}
}

type application struct {
	config     config
	infoLog    *log.Logger
	errorLog   *log.Logger
	warningLog *log.Logger
	version    string

	airports Airports
}

func (app *application) serve() error {

	srv := &http.Server{
		Addr:     fmt.Sprintf("%s:%d", app.config.url, app.config.port),
		Handler:  http.Handler(app.routes()),
		ErrorLog: app.errorLog,
		TLSConfig: &tls.Config{
			NextProtos: []string{"h2", "http/1.1"},
		},
	}

	url := app.config.url
	if url == "" {
		url = "localhost"
	}
	msg := fmt.Sprintf("Flight app v%s is ready on %s://%s:%d\n", version, "%s", url, app.config.port)
	if app.config.tls.enabled {
		app.infoLog.Printf(msg, "https")
		return srv.ListenAndServeTLS(app.config.tls.crt, app.config.tls.key)

	} else {
		app.infoLog.Printf(msg, "http")
		return srv.ListenAndServe()
	}
}

func parseFlags() (config, bool) {
	var cfg config
	var isPrintVersion bool

	flag.StringVar(&cfg.url, "url", "", "Server URL (default empty - the app will listen on all network interfaces)")
	flag.IntVar(&cfg.port, "port", 4000, "Server port")
	flag.StringVar(&cfg.env, "env", "prod", "Environment {dev|prod}")
	flag.BoolVar(&isPrintVersion, "version", false, "Prints current version")
	flag.BoolVar(&cfg.tls.enabled, "enable-https", false, "Enable TLS/HTTPS")
	flag.StringVar(&cfg.tls.key, "key", "certs/localhost-key.pem", "private key path")
	flag.StringVar(&cfg.tls.crt, "cert", "certs/localhost.pem", "certificate path")
	flag.Parse()

	return cfg, isPrintVersion
}

func setupLogger() (*os.File, *log.Logger, *log.Logger, *log.Logger, error) {
	logf, err := os.OpenFile("flight-output.log", os.O_RDWR|os.O_CREATE|os.O_TRUNC, 0666)
	if err != nil {
		return nil, nil, nil, nil, fmt.Errorf("error opening file: %v", err)
	}
	multilog := io.MultiWriter(logf, os.Stdout)

	infoLog := log.New(multilog, infoLogPrefix, log.Ldate|log.Ltime)
	errorLog := log.New(multilog, errorLogPrefix, log.Ldate|log.Ltime|log.Lshortfile)
	warningLog := log.New(multilog, warningLogPrefix, log.Ldate|log.Ltime)

	return logf, infoLog, errorLog, warningLog, nil
}

func main() {
	var err error

	cfg, isPrintVersion := parseFlags()

	if isPrintVersion {
		fmt.Printf("Flight Version %s\n", version)
		os.Exit(0)
	}

	// configure logging
	logf, infoLog, errorLog, warningLog, err := setupLogger()
	if err != nil {
		fmt.Printf("Failed to setup logger: %v\n", err)
		os.Exit(1)
	}
	defer logf.Close()

	app := &application{
		config:     cfg,
		infoLog:    infoLog,
		errorLog:   errorLog,
		warningLog: warningLog,
		version:    version,
	}

	err = app.LoadAirports()
	if err != nil {
		fmt.Printf("Failed to load airports db: %v\n", err)
		os.Exit(1)
	}

	// main app
	err = app.serve()
	if err == http.ErrServerClosed {
		app.infoLog.Println("Bye! :)")
	} else {
		app.errorLog.Fatalln(err)
	}
}
