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
	{name: "PagibigScrapeListing", schedule: "0 0 * * *", factory: func() Job { return &pagibig.ScrapeListingJob{} }},
	{name: "PagibigScrapeListingImages", schedule: "* * * * *", factory: func() Job { return &pagibig.ScrapeListingImageJob{} }},
}

func Start() *cron.Cron {
	c := cron.New()

	for _, entry := range jobEntries {
		job := entry.factory()

		_, err := c.AddFunc(entry.schedule, func() {
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
