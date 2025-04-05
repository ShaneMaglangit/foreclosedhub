package main

import (
	"github.com/joho/godotenv"
	"homagochi/internal/cron"
	"log"
	"os"
	"os/signal"
	"syscall"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	// Schedule cron jobs
	c := cron.Start()
	defer c.Stop()

	// Keep the server running
	sigChan := make(chan os.Signal, 1)

	signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)
	sig := <-sigChan

	log.Printf("Received signal: %v. Shutting down...", sig)
	os.Exit(0)
}
