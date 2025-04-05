package grpc

import (
	"context"
	"homagochi/internal/db"
	"homagochi/internal/pb"
)

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

	listingIds := extractListingIds(listings)

	listingImagesRepository := db.NewListingImagesRepository()
	images, err := listingImagesRepository.GetListingImagesByListingIds(ctx, pool, listingIds)
	if err != nil {
		return nil, err
	}

	listingImagesLookup := mapListingImages(images)
	listingsWithImages, err := buildListingsWithImages(listings, listingImagesLookup)
	if err != nil {
		return nil, err
	}

	return &pb.GetListingsResponse{Listings: listingsWithImages}, nil
}

func extractListingIds(listings []*db.Listing) []int64 {
	listingIds := make([]int64, 0, len(listings))
	for _, listing := range listings {
		listingIds = append(listingIds, listing.ID)
	}
	return listingIds
}

func mapListingImages(images []*db.GetListingImagesByListingIdsRow) map[int64][]string {
	listingImagesLookup := make(map[int64][]string, len(images))
	for _, image := range images {
		listingImagesLookup[image.ListingID] = append(listingImagesLookup[image.ListingID], image.Url)
	}
	return listingImagesLookup
}

func buildListingsWithImages(listings []*db.Listing, imagesLookup map[int64][]string) ([]*pb.Listing, error) {
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
			ImageUrls:  imagesLookup[listing.ID],
		})
	}

	return listingsWithImages, nil
}
