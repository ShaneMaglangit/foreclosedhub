ALTER TABLE listings
    ADD COLUMN coordinate_grid geometry GENERATED ALWAYS AS (
        ST_SnapToGrid(coordinate::geometry, 0.03, 0.03)
        ) STORED;