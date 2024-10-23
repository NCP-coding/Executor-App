package utils

import (
	"context"
	"errors"
	"tls-grpc/pkg/common/proto"
	ex "tls-grpc/pkg/executor/proto"

	"google.golang.org/grpc"
)

type MockExecutorServiceClient struct {
	// Fields to hold mock behaviors for methods
	ExecuteFunc          func(ctx context.Context, in *proto.Command, opts ...grpc.CallOption) (*proto.SimpleResponse, error)
	ExecuteStreamingFunc func(ctx context.Context, in *proto.Command, opts ...grpc.CallOption) (grpc.ServerStreamingClient[proto.SimpleResponse], error)
}

// Execute method for the mock client (using pointer receiver)
func (m *MockExecutorServiceClient) Execute(ctx context.Context, in *proto.Command, opts ...grpc.CallOption) (*proto.SimpleResponse, error) {
	if m.ExecuteFunc != nil {
		return m.ExecuteFunc(ctx, in, opts...)
	}
	return nil, errors.New("mock Execute method not implemented")
}

// ExecuteStreaming method for the mock client (using pointer receiver)
func (m *MockExecutorServiceClient) ExecuteStreaming(ctx context.Context, in *proto.Command, opts ...grpc.CallOption) (grpc.ServerStreamingClient[proto.SimpleResponse], error) {
	if m.ExecuteStreamingFunc != nil {
		return m.ExecuteStreamingFunc(ctx, in, opts...)
	}
	return nil, errors.New("mock ExecuteStreaming method not implemented")
}

type MockRegistryClientFactory struct {
	MockClient MockExecutorServiceClient
}

func (s *MockRegistryClientFactory) CreateClient(address string) (ex.ExecutorServiceClient, *grpc.ClientConn, error) {
	return &s.MockClient, nil, nil
}
