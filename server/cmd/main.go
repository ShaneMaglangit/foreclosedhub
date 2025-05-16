package main

import (
	"log"
	"server/internal/cron"
	"server/internal/grpc"
)

func main() {
	c := cron.Start()
	defer c.Stop()

	if err := grpc.Serve(); err != nil {
		log.Fatal(err)
	}
}
