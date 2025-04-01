package db

import (
	"context"
	"fmt"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
)

func connect(ctx context.Context) (*pgxpool.Pool, *Queries, error) {
	url := os.Getenv("DATABASE_URL")

	pool, err := pgxpool.New(ctx, url)
	if err != nil {
		return nil, nil, fmt.Errorf("unable to connect to database: %v", err)
	}

	err = pool.Ping(context.Background())
	if err != nil {
		return nil, nil, fmt.Errorf("unable to ping the database: %v", err)
	}

	queries := New(pool)

	return pool, queries, nil
}
