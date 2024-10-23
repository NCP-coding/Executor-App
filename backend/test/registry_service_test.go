package service_test

import (
	"context"
	"testing"

	"github.com/stretchr/testify/assert"
	"google.golang.org/grpc"
	"google.golang.org/protobuf/types/known/emptypb"

	comm "tls-grpc/pkg/common/proto"
	reg "tls-grpc/pkg/registry/proto"
	sut "tls-grpc/server/registry"
	"tls-grpc/test/utils"
)

func TestRegistryService_RegisterExecutorAndCallListExecutorWorks(t *testing.T) {

	s := sut.NewService()

	ctx := utils.CreateTestContext()

	response, err := s.RegisterExecutor(ctx, &reg.RegisterRequest{
		Port: "5050",
		Tags: nil,
	})

	assert.NoError(t, err)
	assert.NotNil(t, response)
	assert.Equal(t, comm.Code_OK, response.Code)

	list, err := s.ListExecutors(context.Background(), &emptypb.Empty{})
	assert.NoError(t, err)
	assert.NotNil(t, list)

	assert.Equal(t, 1, len(list.Executors))
	assert.Equal(t, "127.0.0.1:5050", list.Executors[0].IpAddr)
}
func TestRegistryService_UnregisterRequestDoesNotReturnError(t *testing.T) {

	s := sut.NewService()

	ctx := utils.CreateTestContext()

	_, err := s.UnregisterExecutor(ctx, &reg.UnregisterRequest{
		Port: "5050",
	})
	assert.NoError(t, err)

	list, err := s.ListExecutors(context.Background(), &emptypb.Empty{})
	assert.NoError(t, err)
	assert.NotNil(t, list)

	assert.Equal(t, 0, len(list.Executors))
}

func TestRegistryService_SetExecutorStatusReturnsErrorForNotExistingExecutor(t *testing.T) {

	s := sut.NewService()

	ctx := utils.CreateTestContext()

	_, err := s.SetExecutorStatus(ctx, &reg.SetExecutorStatusRequest{
		Status: reg.Status_OFFLINE,
	})

	assert.NotNil(t, err)
	assert.Contains(t, err.Error(), "not found")
}

func TestRegistryService_RemoteExecuteCmdForwardsCmdToClient(t *testing.T) {
	mockFactory := &utils.MockRegistryClientFactory{
		MockClient: utils.MockExecutorServiceClient{
			ExecuteFunc: func(ctx context.Context, in *comm.Command, opts ...grpc.CallOption) (*comm.SimpleResponse, error) {

				return &comm.SimpleResponse{
					Code:    comm.Code_OK,
					Message: in.Name}, nil
			},
		},
	}

	s := sut.NewServiceWithFactoryMethod(mockFactory)

	ctx := utils.CreateTestContext()

	r, err := s.RegisterExecutor(ctx, &reg.RegisterRequest{
		Port: "5050",
		Tags: nil,
	})

	assert.NoError(t, err)
	assert.NotNil(t, r)
	assert.Equal(t, comm.Code_OK, r.Code)

	list, err := s.ListExecutors(context.Background(), &emptypb.Empty{})
	assert.NoError(t, err)
	assert.NotNil(t, list)

	exec, err := s.RemoteExecuteCmd(context.Background(), &reg.RemoteExecuteCmdRequest{
		Uuids: []string{list.Executors[0].Uuid},
		Cmd: &comm.Command{
			Name:          "All good",
			Args:          []string{},
			WaitForFinish: true,
		},
	})

	assert.NoError(t, err)
	assert.NotNil(t, exec)
	assert.Equal(t, 1, len(exec.Response))
	assert.Equal(t, comm.Code_OK, exec.Response[0].Code)
	assert.Equal(t, "All good", exec.Response[0].Message)
}

func TestRegistryService_RemoteExecuteCmdFiltersCorrectByUUIDandTags(t *testing.T) {
	mockFactory := &utils.MockRegistryClientFactory{
		MockClient: utils.MockExecutorServiceClient{
			ExecuteFunc: func(ctx context.Context, in *comm.Command, opts ...grpc.CallOption) (*comm.SimpleResponse, error) {

				return &comm.SimpleResponse{
					Code:    comm.Code_OK,
					Message: in.Name}, nil
			},
		},
	}

	s := sut.NewServiceWithFactoryMethod(mockFactory)

	ctx := utils.CreateTestContextWithIp("127.0.0.1:0")
	_, err := s.RegisterExecutor(ctx, &reg.RegisterRequest{
		Port: "5050",
		Tags: []string{"x86", "main"},
	})

	assert.NoError(t, err)

	ctx = utils.CreateTestContextWithIp("127.0.0.2:0")
	_, err = s.RegisterExecutor(ctx, &reg.RegisterRequest{
		Port: "5051",
		Tags: []string{"linux"},
	})

	assert.NoError(t, err)

	list, err := s.ListExecutors(context.Background(), &emptypb.Empty{})
	assert.NoError(t, err)
	assert.NotNil(t, list)
	assert.Equal(t, 2, len(list.Executors))

	// No UUID given should not cause error return empty exec.Response
	exec, err := s.RemoteExecuteCmd(context.Background(), &reg.RemoteExecuteCmdRequest{
		Cmd: &comm.Command{
			Name:          "All good",
			Args:          []string{},
			WaitForFinish: true,
		},
	})

	assert.NoError(t, err)
	assert.NotNil(t, exec)
	assert.Empty(t, exec.Response)

	// Testing for UUID based filtering works
	exec, err = s.RemoteExecuteCmd(context.Background(), &reg.RemoteExecuteCmdRequest{
		Uuids: []string{list.Executors[0].Uuid},
		Cmd: &comm.Command{
			Name:          "All good",
			Args:          []string{},
			WaitForFinish: true,
		},
	})

	assert.NoError(t, err)
	assert.NotNil(t, exec)
	assert.Equal(t, 1, len(exec.Response))
	assert.Equal(t, exec.Response[0].Uuid, list.Executors[0].Uuid)

	// Testing for tag based filtering works
	exec, err = s.RemoteExecuteCmd(context.Background(), &reg.RemoteExecuteCmdRequest{
		Tags: []string{"x86"},
		Cmd: &comm.Command{
			Name:          "All good",
			Args:          []string{},
			WaitForFinish: true,
		},
	})

	assert.NoError(t, err)
	assert.NotNil(t, exec)
	assert.Equal(t, 1, len(exec.Response))

	// Testing for UUID and Tag based filtering works
	exec, err = s.RemoteExecuteCmd(context.Background(), &reg.RemoteExecuteCmdRequest{
		Uuids: []string{list.Executors[0].Uuid},
		Tags:  list.Executors[0].Tags,
		Cmd: &comm.Command{
			Name:          "All good",
			Args:          []string{},
			WaitForFinish: true,
		},
	})

	assert.NoError(t, err)
	assert.NotNil(t, exec)
	assert.Equal(t, 1, len(exec.Response))
	assert.Equal(t, exec.Response[0].Uuid, list.Executors[0].Uuid)

	// Testing for UUID and Tag based filtering if one or the other match it should run the cmd
	exec, err = s.RemoteExecuteCmd(context.Background(), &reg.RemoteExecuteCmdRequest{
		Uuids: []string{list.Executors[0].Uuid},
		Tags:  []string{"Does not exist"},
		Cmd: &comm.Command{
			Name:          "All good",
			Args:          []string{},
			WaitForFinish: true,
		},
	})

	assert.NoError(t, err)
	assert.NotNil(t, exec)
	assert.Equal(t, 1, len(exec.Response))
}
