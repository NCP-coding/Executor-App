package service_test

import (
	"context"
	"testing"

	"github.com/stretchr/testify/assert"
	"google.golang.org/grpc"

	comm "tls-grpc/pkg/common/proto"
	reg "tls-grpc/pkg/registry/proto"
	sut "tls-grpc/server/executor"
	"tls-grpc/test/utils"
)

func TestNewService_RegisterCalledDuringServiceCreation(t *testing.T) {
	mockClient := &utils.MockRegistryServiceClient{
		RegisterExecutorFunc: func(ctx context.Context, req *reg.RegisterRequest, opts ...grpc.CallOption) (*comm.SimpleResponse, error) {
			return &comm.SimpleResponse{Code: comm.Code_OK}, nil
		},
	}

	s, err := sut.NewService(mockClient, "1")
	assert.NoError(t, err)
	assert.NotNil(t, s)
}

func TestNewService_RegisterErrorDuringServiceCreation(t *testing.T) {
	mockClient := &utils.MockRegistryServiceClient{
		RegisterExecutorFunc: func(ctx context.Context, req *reg.RegisterRequest, opts ...grpc.CallOption) (*comm.SimpleResponse, error) {
			return &comm.SimpleResponse{Code: comm.Code_ERROR}, nil
		},
	}

	_, err := sut.NewService(mockClient, "1")
	assert.Error(t, err)
}
