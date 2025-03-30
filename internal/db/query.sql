-- name: GetListings :many
SELECT *
FROM listings
LIMIT @row_limit::int;