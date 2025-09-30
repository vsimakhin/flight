PORT=4000
ENV=dev

XC_OS ?= linux
XC_ARCH ?= amd64 arm64 arm
BIN="./dist"
BINARY_NAME="flight"
OPTIONS=-ldflags="-s -w" -trimpath

## clean: cleans all binaries and runs go clean
clean:
	@echo "Cleaning..."
	@- rm -rf dist/*
	@go clean
	@echo "Cleaned!"

fmt:
	@go fmt ./...

npm_install:
	@echo "Installing npm packages..."
	@cd app/ui && npm install
	@cd ../../

## build ui
build_ui: npm_install
	@echo "Building UI..."
	@cd app/ui && npm run build
	@cd ../../

## tests
test: fmt
	@go test -v ./... -coverpkg=./...

## build: builds the binary
build_backend: clean
	@echo "Building..."
	@go build -ldflags="-s -w" -o dist/flight ./app
	@echo "Flight built!"

## start: starts the flight
start: build_ui build_backend
	@echo "Starting the app..."
	@env ./dist/flight -port=${PORT} -env="${ENV}"

start_backend: clean build_backend
	@echo "Starting the app..."
	@env ./dist/flight -port=${PORT} -env="${ENV}"

build_linux_amd64: build_ui
	@OS=linux; ARCH=amd64; \
	echo Building $$OS/$$ARCH to $(BIN)/$(BINARY_NAME)-$$OS-$$ARCH; \
	CGO_ENABLED=0 GOOS=$$OS GOARCH=$$ARCH \
	go build $(OPTIONS) -o=$(BIN)/$(BINARY_NAME)-$$OS-$$ARCH/$(BINARY_NAME) ./app; \
	cd $(BIN); tar czf $(BINARY_NAME)-$$OS-$$ARCH.tar.gz $(BINARY_NAME)-$$OS-$$ARCH;

build_linux_arm64: build_ui
	@OS=linux; ARCH=arm64; \
	echo Building $$OS/$$ARCH to $(BIN)/$(BINARY_NAME)-$$OS-$$ARCH; \
	CGO_ENABLED=0 GOOS=$$OS GOARCH=$$ARCH \
	go build $(OPTIONS) -o=$(BIN)/$(BINARY_NAME)-$$OS-$$ARCH/$(BINARY_NAME) ./app; \
	cd $(BIN); tar czf $(BINARY_NAME)-$$OS-$$ARCH.tar.gz $(BINARY_NAME)-$$OS-$$ARCH;

build_all: clean build_ui test build_linux_amd64 build_linux_arm64
