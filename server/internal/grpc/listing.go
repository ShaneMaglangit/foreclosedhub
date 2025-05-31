package grpc

import (
	"context"
	"fmt"
	"github.com/twpayne/go-geos"
	"math/rand"
	"server/internal/db"
	"server/internal/proto"
)

type ListingServiceServer struct {
	proto.UnimplementedListingServiceServer
}

func (s *ListingServiceServer) GetListing(ctx context.Context, req *proto.GetListingRequest) (*proto.GetListingResponse, error) {
	pool, err := db.Connect(ctx)
	if err != nil {
		return nil, err
	}
	defer pool.Close()

	listingRepository := db.NewListingsRepository()
	listing, err := listingRepository.GetListing(ctx, pool, req.GetId())
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
		Listing: &proto.Listing{
			Id:        listing.ID,
			Address:   listing.Address,
			Price:     listing.Price,
			FloorArea: floorArea.Float64,
			LotArea:   lotArea.Float64,
			Lng:       listing.Coordinate.X(),
			Lat:       listing.Coordinate.Y(),
		},
	}, nil
}

func (s *ListingServiceServer) GetListingsInBoundary(ctx context.Context, req *proto.GetListingsInBoundaryRequest) (*proto.GetListingsInBoundaryResponse, error) {
	pool, err := db.Connect(ctx)
	if err != nil {
		return nil, err
	}
	defer pool.Close()

	listingRepository := db.NewListingsRepository()
	listings, err := listingRepository.GetListingsInBoundary(ctx, pool, db.GetListingsInBoundaryParams{
		MinLng:            req.GetMinLng(),
		MinLat:            req.GetMinLat(),
		MaxLng:            req.GetMaxLng(),
		MaxLat:            req.GetMaxLat(),
		Sources:           []db.Source{db.SourcePagibig, db.SourceSecbank},
		OccupancyStatuses: []db.OccupancyStatus{db.OccupancyStatusOccupied, db.OccupancyStatusOccupied, db.OccupancyStatusOccupied},
	})
	if err != nil {
		return nil, err
	}

	listings, err = jitterCoordinates(listings)
	if err != nil {
		return nil, err
	}

	var listingMarkers []*proto.Listing
	for _, listing := range listings {
		floorArea, err := listing.FloorArea.Float64Value()
		if err != nil {
			return nil, err
		}

		lotArea, err := listing.LotArea.Float64Value()
		if err != nil {
			return nil, err
		}

		listingMarkers = append(listingMarkers, &proto.Listing{
			Id:        listing.ID,
			Address:   listing.Address,
			Price:     listing.Price,
			FloorArea: floorArea.Float64,
			LotArea:   lotArea.Float64,
			Lng:       listing.Coordinate.X(),
			Lat:       listing.Coordinate.Y(),
		})
	}

	return &proto.GetListingsInBoundaryResponse{Listings: listingMarkers}, nil
}

const jitterDistance = 0.00001

func jitterCoordinates(listings []*db.Listing) ([]*db.Listing, error) {
	coordMap := make(map[string]int)

	for i, listing := range listings {
		key := fmt.Sprintf("%.8f,%.8f", listing.Coordinate.X(), listing.Coordinate.Y())

		count := coordMap[key]
		if count > 0 {
			newLng := listing.Coordinate.X() + (rand.Float64()*2-1)*jitterDistance
			newLat := listing.Coordinate.Y() + (rand.Float64()*2-1)*jitterDistance

			listings[i].Coordinate = geos.NewPointFromXY(newLng, newLat)

			key = fmt.Sprintf("%.8f,%.8f", newLng, newLat)
		}

		coordMap[key] = count + 1
	}

	return listings, nil
}
