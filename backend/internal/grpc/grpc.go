package grpc

import (
	"fmt"
	"google.golang.org/grpc"
	"homagochi/internal/protobuf"
	"log"
	"net"
	"os"
)

const defaultPort = "8080"

func Serve() error {
	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}

	listener, err := net.Listen("tcp", fmt.Sprintf(":%s", port))
	if err != nil {
		return err
	}

	server := grpc.NewServer()
	protobuf.RegisterListingServiceServer(server, NewListingServiceServer())

	log.Println("Starting gRPC server on " + port)
	return server.Serve(listener)
}
