UPDATE listings
SET coordinate_geog = ST_SetSRID(coordinate::geometry, 4326)::geography
WHERE coordinate IS NOT NULL;