CREATE INDEX CONCURRENTLY idx_listings_on_source_occupancy_status_status_id_price ON listings(source, occupancy_status, status, id, price) WHERE geocoded_at IS NOT NULL;
