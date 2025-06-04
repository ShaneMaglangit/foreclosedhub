package grpc

import (
	"context"
	"fmt"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/twpayne/go-geos"
	"math/rand"
	"server/internal/db"
	"server/internal/proto"
	"server/internal/service"
)

type ListingServiceServer struct {
	proto.UnimplementedListingServiceServer
	pool    *pgxpool.Pool
	service *service.ListingService
}

func NewListingServiceServer(pool *pgxpool.Pool) *ListingServiceServer {
	return &ListingServiceServer{
		service: service.NewListingService(pool),
	}
}

func (s *ListingServiceServer) GetListing(ctx context.Context, req *proto.GetListingRequest) (*proto.GetListingResponse, error) {
	listingRepository := db.NewListingsRepository()
	listing, err := listingRepository.GetListing(ctx, s.pool, req.GetId())
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
	listings, err := s.service.GetListingsInBoundaryWithImages(ctx, db.GetListingsInBoundaryParams{
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

	jitterCoordinates(listings)

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

		imageUrls := make([]string, len(listing.Images))
		for i, image := range listing.Images {
			imageUrls[i] = image.Url
		}

		listingMarkers = append(listingMarkers, &proto.Listing{
			Id:        listing.ID,
			Address:   listing.Address,
			Price:     listing.Price,
			FloorArea: floorArea.Float64,
			LotArea:   lotArea.Float64,
			Lng:       listing.Coordinate.X(),
			Lat:       listing.Coordinate.Y(),
			ImageUrls: imageUrls,
		})
	}

	return &proto.GetListingsInBoundaryResponse{Listings: listingMarkers}, nil
}

const jitterDistance = 0.00001

func jitterCoordinates(listings []*db.ListingWithImages) {
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
}
