package db

import (
	"context"
	"github.com/jackc/pgx/v5/pgtype"
)

type ListingsRepository interface {
	GetListings(ctx context.Context, limit int32) ([]*Listing, error)
	GetListingIdNoImageLoaded(ctx context.Context, source Source) (int64, error)
	InsertListings(ctx context.Context, listings []*Listing) error
	UpdateListingsImageLoaded(ctx context.Context, id int64, imageLoaded bool) error
}

type ListingsRepositoryImpl struct{}

func (l ListingsRepositoryImpl) GetListings(ctx context.Context, limit int32) ([]*Listing, error) {
	_, queries, err := connect(ctx)
	if err != nil {
		return nil, err
	}

	return queries.GetListings(ctx, limit)
}

func (l ListingsRepositoryImpl) GetListingIdNoImageLoaded(ctx context.Context, source Source) (int64, error) {
	_, queries, err := connect(ctx)
	if err != nil {
		return 0, err
	}

	return queries.GetListingIDNoLoadedImage(ctx, source)
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

func (l ListingsRepositoryImpl) UpdateListingsImageLoaded(ctx context.Context, id int64, imageLoaded bool) error {
	_, queries, err := connect(ctx)
	if err != nil {
		return err
	}

	return queries.UpdateListingsImageLoaded(ctx, UpdateListingsImageLoadedParams{
		ID:          id,
		ImageLoaded: imageLoaded,
	})
}

func NewListingsRepository() ListingsRepository {
	return &ListingsRepositoryImpl{}
}
