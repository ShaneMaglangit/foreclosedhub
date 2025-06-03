package main

import (
	"context"
	"github.com/joho/godotenv"
	"log"
	"server/internal/cron"
	"server/internal/db"
	"server/internal/grpc"
)

func main() {
	_ = godotenv.Load()

	ctx := context.Background()
	pool, err := db.Connect(ctx)
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
