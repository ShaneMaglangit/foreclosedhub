CREATE TABLE listings (
    id BIGINT PRIMARY KEY,
    address TEXT NOT NULL,
    floor_area NUMERIC(8, 2) NOT NULL,
    price BIGINT NOT NULL,
    CONSTRAINT floor_area_greater_than_zero CHECK (floor_area >= 0),
    CONSTRAINT price_greater_than_zero CHECK (price >= 0)
);