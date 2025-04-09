ALTER TABLE listings
    ADD COLUMN occupied BOOLEAN NOT NULL;

UPDATE listings
SET occupied = CASE
                   WHEN occupancy_status = 'occupied'::occupancy_status THEN TRUE
                   ELSE FALSE
    END;