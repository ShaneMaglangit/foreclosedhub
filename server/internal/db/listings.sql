-- name: GetListing :one
SELECT *
FROM listings
WHERE id = @id::bigint
LIMIT 1;

-- name: GetListingsInBoundary :many
WITH filtered_listings AS (SELECT *
                           FROM listings
                           WHERE ST_Intersects(
                                   coordinate,
                                   ST_SetSRID(ST_MakeEnvelope(
                                                      @min_lng::double precision,
                                                      @min_lat::double precision,
                                                      @max_lng::double precision,
                                                      @max_lat::double precision
                                              ), 4326)::geography
                                 )
                             AND address ILIKE '%' || @address::text || '%'
                             AND source = ANY (@sources::source[])
                             AND occupancy_status = ANY (@occupancy_statuses::occupancy_status[])
                             AND price BETWEEN @min_price::bigint AND COALESCE(sqlc.narg('max_price'), 9223372036854775807)
                             AND status = 'active'
                             AND geocoded_at IS NOT NULL),
     ranked AS (SELECT *,
                       ROW_NUMBER() OVER (
                           PARTITION BY ST_SnapToGrid(coordinate::geometry, 0.01, 0.01)
                           ORDER BY id ASC
                           ) AS rn
                FROM filtered_listings)
SELECT *
FROM ranked
WHERE rn = 1
ORDER BY id
LIMIT @page_size::int;

-- name: GetListingByImageNotLoaded :one
SELECT id, external_id, payload
FROM listings
WHERE source = @source::source
  AND image_loaded = FALSE
LIMIT 1;

-- name: InsertListings :exec
INSERT INTO listings (external_id, source, address, floor_area, lot_area, price, occupancy_status, payload)
VALUES (unnest(@external_ids::text[]),
        unnest(@sources::source[]),
        unnest(@addresses::text[]),
        unnest(@floor_areas::numeric(8, 2)[]),
        unnest(@lot_areas::numeric(8, 2)[]),
        unnest(@prices::bigint[]),
        unnest(@occupancy_statuses::occupancy_status[]),
        unnest(@payloads::jsonb[]))
ON CONFLICT (source, external_id) DO UPDATE
    SET address          = EXCLUDED.address,
        floor_area       = EXCLUDED.floor_area,
        lot_area         = EXCLUDED.lot_area,
        price            = EXCLUDED.price,
        occupancy_status = EXCLUDED.occupancy_status,
        payload          = EXCLUDED.payload,
        status           = 'active'::listing_status,
        updated_at       = NOW();

-- name: UpdateListingsImageLoaded :exec
UPDATE listings
SET image_loaded = @image_loaded::boolean
WHERE listings.id = @id::bigint;

-- name: UnlistOldListings :exec
UPDATE listings
SET status = 'unlisted'::listing_status
WHERE listings.source = @source::source
  AND listings.updated_at::date < CURRENT_DATE;

-- name: GetListingNotGeocoded :one
SELECT id, address
FROM listings
WHERE status = 'active'::listing_status
  -- Note: Coordinates must be refreshed every 30 days to abide by Google Map's policy.
  AND (geocoded_at IS NULL OR geocoded_at < NOW() - INTERVAL '30 days')
LIMIT 1;

-- name: UpdateListingCoordinate :exec
UPDATE listings
SET coordinate  = ST_SetSRID(ST_MakePoint(@lng::double precision, @lat::double precision), 4326)::geography,
    geocoded_at = NOW()
WHERE id = @id::bigint;

