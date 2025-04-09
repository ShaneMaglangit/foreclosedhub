-- name: GetListingsNextPage :many
SELECT *
FROM listings
WHERE id > @after::bigint
  AND address ILIKE @search::text
  AND source = ANY (@sources::source[])
  AND (coalesce(sqlc.narg('occupied'), occupied) IS NULL OR occupied = coalesce(sqlc.narg('occupied'), occupied))
ORDER BY id
LIMIT @row_limit::int;

-- name: GetListingsPreviousPage :many
SELECT *
FROM listings
WHERE id < @before::bigint
  AND address ILIKE @search::text
  AND source = ANY (@sources::source[])
  AND (coalesce(sqlc.narg('occupied'), occupied) IS NULL OR occupied = coalesce(sqlc.narg('occupied'), occupied))
ORDER BY id DESC
LIMIT @row_limit::int;

-- name: GetListingByImageNotLoaded :one
SELECT id, external_id
FROM listings
WHERE source = @source::source
  AND image_loaded = FALSE
LIMIT 1;

-- name: InsertListings :exec
INSERT INTO listings (source, external_id, address, floor_area, price, occupied)
VALUES (unnest(@sources::source[]),
        unnest(@external_ids::text[]),
        unnest(@addresses::text[]),
        unnest(@floor_areas::numeric(8, 2)[]),
        unnest(@prices::bigint[]),
        unnest(@occupied::boolean[]))
ON CONFLICT (source, external_id) DO UPDATE
    SET address    = EXCLUDED.address,
        floor_area = EXCLUDED.floor_area,
        price      = EXCLUDED.price,
        occupied   = EXCLUDED.occupied;

-- name: UpdateListingsImageLoaded :exec
UPDATE listings
SET image_loaded = @image_loaded::boolean
WHERE listings.id = @id::bigint;

-- name: GetListingImagesByListingIds :many
SELECT listing_id, url
FROM listing_images
WHERE listing_id = ANY (@ids::bigint[]);

-- name: InsertListingImages :exec
INSERT INTO listing_images (listing_id, url)
VALUES (unnest(@listing_ids::bigint[]), unnest(@urls::text[]));
