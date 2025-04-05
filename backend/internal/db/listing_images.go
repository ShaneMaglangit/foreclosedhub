package db

import (
	"context"
)

type ListingImagesRepository interface {
	InsertListingImages(ctx context.Context, dbtx DBTX, listingId int64, urls []string) error
}

type ListingImagesRepositoryImpl struct{}

func (l ListingImagesRepositoryImpl) InsertListingImages(ctx context.Context, dbtx DBTX, listingId int64, urls []string) error {
	listingIds := make([]int64, len(urls))
	for i := range len(listingIds) {
		listingIds[i] = listingId
	}

	return New(dbtx).InsertListingImages(ctx, InsertListingImagesParams{
		ListingIds: listingIds,
		Urls:       urls,
	})
}

func NewListingImagesRepository() ListingImagesRepository {
	return &ListingImagesRepositoryImpl{}
}
