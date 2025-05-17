package db

import (
	"context"
	"fmt"
	"github.com/jackc/pgx/v5"
	"github.com/twpayne/go-geos"
	pgxgeos "github.com/twpayne/pgx-geos"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
)

func Connect(ctx context.Context) (*pgxpool.Pool, error) {
	config, err := createConfig()
	if err != nil {
		return nil, err
	}

	pool, err := pgxpool.NewWithConfig(ctx, config)
	if err != nil {
		return nil, fmt.Errorf("unable to connect to database: %v", err)
	}

	err = pool.Ping(context.Background())
	if err != nil {
		return nil, fmt.Errorf("unable to ping the database: %v", err)
	}

	return pool, nil
}

func createConfig() (*pgxpool.Config, error) {
	url := os.Getenv("DATABASE_URL")

	config, err := pgxpool.ParseConfig(url)
	if err != nil {
		return nil, err
	}

	config.AfterConnect = registerCustomTypes

	return config, nil
}

// See https://github.com/jackc/pgx/discussions/1559
func registerCustomTypes(ctx context.Context, conn *pgx.Conn) error {
	enumNames := []string{"source", "_source", "occupancy_status", "_occupancy_status", "listing_status", "_listing_status"}
	enumTypes, err := conn.LoadTypes(ctx, enumNames)
	if err != nil {
		return err
	}

	for _, enumType := range enumTypes {
		conn.TypeMap().RegisterType(enumType)
	}

	if err := pgxgeos.Register(ctx, conn, geos.NewContext()); err != nil {
		return err
	}

	return nil
}
