package grpc

import (
	"fmt"
	"github.com/jackc/pgx/v5/pgxpool"
	"google.golang.org/grpc"
	"log"
	"net"
	"os"
	"server/internal/proto"
)

const defaultPort = "50051"

func Serve(pool *pgxpool.Pool) error {
	port := os.Getenv("GRPC_PORT")
	if port == "" {
		port = defaultPort
	}

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
