package main

import (
	"fmt"
	"github.com/joho/godotenv"
	"homagochi/internal/cron"
	"homagochi/internal/grpc"
	"homagochi/internal/source/pagibig"
	"log"
	"os"
)

func main() {
	_ = godotenv.Load()

	fmt.Println(os.Getenv("ENV"))
	fmt.Println(os.Getenv("NEON_DATABASE_URL"))
	fmt.Println(os.Getenv("GCP_PROJECT_ID"))
	fmt.Println(os.Getenv("GCP_BUCKET_NAME"))

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
