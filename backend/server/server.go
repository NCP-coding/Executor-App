package server

import (
	"context"
	"flag"
	"fmt"
	"log"
	"net"
	"net/http"
	"os"
	"os/signal"
	"strconv"
	"syscall"

	"tls-grpc/helper"
	ex "tls-grpc/pkg/executor/proto"
	reg "tls-grpc/pkg/registry/proto"

	"tls-grpc/server/executor"
	"tls-grpc/server/registry"

	"github.com/grpc-ecosystem/grpc-gateway/v2/runtime"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

// Config holds the configuration for server instance
type Config struct {
	ListenPort             int
	RegistryMode           bool
	RegistryGRPCAddr       string
	RegistryHTTPListenPort int
}

// NewConfig creates a config for a server instance
func NewConfig() Config {
	var cfg Config

	flag.IntVar(&cfg.ListenPort, "listenPort", 0, "The port the application is listening on")
	flag.BoolVar(&cfg.RegistryMode, "registryMode", false, "True for running in registry mode")
	flag.StringVar(&cfg.RegistryGRPCAddr, "registryGrpcAddr", ":50051", "<IP:PORT> of the registry grpc server, needed if not in registry mode")
	flag.IntVar(&cfg.RegistryHTTPListenPort, "registryHttpListenPort", 8081, "PORT of the registry http rest api server, only used in registry mode")

	flag.Parse()

	return cfg
}

// Server represents the gRPC server instance
type Server struct {
	config     Config
	grpcServer *grpc.Server
	listener   net.Listener
}

// New initializes a new Server instance with the provided configuration
// It creates a network listener for initialization of a gRPC server. If any step fails, it returns an error.
//
// Parameters:
// - cfg: Configuration settings for initializing the server.
//
// Returns:
// - *Server: A pointer to the initialized Server instance.
func New(cfg Config) (*Server, error) {
	listener, err := creatNetListener(cfg)
	if err != nil {
		return nil, err
	}
	grpcServer, err := createGRPCServer(cfg, listener)
	if err != nil {
		return nil, err
	}
	return &Server{
		config:     cfg,
		grpcServer: grpcServer,
		listener:   listener,
	}, nil
}

func creatNetListener(cfg Config) (net.Listener, error) {
	addr := cfg.RegistryGRPCAddr
	if !cfg.RegistryMode {
		addr = fmt.Sprintf(":%d", cfg.ListenPort)
	}

	return net.Listen("tcp", addr)
}

func createGRPCServer(cfg Config, listener net.Listener) (*grpc.Server, error) {
	grpcServer := grpc.NewServer()
	if cfg.RegistryMode {
		reg.RegisterRegistryServiceServer(grpcServer, registry.NewService())
	} else {
		conn, err := grpc.NewClient(cfg.RegistryGRPCAddr, grpc.WithTransportCredentials(insecure.NewCredentials()))
		if err != nil {
			return nil, fmt.Errorf("fail to dial: %v", err)
		}
		client := reg.NewRegistryServiceClient(conn)

		grpcAddr := listener.Addr()
		grpcListenerPort := strconv.Itoa(grpcAddr.(*net.TCPAddr).Port)
		executerService, err := executor.NewService(client, grpcListenerPort)
		if err != nil {
			return nil, fmt.Errorf("fail to intialize executer service: %v", err)
		}
		ex.RegisterExecutorServiceServer(grpcServer, executerService)
		go handleSigTerm(grpcServer, executerService)
	}
	return grpcServer, nil
}

func handleSigTerm(grpcServer *grpc.Server, executerService *executor.Service) {
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, os.Interrupt, syscall.SIGTERM)

	<-sigChan
	log.Println("Received CTRL+C\nShutting down and unregistering executor...")
	executerService.Shutdown()
	grpcServer.GracefulStop()
	os.Exit(0)
}

// Run starts the grpc server and if in registry mode the grpc gateway as well
func (s *Server) Run() {
	log.Printf("Started grpc server %v", s.listener.Addr().String())
	if s.config.RegistryMode {
		go s.serveGRPC()
		s.startgrpcGateway()
	} else {
		s.serveGRPC()
	}
}

func (s *Server) serveGRPC() {
	if err := s.grpcServer.Serve(s.listener); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}

func (s *Server) startgrpcGateway() {
	conn, err := grpc.NewClient(s.config.RegistryGRPCAddr, grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		log.Fatalf("fail to dial: %v", err)
	}
	defer conn.Close()

	gwmux := runtime.NewServeMux()

	err = reg.RegisterRegistryServiceHandler(context.Background(), gwmux, conn)
	if err != nil {
		log.Fatalln("Failed to register gateway:", err)
	}

	gwServer := &http.Server{
		Addr:    fmt.Sprintf(":%d", s.config.RegistryHTTPListenPort),
		Handler: helper.Cors(gwmux),
	}

	log.Printf("Serving gRPC-Gateway on http://0.0.0.0:%v", s.config.RegistryHTTPListenPort)
	log.Fatalln(gwServer.ListenAndServe())
}
