package main

import (
	"log"
	"tls-grpc/server"
)

func main() {
	cfg := server.NewConfig()

	srv, err := server.New(cfg)
	if err != nil {
		log.Fatalf("Failed to create server: %v", err)
	}

	srv.Run()
}
