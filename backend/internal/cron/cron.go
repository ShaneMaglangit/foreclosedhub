package cron

import (
	"fmt"
	"log"

	"github.com/robfig/cron/v3"
)

type Job struct {
	Name     string
	Schedule string
	Run      func()
}

var jobRegistry = []Job{
	Job{"Hello World", "0 0 * * *", HelloWorld},
}

func Start() *cron.Cron {
	c := cron.New()

	for _, job := range jobRegistry {
		job := job

		_, err := c.AddFunc(job.Schedule, func() {
			log.Printf("Running %s Scraper Job...", job.Name)
			job.Run()
		})

		if err != nil {
			log.Printf("Error scheduling %s job: %v", job.Name, err)
		}
	}

	log.Println("Scheduler started...")
	c.Start()

	return c
}

func HelloWorld() {
	fmt.Println("Hello world")
}
