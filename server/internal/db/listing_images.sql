-- name: GetListingImagesByListingIds :many
SELECT *
FROM listing_images
WHERE listing_id = ANY (@ids::bigint[]);

-- name: InsertListingImages :exec
INSERT INTO listing_images (listing_id, url)
VALUES (unnest(@listing_ids::bigint[]), unnest(@urls::text[]));
