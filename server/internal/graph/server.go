package graph

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"server/internal/loader"
	"time"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
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

	r := mux.NewRouter()
    r.Handle("/", playground.Handler("GraphQL playground", "/graphql"))
    r.Handle("/graphql", loader.Middleware(srv, pool))

	log.Printf("Started GQL server on port :%s", port)
    log.Fatal(http.ListenAndServe(fmt.Sprintf(":%s", port), setupCORS()(r)))
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

func setupCORS() func(http.Handler) http.Handler {
	return handlers.CORS(
		handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type", "Authorization"}),
		handlers.AllowedMethods([]string{"POST"}),
		handlers.AllowedOrigins([]string{"http://localhost:3000", "https://foreclosedhub.com"}),
	)
}