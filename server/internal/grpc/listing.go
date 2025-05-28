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

func (s *ListingServiceServer) GetListingMakers(ctx context.Context, req *proto.GetListingMarkersRequest) (*proto.GetListingMarkersResponse, error) {
	conn, err := db.Connect(ctx)
	if err != nil {
		return nil, err
	}

	listingRepository := db.NewListingsRepository()
	listings, err := listingRepository.GetListingsCoordinates(ctx, conn, db.GetListingCoordinatesParams{
		MinLng: req.GetMinLng(),
		MinLat: req.GetMinLat(),
		MaxLng: req.GetMaxLng(),
		MaxLat: req.GetMaxLat(),
	})

	if err != nil {
		return nil, err
	}

	var listingMarkers []*proto.ListingMarker
	for _, listing := range listings {
		listingMarkers = append(listingMarkers, &proto.ListingMarker{
			Id:  listing.ID,
			Lng: listing.Coordinate.X(),
			Lat: listing.Coordinate.Y(),
		})
	}

	return &proto.GetListingMarkersResponse{ListingMarkers: listingMarkers}, nil
}
