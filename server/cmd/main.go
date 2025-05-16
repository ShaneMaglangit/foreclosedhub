package main

import (
	"github.com/joho/godotenv"
	"log"
	"server/internal/cron"
	"server/internal/grpc"
)

func main() {
	_ = godotenv.Load()

	c := cron.Start()
	defer c.Stop()

	if err := grpc.Serve(); err != nil {
		log.Fatal(err)
	}
}
