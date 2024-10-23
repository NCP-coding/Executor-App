package main

import (
	"context"
	"flag"
	"log"

	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"

	reg "tls-grpc/pkg/registry/proto"
)

var (
	serverAddr = flag.String("serverAddr", "localhost:50051", "The server address in the format of host:port")
)

// main is the entry point of the application that establishes a connection
// to the registry gRPC server and registers a executor using the RegistryServiceClient client.
//
// Example usage:
//
//	go run main.go -serverAddr=<address>
//
// Flags:
//
//	-serverAddr string
//	     The address of the gRPC server to connect to (e.g., "localhost:50051").
func main() {
	flag.Parse()

	conn, err := grpc.NewClient(*serverAddr, grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		log.Fatalf("fail to dial: %v", err)
	}
	defer conn.Close()

	client := reg.NewRegistryServiceClient(conn)

	resp, err := client.RegisterExecutor(context.Background(), &reg.RegisterRequest{
		Port: "50052",
		Tags: nil,
	})

	if err != nil {
		log.Fatalf("cannot rtegister executor: %v", err)
	}

	log.Print(resp.String())
	log.Println("All done!")
}
