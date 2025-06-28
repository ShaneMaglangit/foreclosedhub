package loader

import (
	"context"
	"net/http"
	"server/internal/db"
	"server/internal/graph/model"
	"time"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/vikstrous/dataloadgen"
)

type ctxKey string

const loadersKey = ctxKey("dataloaders")

type Loaders struct {
	ListingImageLoader *dataloadgen.Loader[int64, []*model.ListingImage]
}

func NewLoaders(pool *pgxpool.Pool) *Loaders {
	return &Loaders{
		ListingImageLoader: dataloadgen.NewLoader(
			func(ctx context.Context, keys []int64) ([][]*model.ListingImage, []error) {
				listingImagesRepository := db.NewListingImagesRepository()
				listingImages, err := listingImagesRepository.GetListingImagesByListingIds(ctx, pool, keys)
				if err != nil {
					return nil, []error{err}
				}

				mapping := make(map[int64][]*model.ListingImage, len(keys))
				for _, listingImage := range listingImages {
					mapping[listingImage.ListingID] = append(mapping[listingImage.ListingID], &model.ListingImage{
						ID:        listingImage.ID,
						ListingID: listingImage.ListingID,
						URL:       listingImage.Url,
					})
				}

				result := make([][]*model.ListingImage, len(keys))
				for i, key := range keys {
					result[i] = mapping[key]
				}

				return result, nil
			},
			dataloadgen.WithWait(time.Millisecond),
		),
	}
}

func Middleware(next *handler.Server, pool *pgxpool.Pool) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		loader := NewLoaders(pool)
		r = r.WithContext(context.WithValue(r.Context(), loadersKey, loader))
		next.ServeHTTP(w, r)
	})
}

func For(ctx context.Context) *Loaders {
	return ctx.Value(loadersKey).(*Loaders)
}
