package main

import (
	"github.com/joho/godotenv"
	"homagochi/internal/cron"
	"homagochi/internal/grpc"
	"homagochi/internal/source/pagibig"
	"log"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	if err := (&pagibig.ScrapeListingJob{}).Run(); err != nil {
		log.Fatal(err)
	}

	// Schedule cron jobs
	c := cron.Start()
	defer c.Stop()

	// Start GRPC server
	if err = grpc.Serve(); err != nil {
		log.Fatal(err)
	}
}
