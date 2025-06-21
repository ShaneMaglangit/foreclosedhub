package cron

import (
	"log"

	"server/internal/geocode"
	"server/internal/source/pagibig"
	"server/internal/source/secbank"
	"server/internal/source/unionbank"
	"server/internal/utils"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/robfig/cron/v3"
)

type Job interface {
	Run() error
	InstanceCount() int
}

type ScheduledJob struct {
	name       string
	schedule   string
	isDisabled func() bool
	factory    func(pool *pgxpool.Pool) Job
}

var scheduledJobs = []ScheduledJob{
	{
		name:       "PagibigScrapeListing",
		schedule:   "0 0 * * *",
		factory:    func(pool *pgxpool.Pool) Job { return pagibig.NewScrapeListingJob(pool) },
	},
	{
		name:       "PagibigScrapeListingImages",
		schedule:   "* * * * *",
		isDisabled: func() bool { return utils.IsDevelopment() },
		factory:    func(pool *pgxpool.Pool) Job { return pagibig.NewScrapeListingImageJob(pool) },
	},
	{
		name:       "SecbankScrapeListing",
		schedule:   "0 0 * * *",
		factory:    func(pool *pgxpool.Pool) Job { return secbank.NewScrapeListingJob(pool) },
	},
	{
		name:       "SecbankScrapeListingImages",
		schedule:   "* * * * *",
		isDisabled: func() bool { return utils.IsDevelopment() },
		factory:    func(pool *pgxpool.Pool) Job { return secbank.NewScrapeListingImageJob(pool) },
	},
	{
		name:       "UnionbankScrapeListing",
		schedule:   "0 0 * * *",
		factory:    func(pool *pgxpool.Pool) Job { return unionbank.NewScrapeListingJob(pool) },
	},
	{
		name:       "UnionbankScrapeListingImages",
		schedule:   "* * * * *",
		isDisabled: func() bool { return utils.IsDevelopment() },
		factory:    func(pool *pgxpool.Pool) Job { return unionbank.NewScrapeListingImageJob(pool) },
	},
	{
		name:       "GeocodeListing",
		schedule:   "* * * * *",
		isDisabled: func() bool { return utils.IsDevelopment() },
		factory:    func(pool *pgxpool.Pool) Job { return geocode.NewJob(pool) },
	},
}

func Start(pool *pgxpool.Pool) *cron.Cron {
	c := cron.New()

	for _, scheduledJob := range scheduledJobs {
		if scheduledJob.isDisabled != nil && scheduledJob.isDisabled() {
			continue
		}

		job := scheduledJob.factory(pool)
		for range job.InstanceCount() {
			_, err := c.AddFunc(scheduledJob.schedule, func() {
				if err := job.Run(); err != nil {
					log.Printf("%s: %v", scheduledJob.name, err)
				}
			})

			if err != nil {
				log.Printf("Error scheduling %s job: %v", scheduledJob.name, err)
			}

			log.Printf("Added %s job", scheduledJob.name)
		}
	}

	log.Println("Scheduler started...")
	c.Start()

	return c
}
