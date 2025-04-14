package main

import (
	"github.com/joho/godotenv"
	"homagochi/internal/cron"
	"homagochi/internal/grpc"
	"log"
)

func main() {
	_ = godotenv.Load()

	// Schedule cron jobs
	c := cron.Start()
	defer c.Stop()

	// Start GRPC server
	if err := grpc.Serve(); err != nil {
		log.Fatal(err)
	}
}
