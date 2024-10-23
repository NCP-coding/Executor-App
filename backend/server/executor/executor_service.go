package executor

import (
	"bufio"
	"bytes"
	"context"
	"fmt"
	"log"
	"os/exec"
	"time"
	comm "tls-grpc/pkg/common/proto"
	ex "tls-grpc/pkg/executor/proto"
	reg "tls-grpc/pkg/registry/proto"
)

// Service represents the gRPC server for the Executor service
type Service struct {
	ex.UnimplementedExecutorServiceServer
	registryClient reg.RegistryServiceClient
	grpcPort       string
}

// NewService creates and returns a new Service instance with the provided registry client and gRPC port
// It initializes the service and registers it with the registry service.
//
// Parameters:
// - registryClient: The client used to register the executor service with the registry.
// - grpcPort: The port on which the gRPC server listens.
//
// Returns:
// - *Service: A pointer to the newly created Service instance.
// - error: An error if the service initialization or registration fails.
func NewService(registryClient reg.RegistryServiceClient, grpcPort string) (*Service, error) {
	service := &Service{
		registryClient: registryClient,
		grpcPort:       grpcPort,
	}
	err := service.Init()

	if err != nil {
		return nil, err
	}
	return service, nil
}

// Init registers executor with the registry service
func (s *Service) Init() error {
	resp, err := s.registryClient.RegisterExecutor(context.Background(), &reg.RegisterRequest{
		Port: s.grpcPort,
		Tags: []string{"linux", "x86"},
	})
	if err != nil {
		return err
	}
	if resp.Code != comm.Code_OK {
		return fmt.Errorf("failed to register executer  %v: %v", resp.Code, resp.Message)
	}
	return nil
}

// Shutdown unregisters executor from registry service
func (s *Service) Shutdown() {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	s.registryClient.UnregisterExecutor(ctx, &reg.UnregisterRequest{
		Port: s.grpcPort,
	})
}

// Execute executes command request
func (s *Service) Execute(ctx context.Context, command *comm.Command) (*comm.SimpleResponse, error) {
	buffer := bytes.NewBuffer(nil)
	readWrite := bufio.NewReadWriter(bufio.NewReader(buffer), bufio.NewWriter(buffer))

	log.Printf("Recieved command %v", command.String())
	exe := exec.Command(command.Name, command.Args...)
	exe.Stdout = readWrite
	exe.Stderr = readWrite

	var err error
	if command.WaitForFinish {
		err = exe.Run()
	} else {
		err = exe.Start()
	}

	if err != nil {
		return &comm.SimpleResponse{
			Code:    comm.Code_ERROR,
			Message: fmt.Sprintf("Command executed %v %v: %v", command.Name, command.Args, err),
		}, nil
	}
	readWrite.Flush()

	return &comm.SimpleResponse{
		Code:    comm.Code_OK,
		Message: fmt.Sprintf("Command executed %v %v\n%v", command.Name, command.Args, buffer.String()),
	}, nil
}
