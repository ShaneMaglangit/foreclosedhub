package grpc

import (
	"context"
	"google.golang.org/grpc"
	"homagochi/internal/db"
	"homagochi/internal/pb"
	"log"
	"net"
)

const DEFAULT_PORT = ":8080"

type ListingServiceServer struct {
	pb.UnimplementedListingServiceServer
}

func (server *ListingServiceServer) GetListings(ctx context.Context, request *pb.GetListingsRequest) (*pb.GetListingsResponse, error) {
	pool, err := db.Connect(ctx)
	if err != nil {
		return nil, err
	}
	defer pool.Close()

	listingsRepository := db.NewListingsRepository()
	listings, err := listingsRepository.GetListings(ctx, pool, 20)
	if err != nil {
		return nil, err
	}

	listingIds := make([]int64, 0, len(listings))
	for _, listing := range listings {
		listingIds = append(listingIds, listing.ID)
	}

	listingImagesRepository := db.NewListingImagesRepository()
	images, err := listingImagesRepository.GetListingImagesByListingIds(ctx, pool, listingIds)
	if err != nil {
		return nil, err
	}

	listingImagesLookup := make(map[int64][]string, len(listings))
	for _, image := range images {
		listingImagesLookup[image.ListingID] = append(listingImagesLookup[image.ListingID], image.Url)
	}

	listingsWithImages := make([]*pb.Listing, 0, len(listings))
	for _, listing := range listings {
		floorArea, err := listing.FloorArea.Float64Value()
		if err != nil {
			return nil, err
		}

		listingsWithImages = append(listingsWithImages, &pb.Listing{
			Id:         listing.ID,
			Source:     string(listing.Source),
			ExternalId: listing.ExternalID,
			Address:    listing.Address,
			FloorArea:  floorArea.Float64,
			Price:      listing.Price,
			Occupied:   listing.Occupied,
			ImageUrls:  listingImagesLookup[listing.ID],
		})
	}

	return &pb.GetListingsResponse{Listings: listingsWithImages}, nil
}

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
