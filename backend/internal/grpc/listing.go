package grpc

import (
	"context"
	"fmt"
	"github.com/jackc/pgx/v5/pgxpool"
	"homagochi/internal/db"
	"homagochi/internal/protobuf"
	"slices"
)

type ListingServiceServer struct {
	protobuf.UnimplementedListingServiceServer
}

func (server *ListingServiceServer) GetListings(ctx context.Context, request *protobuf.GetListingsRequest) (*protobuf.GetListingsResponse, error) {
	hasNextParameter := request.After != 0
	hasPrevParameter := request.Before != 0
	if hasNextParameter && hasPrevParameter {
		return nil, fmt.Errorf("after and before are mutually exclusive parameters")
	}

	pool, err := db.Connect(ctx)
	if err != nil {
		return nil, err
	}
	defer pool.Close()

	var listings []*db.Listing
	var pageInfo *protobuf.PageInfo

	if hasPrevParameter {
		listings, pageInfo, err = getPrevListingsWithPageInfo(ctx, pool, db.GetListingsPreviousPageParams{
			Search:   request.Search,
			Before:   request.Before,
			RowLimit: request.Limit,
		})
	} else {
		listings, pageInfo, err = getNextListingsWithPageInfo(ctx, pool, db.GetListingsNextPageParams{
			Search:   request.Search,
			After:    request.After,
			RowLimit: request.Limit,
		})
	}

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

	return &protobuf.GetListingsResponse{
		Listings: listingsWithImages,
		PageInfo: pageInfo,
	}, nil
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

func getPrevListingsWithPageInfo(ctx context.Context, pool *pgxpool.Pool, params db.GetListingsPreviousPageParams) ([]*db.Listing, *protobuf.PageInfo, error) {
	pageSize := int(params.RowLimit)
	params.RowLimit += 1 // Extra row is used to derived if there are more items for the next page.

	listingsRepository := db.NewListingsRepository()
	listings, err := listingsRepository.GetListingsPreviousPage(ctx, pool, params)
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

func buildListingsWithImages(listings []*db.Listing, imagesLookup map[int64][]string) ([]*protobuf.Listing, error) {
	listingsWithImages := make([]*protobuf.Listing, 0, len(listings))

	for _, listing := range listings {
		floorArea, err := listing.FloorArea.Float64Value()
		if err != nil {
			return nil, err
		}

		imageUrls := make([]string, 0)
		if listingImages := imagesLookup[listing.ID]; listingImages != nil {
			imageUrls = listingImages
		}

		listingsWithImages = append(listingsWithImages, &protobuf.Listing{
			Id:          listing.ID,
			Source:      string(listing.Source),
			ExternalId:  listing.ExternalID,
			Address:     listing.Address,
			FloorArea:   floorArea.Float64,
			Price:       listing.Price,
			Occupied:    listing.Occupied,
			ImageLoaded: listing.ImageLoaded,
			ImageUrls:   imageUrls,
		})
	}

	return listingsWithImages, nil
}
