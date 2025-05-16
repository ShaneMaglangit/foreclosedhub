UPDATE listings
SET occupancy_status = CASE
    WHEN occupied = TRUE THEN 'occupied'::occupancy_status
    WHEN occupied = FALSE THEN 'unoccupied'::occupancy_status
    ELSE 'unspecified'::occupancy_status
END;
