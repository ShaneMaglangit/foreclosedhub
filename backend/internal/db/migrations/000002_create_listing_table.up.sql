CREATE TABLE listings
(
    id          BIGSERIAL PRIMARY KEY,
    source      source        NOT NULL,
    external_id TEXT          NOT NULL,
    address     TEXT          NOT NULL,
    floor_area  NUMERIC(8, 2) NOT NULL,
    price       BIGINT        NOT NULL,
    occupied    BOOLEAN       NOT NULL,
    CONSTRAINT floor_area_greater_than_zero CHECK (floor_area >= 0),
    CONSTRAINT price_greater_than_zero CHECK (price >= 0),
    CONSTRAINT unique_source_external_id UNIQUE (source, external_id)
);