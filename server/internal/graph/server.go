package graph

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"server/internal/loader"
	"time"

	"github.com/vektah/gqlparser/v2/ast"

	"github.com/99designs/gqlgen/graphql"
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/extension"
	"github.com/99designs/gqlgen/graphql/handler/lru"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/jackc/pgx/v5/pgxpool"
)

const defaultPort = "8080"

func Serve(pool *pgxpool.Pool) {
	port := os.Getenv("GQL_PORT")
	if port == "" {
		port = defaultPort
	}

	resolver := NewResolver(pool)
	es := NewExecutableSchema(Config{Resolvers: resolver})
	srv := newServer(es)

    http.Handle("/", playground.Handler("GraphQL playground", "/query"))
    http.Handle("/query", loader.Middleware(srv, pool))

	log.Printf("Started GQL server on port :%s", port)
    http.ListenAndServe(fmt.Sprintf(":%s", port), nil)
}

func newServer(es graphql.ExecutableSchema) *handler.Server {
    srv := handler.New(es)

    srv.AddTransport(transport.Websocket{
        KeepAlivePingInterval: 10 * time.Second,
    })
    srv.AddTransport(transport.POST{})

	srv.SetQueryCache(lru.New[*ast.QueryDocument](1000))

    srv.Use(extension.Introspection{}) 
    srv.Use(extension.AutomaticPersistedQuery{
		Cache: lru.New[string](100),
    })

    return srv
}