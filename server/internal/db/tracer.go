package db

import (
	"context"
	"log"

	"github.com/jackc/pgx/v5"
)

type Tracer struct{}

func (t *Tracer) TraceQueryStart(ctx context.Context, conn *pgx.Conn, data pgx.TraceQueryStartData) context.Context {
	log.Println(data.SQL)
	return ctx
}

func (t *Tracer) TraceQueryEnd(ctx context.Context, conn *pgx.Conn, data pgx.TraceQueryEndData) {
	if data.Err != nil {
		log.Println(data.Err)
	}
}
