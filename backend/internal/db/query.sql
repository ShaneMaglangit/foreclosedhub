-- name: GetListings :many
SELECT *
FROM listings
LIMIT @row_limit::int;

-- name: InsertListings :exec
INSERT INTO listings (external_id, address, floor_area, price)
VALUES (unnest(@external_ids::text[]),
        unnest(@addresses::text[]),
        unnest(@floor_areas::numeric(8, 2)[]),
        unnest(@prices::bigint[]))
ON CONFLICT (external_id) DO UPDATE
    SET address    = EXCLUDED.address,
        floor_area = EXCLUDED.floor_area,
        price      = EXCLUDED.price;