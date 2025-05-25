package grpc

import (
	"context"
	"server/internal/db"
	"server/internal/proto"
)

type ListingServiceServer struct {
	proto.UnimplementedListingServiceServer
}

func (s *ListingServiceServer) GetListing(ctx context.Context, req *proto.GetListingRequest) (*proto.GetListingResponse, error) {
	conn, err := db.Connect(ctx)
	if err != nil {
		return nil, err
	}

	listingRepository := db.NewListingsRepository()
	listing, err := listingRepository.GetListing(ctx, conn, req.GetId())
	if err != nil {
		return nil, err
	}

	floorArea, err := listing.FloorArea.Float64Value()
	if err != nil {
		return nil, err
	}

	lotArea, err := listing.LotArea.Float64Value()
	if err != nil {
		return nil, err
	}

	return &proto.GetListingResponse{
		Id:        listing.ID,
		Address:   listing.Address,
		Price:     listing.Price,
		FloorArea: floorArea.Float64,
		LotArea:   lotArea.Float64,
	}, nil
}
