package main

import (
	"context"
	"log"
	"server/internal/db"
	"server/internal/source/unionbank"

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

	if err = unionbank.NewScrapeListingJob(pool).Run(); err != nil {
		log.Fatal(err)
	}

	// c := cron.Start(pool)
	// defer c.Stop()

	// graph.Serve(pool)
}
