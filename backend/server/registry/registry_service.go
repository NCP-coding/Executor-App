package registry

import (
	"context"
	"fmt"
	"log"
	"strings"
	"sync"

	"github.com/google/uuid"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/metadata"
	"google.golang.org/grpc/peer"
	"google.golang.org/grpc/status"
	"google.golang.org/protobuf/types/known/emptypb"

	"tls-grpc/client/executor"
	"tls-grpc/helper"
	comm "tls-grpc/pkg/common/proto"
	reg "tls-grpc/pkg/registry/proto"
)

// Service represents the gRPC server for the Registry service
type Service struct {
	reg.UnimplementedRegistryServiceServer
	mutex                 sync.RWMutex
	executorMap           map[string]*reg.Executor
	registryClientFactory executor.ClientFactory
}

// NewService creates and returns a new instance of the Service struct
//
// Returns:
// - *Service: A pointer to the newly created Service instance.
func NewService() *Service {
	return &Service{
		executorMap:           map[string]*reg.Executor{},
		registryClientFactory: &executor.DefaultClientFactory{},
	}
}

// NewServiceWithFactoryMethod is used for unit testing
func NewServiceWithFactoryMethod(clientFactory executor.ClientFactory) *Service {
	return &Service{
		executorMap:           map[string]*reg.Executor{},
		registryClientFactory: clientFactory,
	}
}

func (s *Service) GetUUIDFromContextAndPort(ctx context.Context, port string) (uuid.UUID, string, error) {
	peer, ok := peer.FromContext(ctx)
	if !ok {
		return uuid.Nil, "", fmt.Errorf("no peer context")
	}
	registerAddr, err := helper.ReplacePortInAddr(peer.Addr.String(), port)
	if err != nil {
		return uuid.Nil, "", err
	}

	uuid := helper.GenerateUUIDFromIPAddr(strings.Split(registerAddr, ":")[0])

	return uuid, registerAddr, nil
}

func (s *Service) RegisterExecutor(ctx context.Context, registerRequest *reg.RegisterRequest) (*comm.SimpleResponse, error) {
	uuid, registerAddr, err := s.GetUUIDFromContextAndPort(ctx, registerRequest.Port)
	if err != nil {
		return nil, status.Errorf(codes.Internal, "%v", err)
	}
	log.Printf("Registering executor with uuid %v and address %v", uuid, registerAddr)

	s.mutex.Lock()
	defer s.mutex.Unlock()

	_, ok := s.executorMap[uuid.String()]
	if ok {
		return &comm.SimpleResponse{
			Code:    comm.Code_NOOP,
			Message: fmt.Sprintf("Executor with UUID: %s already exists", uuid),
		}, nil
	}

	s.executorMap[uuid.String()] = &reg.Executor{
		Uuid:   uuid.String(),
		IpAddr: registerAddr,
		Status: reg.Status_ONLINE,
		Tags:   registerRequest.Tags,
	}

	return &comm.SimpleResponse{
		Code:    comm.Code_OK,
		Message: fmt.Sprintf("Added peer with uuid %s and address %s to registry", uuid, registerAddr),
	}, nil
}

func (s *Service) UnregisterExecutor(ctx context.Context, unregisterRequest *reg.UnregisterRequest) (*emptypb.Empty, error) {
	uuid, registerAddr, err := s.GetUUIDFromContextAndPort(ctx, unregisterRequest.Port)
	if err != nil {
		return nil, status.Errorf(codes.Internal, "%v", err)
	}
	log.Printf("Unregistering executor with uuid %v and address %v", uuid, registerAddr)

	s.mutex.Lock()
	defer s.mutex.Unlock()

	delete(s.executorMap, uuid.String())

	return &emptypb.Empty{}, nil
}

func (s *Service) ListExecutors(ctx context.Context, in *emptypb.Empty) (*reg.ListResponse, error) {
	log.Printf("Listing registered executors")
	s.mutex.RLock()
	defer s.mutex.RUnlock()

	resp := &reg.ListResponse{}
	for _, executors := range s.executorMap {
		resp.Executors = append(resp.Executors, executors)
	}
	return resp, nil
}

func (s *Service) SetExecutorStatus(ctx context.Context, in *reg.SetExecutorStatusRequest) (*comm.SimpleResponse, error) {
	peer, ok := peer.FromContext(ctx)
	if !ok {
		return nil, status.Errorf(codes.Internal, "no peer context")
	}

	uuid := helper.GenerateUUIDFromIPAddr(peer.Addr.String())
	log.Printf("Ping from executor with uuid %v recieved", uuid)

	s.mutex.Lock()
	defer s.mutex.Unlock()

	oldExecutor, ok := s.executorMap[uuid.String()]
	if !ok {
		return nil, status.Errorf(codes.Internal, "executor with uuid %v not found", uuid)
	}

	oldExecutor.Status = in.Status

	return &comm.SimpleResponse{
		Code:    comm.Code_OK,
		Message: fmt.Sprintf("Status to %v updated", in.Status),
	}, nil
}

func (s *Service) RemoteExecuteCmd(ctx context.Context, remoteExecuteRequest *reg.RemoteExecuteCmdRequest) (*reg.RemoteExecuteCmdResponse, error) {
	log.Printf("Remote executing %v", remoteExecuteRequest.String())

	s.mutex.RLock()
	defer s.mutex.RUnlock()

	uuidSet := make(map[string]bool)
	if remoteExecuteRequest.Uuids != nil {
		for _, uuid := range remoteExecuteRequest.Uuids {
			uuidSet[uuid] = true
		}
	}
	tagSet := make(map[string]bool)
	if remoteExecuteRequest.Tags != nil {
		for _, tag := range remoteExecuteRequest.Tags {
			tagSet[tag] = true
		}
	}

	var wg sync.WaitGroup
	var mu sync.Mutex
	var resp []*reg.CommandResponse
	for _, executor := range s.executorMap {
		if executor.Status != reg.Status_ONLINE {
			log.Printf("Skipping executor %v cmd execution due to state not beeing online instead being: %v", executor.Uuid, executor.Status)
			break
		}
		_, uidFound := uuidSet[executor.Uuid]
		var tagFound = false
		for _, executorTag := range executor.Tags {
			_, ok := tagSet[executorTag]
			if ok {
				tagFound = true
				break
			}
		}
		if !uidFound && !tagFound {
			log.Printf("Skipping executor %v since no tag or uuid match", executor.Uuid)
			break
		}
		wg.Add(1)
		go func() {
			defer wg.Done()

			executorClient, conn, err := s.registryClientFactory.CreateClient(executor.IpAddr)
			if err != nil {
				log.Printf("Error: Failed to create registry client: %v", err)
				return
			}
			if conn != nil {
				defer conn.Close()
			}

			executorResponse, err := executorClient.Execute(context.Background(), remoteExecuteRequest.Cmd)
			if err != nil {
				log.Printf("Error: failed to execute cmd request: %v", err)
				return
			}

			log.Println(executorResponse.String())
			mu.Lock()
			defer mu.Unlock()
			resp = append(resp, &reg.CommandResponse{
				Code:    executorResponse.Code,
				Message: executorResponse.Message,
				Uuid:    executor.Uuid,
			})
		}()
	}
	wg.Wait()

	md := metadata.Pairs("Content-Type", "application/json")
	grpc.SendHeader(ctx, md)

	return &reg.RemoteExecuteCmdResponse{
		Response: resp,
	}, nil
}
