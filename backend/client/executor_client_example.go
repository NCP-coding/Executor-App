package main

import (
	"context"
	"flag"
	"log"

	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"

	comm "tls-grpc/pkg/common/proto"
	ex "tls-grpc/pkg/executor/proto"
)

var (
	serverAddr = flag.String("serverAddr", "localhost:50051", "The server address in the format of host:port")
)

// main is the entry point of the application that establishes a connection
// to the executor gRPC server and executes a command using the ExecutorService client.
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

	client := ex.NewExecutorServiceClient(conn)

	resp, err := client.Execute(context.Background(), &comm.Command{
		Name:          "ls",
		Args:          nil,
		WaitForFinish: false,
	})

	if err != nil {
		log.Fatalf("Error %v", err)
	}
	log.Print(resp.String())
	log.Println("All done!")
}
