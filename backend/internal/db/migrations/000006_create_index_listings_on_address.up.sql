CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX index_listings_on_address ON listings USING GIN (address gin_trgm_ops);