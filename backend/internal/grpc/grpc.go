package grpc

import (
	"fmt"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials"
	"homagochi/internal/protobuf"
	"homagochi/internal/utils"
	"log"
	"net"
	"os"
	"path/filepath"
)

const defaultPort = "50051"

func Serve() error {
	port := os.Getenv("GRPC_PORT")
	if port == "" {
		port = defaultPort
	}

	var server *grpc.Server

	if utils.IsDevelopment() {
		server = grpc.NewServer()
		log.Println("Starting gRPC server in development mode (no TLS)")
	} else {
		certDir := os.Getenv("CERTS_DIR")
		certFile := filepath.Join(certDir, "server.crt")
		keyFile := filepath.Join(certDir, "server.key")

		creds, err := credentials.NewServerTLSFromFile(certFile, keyFile)
		if err != nil {
			log.Fatalf("Failed to generate credentials: %v", err)
		}

		server = grpc.NewServer(grpc.Creds(creds))
		log.Println("Starting gRPC server in production mode (TLS enabled)")
	}

	protobuf.RegisterListingServiceServer(server, NewListingServiceServer())
	listener, err := net.Listen("tcp", fmt.Sprintf(":%s", port))

	if err != nil {
		return err
	}

	return server.Serve(listener)
}
