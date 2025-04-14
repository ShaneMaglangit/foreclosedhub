package grpc

import (
	"fmt"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials"
	"homagochi/internal/protobuf"
	"log"
	"net"
	"os"
	"path/filepath"
)

const defaultPort = "50051"

func Serve() error {
	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}

	certDir := os.Getenv("CERTS_DIR")
	certFile := filepath.Join(certDir, "server.crt")
	keyFile := filepath.Join(certDir, "server.key")

	creds, err := credentials.NewServerTLSFromFile(certFile, keyFile)
	if err != nil {
		log.Fatalf("Failed to generate credentials %v", err)
	}

	listener, err := net.Listen("tcp", fmt.Sprintf(":%s", port))
	if err != nil {
		return err
	}

	server := grpc.NewServer(grpc.Creds(creds))
	protobuf.RegisterListingServiceServer(server, NewListingServiceServer())

	log.Println("Starting gRPC server on " + port)
	return server.Serve(listener)
}
