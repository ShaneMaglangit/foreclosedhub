package main

import (
	"context"
	"log"

	// "server/internal/cron"
	"server/internal/db"
	"server/internal/source/unionbank"
	// "server/internal/graph"

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

	log.Println(unionbank.NewScrapeListingJob(pool).Run())

	// c := cron.Start(pool)
	// defer c.Stop()

	// graph.Serve(pool)
}
