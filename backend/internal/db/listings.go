package db

import (
	"context"
	"fmt"
	"github.com/jackc/pgx/v5/pgtype"
)

type ListingsRepository interface {
	GetListingsNextPage(ctx context.Context, dbtx DBTX, params GetListingsNextPageParams) ([]*Listing, error)
	GetListingsPrevPage(ctx context.Context, dbtx DBTX, params GetListingsPrevPageParams) ([]*Listing, error)
	GetListingByImageNotLoaded(ctx context.Context, dbtx DBTX, source Source) (*GetListingByImageNotLoadedRow, error)
	InsertListings(ctx context.Context, dbtx DBTX, listings []*Listing) error
	UpdateListingsImageLoaded(ctx context.Context, dbtx DBTX, id int64, imageLoaded bool) error
}

type ListingsRepositoryImpl struct{}

func (l ListingsRepositoryImpl) GetListingsNextPage(ctx context.Context, dbtx DBTX, params GetListingsNextPageParams) ([]*Listing, error) {
	fmt.Println(params)
	params.Search = fmt.Sprintf("%%%s%%", params.Search)
	return New(dbtx).GetListingsNextPage(ctx, params)
}

func (l ListingsRepositoryImpl) GetListingsPrevPage(ctx context.Context, dbtx DBTX, params GetListingsPrevPageParams) ([]*Listing, error) {
	params.Search = fmt.Sprintf("%%%s%%", params.Search)
	return New(dbtx).GetListingsPrevPage(ctx, params)
}

func (l ListingsRepositoryImpl) GetListingByImageNotLoaded(ctx context.Context, dbtx DBTX, source Source) (*GetListingByImageNotLoadedRow, error) {
	return New(dbtx).GetListingByImageNotLoaded(ctx, source)
}

func (l ListingsRepositoryImpl) InsertListings(ctx context.Context, dbtx DBTX, listings []*Listing) error {
	sources := make([]Source, 0, len(listings))
	externalIDs := make([]string, 0, len(listings))
	addresses := make([]string, 0, len(listings))
	floorAreas := make([]pgtype.Numeric, 0, len(listings))
	prices := make([]int64, 0, len(listings))
	occupancyStatuses := make([]OccupancyStatus, 0, len(listings))

	for _, listing := range listings {
		sources = append(sources, listing.Source)
		externalIDs = append(externalIDs, listing.ExternalID)
		addresses = append(addresses, listing.Address)
		prices = append(prices, listing.Price)
		floorAreas = append(floorAreas, listing.FloorArea)
		prices = append(prices, listing.Price)
		occupancyStatuses = append(occupancyStatuses, listing.OccupancyStatus)
	}

	return New(dbtx).InsertListings(ctx, InsertListingsParams{
		Sources:           sources,
		ExternalIds:       externalIDs,
		Addresses:         addresses,
		FloorAreas:        floorAreas,
		Prices:            prices,
		OccupancyStatuses: occupancyStatuses,
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
