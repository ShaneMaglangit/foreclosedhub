-- name: GetListings :many
SELECT id, source, external_id, address, floor_area, price, occupied
FROM listings
LIMIT @row_limit::int;

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