package db

import (
	"context"
)

type ListingImagesRepository interface {
	InsertListingImages(ctx context.Context, listing_ids []int64, urls []string) error
}

type ListingImagesRepositoryImpl struct{}

func (l ListingImagesRepositoryImpl) InsertListingImages(ctx context.Context, listing_ids []int64, urls []string) error {
	_, queries, err := connect(ctx)
	if err != nil {
		return err
	}

	return queries.InsertListingImages(ctx, InsertListingImagesParams{
		ListingIds: listing_ids,
		Urls:       urls,
	})
}

func NewListingImagesRepository() ListingImagesRepository {
	return &ListingImagesRepositoryImpl{}
}
