package grpc

import (
	"google.golang.org/grpc"
	"homagochi/internal/pb"
	"log"
	"net"
)

const DEFAULT_PORT = ":8080"

func Serve() error {
	listener, err := net.Listen("tcp", DEFAULT_PORT)
	if err != nil {
		return err
	}

	server := grpc.NewServer()
	pb.RegisterListingServiceServer(server, &ListingServiceServer{})

	log.Println("Starting gRPC server on " + DEFAULT_PORT)
	return server.Serve(listener)
}
