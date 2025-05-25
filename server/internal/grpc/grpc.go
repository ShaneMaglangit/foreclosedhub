package grpc

import (
	"fmt"
	"google.golang.org/grpc"
	"log"
	"net"
	"os"
	"server/internal/proto"
)

const defaultPort = "50051"

func Serve() error {
	port := os.Getenv("GRPC_PORT")
	if port == "" {
		port = defaultPort
	}

	var server *grpc.Server

	server = grpc.NewServer()
	log.Println("Starting gRPC server in development mode (no TLS)")

	proto.RegisterHelloServiceServer(server, &HelloServiceServer{})
	proto.RegisterListingServiceServer(server, &ListingServiceServer{})

	listener, err := net.Listen("tcp", fmt.Sprintf(":%s", port))
	if err != nil {
		return nil
	}

	return server.Serve(listener)
}
