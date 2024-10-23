package executor

import (
	ex "tls-grpc/pkg/executor/proto"

	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

type ClientFactory interface {
	CreateClient(address string) (ex.ExecutorServiceClient, *grpc.ClientConn, error)
}

type DefaultClientFactory struct{}

func (s *DefaultClientFactory) CreateClient(address string) (ex.ExecutorServiceClient, *grpc.ClientConn, error) {
	conn, err := grpc.NewClient(address, grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		return nil, nil, err
	}
	client := ex.NewExecutorServiceClient(conn)
	return client, conn, nil
}
