CREATE INDEX CONCURRENTLY idx_listings_on_source_occupancy_id_price_where_active_geocoded
    ON listings (source, occupancy_status, id, price)
    WHERE geocoded_at IS NOT NULL AND status = 'active';