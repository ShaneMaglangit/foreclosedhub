package db

import (
	"context"
	"fmt"
	"github.com/jackc/pgx/v5/pgtype"
)

type ListingsRepository interface {
	GetListingsNextPage(ctx context.Context, dbtx DBTX, params GetListingsNextPageParams) ([]*Listing, error)
	GetListingsPreviousPage(ctx context.Context, dbtx DBTX, params GetListingsPreviousPageParams) ([]*Listing, error)
	GetListingByImageNotLoaded(ctx context.Context, dbtx DBTX, source Source) (*GetListingByImageNotLoadedRow, error)
	InsertListings(ctx context.Context, dbtx DBTX, listings []*Listing) error
	UpdateListingsImageLoaded(ctx context.Context, dbtx DBTX, id int64, imageLoaded bool) error
}

type ListingsRepositoryImpl struct{}

func (l ListingsRepositoryImpl) GetListingsNextPage(ctx context.Context, dbtx DBTX, params GetListingsNextPageParams) ([]*Listing, error) {
	params.Search = fmt.Sprintf("%%%s%%", params.Search)
	return New(dbtx).GetListingsNextPage(ctx, params)
}

func (l ListingsRepositoryImpl) GetListingsPreviousPage(ctx context.Context, dbtx DBTX, params GetListingsPreviousPageParams) ([]*Listing, error) {
	params.Search = fmt.Sprintf("%%%s%%", params.Search)
	return New(dbtx).GetListingsPreviousPage(ctx, params)
}

func (l ListingsRepositoryImpl) GetListingByImageNotLoaded(ctx context.Context, dbtx DBTX, source Source) (*GetListingByImageNotLoadedRow, error) {
	return New(dbtx).GetListingByImageNotLoaded(ctx, source)
}

func (l ListingsRepositoryImpl) InsertListings(ctx context.Context, dbtx DBTX, listings []*Listing) error {
	sources := make([]Source, len(listings))
	externalIDs := make([]string, len(listings))
	addresses := make([]string, len(listings))
	floorAreas := make([]pgtype.Numeric, len(listings))
	prices := make([]int64, len(listings))
	occupied := make([]bool, len(listings))

	for i, listing := range listings {
		sources[i] = listing.Source
		externalIDs[i] = listing.ExternalID
		addresses[i] = listing.Address
		floorAreas[i] = listing.FloorArea
		prices[i] = listing.Price
		occupied[i] = listing.Occupied
	}

	return New(dbtx).InsertListings(ctx, InsertListingsParams{
		Sources:     sources,
		ExternalIds: externalIDs,
		Addresses:   addresses,
		FloorAreas:  floorAreas,
		Prices:      prices,
		Occupied:    occupied,
	})
}

func (l ListingsRepositoryImpl) UpdateListingsImageLoaded(ctx context.Context, dbtx DBTX, id int64, imageLoaded bool) error {
	params := UpdateListingsImageLoadedParams{
		ID:          id,
		ImageLoaded: imageLoaded,
	}

	return New(dbtx).UpdateListingsImageLoaded(ctx, params)
}

func NewListingsRepository() ListingsRepository {
	return &ListingsRepositoryImpl{}
}
