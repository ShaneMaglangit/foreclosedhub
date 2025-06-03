package grpc

import (
	"context"
	"fmt"
	"google.golang.org/grpc"
	"log"
	"net"
	"os"
	"server/internal/db"
	"server/internal/proto"
)

const defaultPort = "50051"

func Serve() error {
	port := os.Getenv("GRPC_PORT")
	if port == "" {
		port = defaultPort
	}

	ctx := context.Background()
	pool, err := db.Connect(ctx)
	if err != nil {
		return fmt.Errorf("failed to connect to DB: %w", err)
	}
	defer pool.Close()

	server := grpc.NewServer()
	log.Println("Starting gRPC server in development mode (no TLS)")

	listingService := &ListingServiceServer{
		pool: pool,
	}
	proto.RegisterListingServiceServer(server, listingService)

	listener, err := net.Listen("tcp", fmt.Sprintf(":%s", port))
	if err != nil {
		return fmt.Errorf("failed to listen on port %s: %w", port, err)
	}

	return server.Serve(listener)
}
