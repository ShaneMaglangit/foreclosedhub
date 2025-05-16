package cron

import (
	"github.com/robfig/cron/v3"
	"log"
)

type Job interface {
	Run() error
}

type ScheduledJob struct {
	name       string
	instance   int
	schedule   string
	isDisabled func() bool
	factory    func() Job
}

var scheduledJobs []ScheduledJob

func Start() *cron.Cron {
	c := cron.New()

	for _, job := range scheduledJobs {
		if job.isDisabled != nil && job.isDisabled() {
			continue
		}

		for range job.instance {
			instance := job.factory()

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
