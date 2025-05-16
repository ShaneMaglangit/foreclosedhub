package main

import (
	"context"
	"fmt"
	"log"
	"net"
	"os"
	"server/internal/cron"
	"server/internal/proto"
)
import "google.golang.org/grpc"

const defaultPort = "50051"

type HelloServiceServer struct {
	proto.UnimplementedHelloServiceServer
}

func (s *HelloServiceServer) SayHello(ctx context.Context, req *proto.SayHelloRequest) (*proto.SayHelloResponse, error) {
	return &proto.SayHelloResponse{Body: "Hello world"}, nil
}

func main() {
	c := cron.Start()
	defer c.Stop()

	port := os.Getenv("GRPC_PORT")
	if port == "" {
		port = defaultPort
	}

	var server *grpc.Server

	server = grpc.NewServer()
	log.Println("Starting gRPC server in development mode (no TLS)")

	proto.RegisterHelloServiceServer(server, &HelloServiceServer{})

	listener, err := net.Listen("tcp", fmt.Sprintf(":%s", port))
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}

	if err = server.Serve(listener); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
