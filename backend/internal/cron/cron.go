package cron

import (
	"github.com/robfig/cron/v3"
	"homagochi/internal/geocode"
	"homagochi/internal/source/pagibig"
	"homagochi/internal/utils"
	"log"
)

type Job interface {
	Run() error
}

type JobEntry struct {
	name       string
	schedule   string
	isDisabled func() bool
	factory    func() Job
}

var jobEntries = []JobEntry{
	{name: "PagibigScrapeListing", schedule: "0 0 * * *", factory: func() Job { return &pagibig.ScrapeListingJob{} }},
	{
		name:       "PagibigScrapeListingImages",
		schedule:   "* * * * *",
		isDisabled: func() bool { return utils.IsDevelopment() },
		factory:    func() Job { return &pagibig.ScrapeListingImageJob{} },
	},
	{
		name:       "GeocodeListings",
		schedule:   "* * * * *",
		isDisabled: func() bool { return utils.IsDevelopment() },
		factory:    func() Job { return &geocode.GeocodePropertyJob{} },
	},
}

func Start() *cron.Cron {
	c := cron.New()

	for _, entry := range jobEntries {
		if entry.isDisabled != nil && entry.isDisabled() {
			continue
		}

		job := entry.factory()

		_, err := c.AddFunc(entry.schedule, func() {
			if err := job.Run(); err != nil {
				log.Printf("%s: %v", entry.name, err)
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
