-- name: GetListingsNextPage :many
SELECT *
FROM listings
WHERE id > @after::bigint
  AND address ILIKE @search::text
  AND source = ANY (@sources::source[])
  AND occupancy_status = ANY (@occupancy_statuses::occupancy_status[])
  AND price BETWEEN @min_price::bigint AND COALESCE(sqlc.narg('max_price'), 9223372036854775807)
  AND status = ANY (@statuses::listing_status[])
ORDER BY id
LIMIT @row_limit::int;

-- name: GetListingsPrevPage :many
SELECT *
FROM listings
WHERE id < @before::bigint
  AND address ILIKE @search::text
  AND source = ANY (@sources::source[])
  AND occupancy_status = ANY (@occupancy_statuses::occupancy_status[])
  AND price BETWEEN @min_price::bigint AND COALESCE(sqlc.narg('max_price'), 9223372036854775807)
  AND status = ANY (@statuses::listing_status[])
ORDER BY id DESC
LIMIT @row_limit::int;

-- name: GetNearbyListings :many
SELECT *
FROM listings
WHERE ST_DWithin(
        coordinate,
        ST_SetSRID(ST_MakePoint(@lng::double precision, @lat::double precision), 4326)::geography,
        200000
      )
  AND address ILIKE @search::text
  AND source = ANY (@sources::source[])
  AND occupancy_status = ANY (@occupancy_statuses::occupancy_status[])
  AND price BETWEEN @min_price::bigint AND COALESCE(sqlc.narg('max_price'), 9223372036854775807)
  AND status = ANY (@statuses::listing_status[])
ORDER BY ST_Distance(coordinate,
                     ST_SetSRID(ST_MakePoint(@lng::double precision, @lat::double precision), 4326)::geography)
LIMIT @row_limit::int;

-- name: GetListingByImageNotLoaded :one
SELECT id, external_id
FROM listings
WHERE source = @source::source
  AND image_loaded = FALSE
LIMIT 1;

-- name: InsertListings :exec
INSERT INTO listings (external_id, source, address, floor_area, price, occupancy_status, payload)
VALUES (unnest(@external_ids::text[]),
        unnest(@sources::source[]),
        unnest(@addresses::text[]),
        unnest(@floor_areas::numeric(8, 2)[]),
        unnest(@prices::bigint[]),
        unnest(@occupancy_statuses::occupancy_status[]),
        unnest(@payloads::jsonb[]))
ON CONFLICT (source, external_id) DO UPDATE
    SET address          = EXCLUDED.address,
        floor_area       = EXCLUDED.floor_area,
        price            = EXCLUDED.price,
        occupancy_status = EXCLUDED.occupancy_status,
        payload          = EXCLUDED.payload,
        status           = 'active'::listing_status,
        updated_at       = NOW();

-- name: UpdateListingsImageLoaded :exec
UPDATE listings
SET image_loaded = @image_loaded::boolean
WHERE listings.id = @id::bigint;

-- name: UnlistOldPagibigListings :exec
UPDATE listings
SET status = 'unlisted'::listing_status
WHERE listings.source = 'pagibig'::source
  AND listings.updated_at::date < CURRENT_DATE;

-- name: GetListingNotGeocoded :one
SELECT id, address
FROM listings
WHERE geocoded_at IS NULL
  AND status = 'active'::listing_status
LIMIT 1;

-- name: UpdateListingCoordinate :exec
UPDATE listings
SET coordinate  = ST_SetSRID(ST_MakePoint(@lng::double precision, @lat::double precision), 4326)::geography,
    geocoded_at = NOW()
WHERE id = @id::bigint;

-- name: GetListingImagesByListingIds :many
SELECT *
FROM listing_images
WHERE listing_id = ANY (@ids::bigint[]);

-- name: InsertListingImages :exec
INSERT INTO listing_images (listing_id, url)
VALUES (unnest(@listing_ids::bigint[]), unnest(@urls::text[]));
