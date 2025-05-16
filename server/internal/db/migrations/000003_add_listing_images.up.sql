CREATE TABLE listing_images
(
    id         BIGSERIAL PRIMARY KEY,
    listing_id BIGINT NOT NULL REFERENCES listings (id) ON DELETE CASCADE,
    url        TEXT   NOT NULL,
    CONSTRAINT unique_id_listing_id UNIQUE (id, listing_id)
)