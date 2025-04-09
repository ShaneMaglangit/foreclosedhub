package grpc

import (
	"fmt"
	"google.golang.org/grpc"
	"homagochi/internal/protobuf"
	"log"
	"net"
	"os"
)

func Serve() error {
	port := fmt.Sprintf(":%s", os.Getenv("GRPC_PORT"))

	listener, err := net.Listen("tcp", port)
	if err != nil {
		return err
	}

	server := grpc.NewServer()
	protobuf.RegisterListingServiceServer(server, NewListingServiceServer())

	log.Println("Starting gRPC server on " + port)
	return server.Serve(listener)
}
