package db

import (
	"context"
	"github.com/jackc/pgx/v5/pgtype"
)

type ListingsRepository interface {
	GetListings(ctx context.Context, limit int32) ([]*Listing, error)
	InsertListings(ctx context.Context, listings []*Listing) error
}

type ListingsRepositoryImpl struct{}

func (l ListingsRepositoryImpl) GetListings(ctx context.Context, limit int32) ([]*Listing, error) {
	_, queries, err := connect(ctx)
	if err != nil {
		return nil, err
	}

	return queries.GetListings(ctx, limit)
}

func (l ListingsRepositoryImpl) InsertListings(ctx context.Context, listings []*Listing) error {
	_, queries, err := connect(ctx)
	if err != nil {
		return err
	}

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

	return queries.InsertListings(ctx, InsertListingsParams{
		Sources:     sources,
		ExternalIds: externalIDs,
		Addresses:   addresses,
		FloorAreas:  floorAreas,
		Prices:      prices,
		Occupied:    occupied,
	})
}

func NewListingsRepository() ListingsRepository {
	return &ListingsRepositoryImpl{}
}
