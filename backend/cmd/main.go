package main

import (
	"github.com/joho/godotenv"
	"homagochi/internal/cron"
	"homagochi/internal/grpc"
	"homagochi/internal/source/pagibig"
	"log"
)

func main() {
	_ = godotenv.Load()

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
