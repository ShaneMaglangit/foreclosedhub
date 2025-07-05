CREATE INDEX CONCURRENTLY idx_listings_on_src_occ_grid_id_price_where_active_geocoded
    ON listings (source, occupancy_status, coordinate_grid, id, price)
    WHERE geocoded_at IS NOT NULL AND status = 'active';