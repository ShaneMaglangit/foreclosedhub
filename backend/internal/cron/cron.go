package cron

import (
	"homagochi/internal/source/pagibig"
	"log"

	"github.com/robfig/cron/v3"
)

type Job interface {
	Run() error
}

type JobEntry struct {
	name     string
	schedule string
	factory  func() Job
}

var jobEntries = []JobEntry{
	{name: "Pagibig", schedule: "0 0 * * *", factory: func() Job { return &pagibig.ScrapeListingJob{} }},
}

func Start() *cron.Cron {
	c := cron.New()

	for _, entry := range jobEntries {
		job := entry.factory()

		_, err := c.AddFunc(entry.schedule, func() {
			log.Printf("Running %s Scraper ScrapeListingJob...", entry.name)
			if err := job.Run(); err != nil {
				log.Fatal(err)
			}
		})

		if err != nil {
			log.Printf("Error scheduling %s job: %v", entry.name, err)
		}
	}

	log.Println("Scheduler started...")
	c.Start()

	return c
}
