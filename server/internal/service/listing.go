package service

import (
	"context"
	"github.com/jackc/pgx/v5/pgxpool"
	"server/internal/db"
)

type ListingService struct {
	pool *pgxpool.Pool
}

func NewListingService(pool *pgxpool.Pool) *ListingService {
	return &ListingService{
		pool: pool,
	}
}

func (s *ListingService) GetListingsInBoundaryWithImages(ctx context.Context, params db.GetListingsInBoundaryParams) ([]*db.ListingWithImages, error) {
	listingsRepository := db.NewListingsRepository()
	listings, err := listingsRepository.GetListingsInBoundary(ctx, s.pool, params)
	if err != nil {
		return nil, err
	}

	listingImagesRepository := db.NewListingImagesRepository()
	images, err := listingImagesRepository.GetListingImagesByListings(ctx, s.pool, listings)
	if err != nil {
		return nil, err
	}

	listingImagesLookup := mapListingImages(images)
	listingWithImage, err := buildListingsWithImages(listings, listingImagesLookup)
	if err != nil {
		return nil, err
	}

	return listingWithImage, nil
}

func mapListingImages(images []*db.ListingImage) map[int64][]*db.ListingImage {
	listingImagesLookup := make(map[int64][]*db.ListingImage, len(images))
	for _, image := range images {
		listingImagesLookup[image.ListingID] = append(listingImagesLookup[image.ListingID], image)
	}
	return listingImagesLookup
}

func buildListingsWithImages(listings []*db.Listing, imagesLookup map[int64][]*db.ListingImage) ([]*db.ListingWithImages, error) {
	listingsWithImages := make([]*db.ListingWithImages, 0, len(listings))

	for _, listing := range listings {
		listingsWithImages = append(listingsWithImages, &db.ListingWithImages{
			ID:              listing.ID,
			Source:          listing.Source,
			ExternalID:      listing.ExternalID,
			Address:         listing.Address,
			FloorArea:       listing.FloorArea,
			Price:           listing.Price,
			OccupancyStatus: listing.OccupancyStatus,
			ImageLoaded:     listing.ImageLoaded,
			Images:          imagesLookup[listing.ID],
			CreatedAt:       listing.CreatedAt,
			UpdatedAt:       listing.UpdatedAt,
			Payload:         listing.Payload,
			Coordinate:      listing.Coordinate,
		})
	}

	return listingsWithImages, nil
}
