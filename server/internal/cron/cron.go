package cron

import (
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/robfig/cron/v3"
	"log"
	"server/internal/geocode"
	"server/internal/source/pagibig"
	"server/internal/source/secbank"
	"server/internal/utils"
)

type Job interface {
	Run() error
}

type ScheduledJob struct {
	name       string
	instance   int
	schedule   string
	isDisabled func() bool
	factory    func(pool *pgxpool.Pool) Job
}

var scheduledJobs = []ScheduledJob{
	{
		name:     "PagibigScrapeListing",
		instance: 1,
		schedule: "0 0 * * *",
		factory:  func() Job { return &pagibig.ScrapeListingJob{} },
		name:       "PagibigScrapeListing",
		instance:   1,
		schedule:   "0 0 * * *",
		factory:    func(pool *pgxpool.Pool) Job { return &pagibig.ScrapeListingJob{Pool: pool} },
	},
	{
		name:       "PagibigScrapeListingImages",
		instance:   5,
		schedule:   "* * * * *",
		isDisabled: func() bool { return utils.IsDevelopment() },
		factory:    func(pool *pgxpool.Pool) Job { return &pagibig.ScrapeListingImageJob{Pool: pool} },
	},
	{
		name:     "SecbankScrapeListing",
		instance: 1,
		schedule: "0 0 * * *",
		factory:  func() Job { return &secbank.ScrapeListingJob{} },
		name:       "SecbankScrapeListing",
		instance:   1,
		schedule:   "0 0 * * *",
		factory:    func(pool *pgxpool.Pool) Job { return &secbank.ScrapeListingJob{Pool: pool} },
	},
	{
		name:       "SecbankScrapeListingImages",
		instance:   1,
		schedule:   "* * * * *",
		isDisabled: func() bool { return utils.IsDevelopment() },
		factory:    func(pool *pgxpool.Pool) Job { return &secbank.ScrapeListingImageJob{Pool: pool} },
	},
	{
		name:       "GeocodeListing",
		instance:   1,
		schedule:   "* * * * *",
		isDisabled: func() bool { return utils.IsDevelopment() },
		factory:    func(pool *pgxpool.Pool) Job { return &geocode.Job{Pool: pool} },
	},
}

func Start(pool *pgxpool.Pool) *cron.Cron {
	c := cron.New()

	for _, job := range scheduledJobs {
		if job.isDisabled != nil && job.isDisabled() {
			continue
		}

		for range job.instance {
			instance := job.factory(pool)

			_, err := c.AddFunc(job.schedule, func() {
				if err := instance.Run(); err != nil {
					log.Printf("%s: %v", job.name, err)
				}
			})

			if err != nil {
				log.Printf("Error scheduling %s job: %v", job.name, err)
			}

			log.Printf("Added %s job", job.name)
		}
	}

	log.Println("Scheduler started...")
	c.Start()

	return c
}
