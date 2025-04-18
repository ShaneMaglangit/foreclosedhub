package service

import (
	"context"
	"github.com/jackc/pgx/v5/pgxpool"
	"homagochi/internal/db"
	"homagochi/internal/protobuf"
	"slices"
)

type ListingService struct{}

func NewListingService() *ListingService {
	return &ListingService{}
}

func (s *ListingService) GetNearbyListingsWithImages(ctx context.Context, params db.GetNearbyListingsParams) ([]*db.ListingWithImages, error) {
	pool, err := db.Connect(ctx)
	if err != nil {
		return nil, err
	}
	defer pool.Close()

	listingsRepository := db.NewListingsRepository()
	listings, err := listingsRepository.GetNearbyListings(ctx, pool, params)
	if err != nil {
		return nil, err
	}

	listingImagesRepository := db.NewListingImagesRepository()
	images, err := listingImagesRepository.GetListingImagesByListings(ctx, pool, listings)
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

func (s *ListingService) GetNextWithImages(ctx context.Context, params db.GetListingsNextPageParams) ([]*db.ListingWithImages, *protobuf.PageInfo, error) {
	pool, err := db.Connect(ctx)
	if err != nil {
		return nil, nil, err
	}
	defer pool.Close()

	listings, pageInfo, err := getNextListingsWithPageInfo(ctx, pool, params)
	if err != nil {
		return nil, nil, err
	}

	listingImagesRepository := db.NewListingImagesRepository()
	images, err := listingImagesRepository.GetListingImagesByListings(ctx, pool, listings)
	if err != nil {
		return nil, nil, err
	}

	listingImagesLookup := mapListingImages(images)
	listingWithImage, err := buildListingsWithImages(listings, listingImagesLookup)
	if err != nil {
		return nil, nil, err
	}

	return listingWithImage, pageInfo, nil
}

func (s *ListingService) GetPrevWithImages(ctx context.Context, params db.GetListingsPrevPageParams) ([]*db.ListingWithImages, *protobuf.PageInfo, error) {
	pool, err := db.Connect(ctx)
	if err != nil {
		return nil, nil, err
	}
	defer pool.Close()

	listings, pageInfo, err := getPrevListingsWithPageInfo(ctx, pool, params)
	if err != nil {
		return nil, nil, err
	}

	listingImagesRepository := db.NewListingImagesRepository()
	images, err := listingImagesRepository.GetListingImagesByListings(ctx, pool, listings)
	if err != nil {
		return nil, nil, err
	}

	listingImagesLookup := mapListingImages(images)
	listingWithImage, err := buildListingsWithImages(listings, listingImagesLookup)
	if err != nil {
		return nil, nil, err
	}

	return listingWithImage, pageInfo, nil
}

func getNextListingsWithPageInfo(ctx context.Context, pool *pgxpool.Pool, params db.GetListingsNextPageParams) ([]*db.Listing, *protobuf.PageInfo, error) {
	pageSize := int(params.RowLimit)
	params.RowLimit += 1 // Extra row is used to derived if there are more items for the next page.

	listingsRepository := db.NewListingsRepository()
	listings, err := listingsRepository.GetListingsNextPage(ctx, pool, params)
	if err != nil {
		return nil, nil, err
	}

	currentPageListings := listings[:min(len(listings), pageSize)]

	var startCursor int64
	if len(currentPageListings) > 0 {
		startCursor = currentPageListings[0].ID
	}

	var endCursor int64
	if len(currentPageListings) > 0 {
		endCursor = currentPageListings[len(currentPageListings)-1].ID
	}

	pageInfo := &protobuf.PageInfo{
		StartCursor: startCursor,
		EndCursor:   endCursor,
		HasNextPage: len(listings) > pageSize,
		// When fetching for the next page (cursor > 0), assume that a previous page exist.
		HasPrevPage: params.After > 0,
	}

	return currentPageListings, pageInfo, nil
}

func getPrevListingsWithPageInfo(ctx context.Context, pool *pgxpool.Pool, params db.GetListingsPrevPageParams) ([]*db.Listing, *protobuf.PageInfo, error) {
	pageSize := int(params.RowLimit)
	params.RowLimit += 1 // Extra row is used to derived if there are more items for the next page.

	listingsRepository := db.NewListingsRepository()
	listings, err := listingsRepository.GetListingsPrevPage(ctx, pool, params)
	if err != nil {
		return nil, nil, err
	}

	currentPageListings := listings[:min(len(listings), pageSize)]
	slices.Reverse(currentPageListings)

	var startCursor int64
	if len(currentPageListings) > 0 {
		startCursor = currentPageListings[0].ID
	}

	var endCursor int64
	if len(currentPageListings) > 0 {
		endCursor = currentPageListings[len(currentPageListings)-1].ID
	}

	pageInfo := &protobuf.PageInfo{
		StartCursor: startCursor,
		EndCursor:   endCursor,
		// When fetching for the previous page, assume that the "next page" exist that starts with the "before" cursor.
		HasNextPage: true,
		HasPrevPage: len(listings) > pageSize,
	}

	return currentPageListings, pageInfo, nil
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
