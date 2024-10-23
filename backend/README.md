# Executor App Backend

Welcome to the Executor App Backend project! This project serves as the backend for managing and executing commands across a fleet of executors. The implementation is based on grpc proto files which are the service definitions and used for the stub generation.
## Table of Contents

- [Technologies](#technologies)
- [Setup](#setup)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)

## Technologies

- **Golang**: The primary programming language.
- **gRPC**: For efficient communication between microservices.
- **http**: Http REST API server for frontend to backend communication.

## Setup

### Prerequisites

- Go (1.16 or higher)


### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/executor-app.git
    cd executor-app/backend
   

2. Install dependencies:
    ```sh
    sudo apt update
    sudo apt install golang-go
    go install golang.org/x/lint/golint@latest
    sudo apt install -y protobuf-compiler
    go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
    go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest
    go install github.com/grpc-ecosystem/grpc-gateway/v2/protoc-gen-grpc-gateway@latest
    go install github.com/grpc-ecosystem/grpc-gateway/v2/protoc-gen-openapiv2@latest
    npm install -g ts-protoc-gen
    ```

3. Run the registry server:
    ```sh
    go run main.go --registryMode
    ```

4. Run the executor servers:
  ```sh
  go run main.go
  ```

## Usage

1. Ensure the registry server is running.
2. Use Postman or any API client to interact with the API endpoints.

## API Endpoints

- **POST /v1/cmd**: Execute a command on a specified executor.
- **GET /api/v1/executors**: Retrieve a list of registered executors.

### Example Request
Execute command on executors with a "linux" tag.
```sh
curl -X POST http://localhost:8081/v1/cmd \
    -H "Content-Type: application/json" \
    -d '{
        "tags": ["linux"],
        "cmd": {
           "name": "ls",
            "args": [
              "-lah"
            ],
            "waitForFinish": true
        }
    }'
```