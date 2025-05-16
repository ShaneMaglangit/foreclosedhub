package grpc

import (
	"context"
	"server/internal/proto"
)

type HelloServiceServer struct {
	proto.UnimplementedHelloServiceServer
}

func (s *HelloServiceServer) SayHello(ctx context.Context, req *proto.SayHelloRequest) (*proto.SayHelloResponse, error) {
	return &proto.SayHelloResponse{Body: "Hello world"}, nil
}
