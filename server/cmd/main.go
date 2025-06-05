package main

import (
	"context"
	"log"
	"server/internal/cron"
	"server/internal/db"
	"server/internal/grpc"

	"github.com/joho/godotenv"
)

func main() {
	_ = godotenv.Load()

	ctx := context.Background()
	pool, err := db.NewPool(ctx)
	if err != nil {
		log.Fatal(err)
	}
	defer pool.Close()

	c := cron.Start(pool)
	defer c.Stop()

	if err := grpc.Serve(pool); err != nil {
		log.Fatal(err)
	}
}
