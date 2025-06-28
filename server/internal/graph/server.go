package graph

import (
	"fmt"
	"log"
	"net"
	"net/http"
	"os"
	"server/internal/loader"
	"sync"
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
	"golang.org/x/time/rate"
)

const defaultPort = "8080"

var (
	visitors   = make(map[string]*rate.Limiter)
	mu         sync.Mutex
	rateLimit  = rate.Every(1 * time.Second)
	burstLimit = 10
)

func getVisitor(ip string) *rate.Limiter {
	mu.Lock()
	defer mu.Unlock()

	limiter, exists := visitors[ip]
	if !exists {
		limiter = rate.NewLimiter(rateLimit, burstLimit)
		visitors[ip] = limiter
	}
	return limiter
}

func rateLimitMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ip, _, err := net.SplitHostPort(r.RemoteAddr)
		if err != nil {
			http.Error(w, "Invalid IP address", http.StatusInternalServerError)
			return
		}

		limiter := getVisitor(ip)
		if !limiter.Allow() {
			http.Error(w, "Too Many Requests", http.StatusTooManyRequests)
			return
		}

		next.ServeHTTP(w, r)
	})
}

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
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%s", port), setupCORS()(rateLimitMiddleware(r))))
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
