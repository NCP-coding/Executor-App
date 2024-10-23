package utils

import (
	"context"
	comm "tls-grpc/pkg/common/proto"
	reg "tls-grpc/pkg/registry/proto"

	"google.golang.org/grpc"
	"google.golang.org/protobuf/types/known/emptypb"
)

type MockRegistryServiceClient struct {
	// Fields to hold mock behaviors for methods
	RegisterExecutorFunc   func(ctx context.Context, in *reg.RegisterRequest, opts ...grpc.CallOption) (*comm.SimpleResponse, error)
	UnregisterExecutorFunc func(ctx context.Context, in *reg.UnregisterRequest, opts ...grpc.CallOption) (*emptypb.Empty, error)
	ListExecutorsFunc      func(ctx context.Context, in *emptypb.Empty, opts ...grpc.CallOption) (*reg.ListResponse, error)
	SetExecutorStatusFunc  func(ctx context.Context, in *reg.SetExecutorStatusRequest, opts ...grpc.CallOption) (*comm.SimpleResponse, error)
	RemoteExecuteCmdFunc   func(ctx context.Context, in *reg.RemoteExecuteCmdRequest, opts ...grpc.CallOption) (*reg.RemoteExecuteCmdResponse, error)
}

func (m *MockRegistryServiceClient) RegisterExecutor(ctx context.Context, in *reg.RegisterRequest, opts ...grpc.CallOption) (*comm.SimpleResponse, error) {
	if m.RegisterExecutorFunc != nil {
		return m.RegisterExecutorFunc(ctx, in, opts...)
	}
	return nil, nil // or some default value
}

func (m *MockRegistryServiceClient) UnregisterExecutor(ctx context.Context, in *reg.UnregisterRequest, opts ...grpc.CallOption) (*emptypb.Empty, error) {
	if m.UnregisterExecutorFunc != nil {
		return m.UnregisterExecutorFunc(ctx, in, opts...)
	}
	return nil, nil // or some default value
}

func (m *MockRegistryServiceClient) ListExecutors(ctx context.Context, in *emptypb.Empty, opts ...grpc.CallOption) (*reg.ListResponse, error) {
	if m.ListExecutorsFunc != nil {
		return m.ListExecutorsFunc(ctx, in, opts...)
	}
	return nil, nil // or some default value
}

func (m *MockRegistryServiceClient) SetExecutorStatus(ctx context.Context, in *reg.SetExecutorStatusRequest, opts ...grpc.CallOption) (*comm.SimpleResponse, error) {
	if m.SetExecutorStatusFunc != nil {
		return m.SetExecutorStatusFunc(ctx, in, opts...)
	}
	return nil, nil // or some default value
}

func (m *MockRegistryServiceClient) RemoteExecuteCmd(ctx context.Context, in *reg.RemoteExecuteCmdRequest, opts ...grpc.CallOption) (*reg.RemoteExecuteCmdResponse, error) {
	if m.RemoteExecuteCmdFunc != nil {
		return m.RemoteExecuteCmdFunc(ctx, in, opts...)
	}
	return nil, nil // or some default value
}
