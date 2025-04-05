package db

import (
	"context"
	"fmt"
	"github.com/jackc/pgx/v5"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
)

func connect(ctx context.Context) (*pgxpool.Pool, *Queries, error) {
	url := os.Getenv("DATABASE_URL")

	config, err := pgxpool.ParseConfig(url)
	if err != nil {
		return nil, nil, fmt.Errorf("unable to parse database URL: %v", err)
	}

	// Ensure the AfterConnect callback is set before the pool is created
	config.AfterConnect = registerEnums

	pool, err := pgxpool.NewWithConfig(ctx, config)
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

func registerEnums(ctx context.Context, conn *pgx.Conn) error {
	enumNames := []string{"source", "_source"}
	enumTypes, err := conn.LoadTypes(ctx, enumNames)
	if err != nil {
		return err
	}

	for _, enumType := range enumTypes {
		conn.TypeMap().RegisterType(enumType)
	}

	return nil
}
