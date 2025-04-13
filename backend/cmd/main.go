package main

import (
	"github.com/joho/godotenv"
	"homagochi/internal/cron"
	"homagochi/internal/grpc"
	"homagochi/internal/source/pagibig"
	"log"
	"os"
)

func main() {
	_ = godotenv.Load()

	log.Fatal(os.Getenv("NEON_DATABASE_URL"))

	if err := (&pagibig.ScrapeListingJob{}).Run(); err != nil {
		log.Fatal(err)
	}

	// Schedule cron jobs
	c := cron.Start()
	defer c.Stop()

	// Start GRPC server
	if err := grpc.Serve(); err != nil {
		log.Fatal(err)
	}
}
