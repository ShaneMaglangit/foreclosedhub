# CLI Commands

## Database Migrations

**Apply:** `migrate -path ./internal/db/migrations -database "..." up`

**Down:** `migrate -path ./internal/db/migrations -database "..." down 1`

**Create:** `migrate create -ext sql -dir ./internal/db/migrations -seq <migration-name>`

## SQL Query Generation

**Regenerate:** `sqlc generate`