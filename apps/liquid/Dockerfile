# Self-contained: compiles a tiny static-file server with Next.js export
# resolution (.html + dir/index.html fallback) so /docs/dev → /docs/dev.html.
# When ghcr.io/hanzoai/spa v1.3+ ships, swap back to FROM ghcr.io/hanzoai/spa.

FROM golang:1.26-alpine AS server
WORKDIR /src
COPY <<'EOF' main.go
package main

import (
	"log"
	"net/http"
	"os"
	"path/filepath"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}
	root := os.Getenv("ROOT")
	if root == "" {
		root = "/public"
	}
	mux := http.NewServeMux()
	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("content-type", "application/json")
		w.Write([]byte(`{"status":"ok"}`))
	})
	mux.Handle("/", handler(root))
	log.Printf("serving %s on :%s", root, port)
	log.Fatal(http.ListenAndServe(":"+port, mux))
}

func handler(root string) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("strict-transport-security", "max-age=31536000; includeSubDomains")
		w.Header().Set("x-content-type-options", "nosniff")
		w.Header().Set("referrer-policy", "strict-origin-when-cross-origin")

		clean := filepath.Clean(r.URL.Path)
		path := filepath.Join(root, clean)

		if fi, err := os.Stat(path); err == nil && !fi.IsDir() {
			serve(w, r, path)
			return
		}
		if fi, err := os.Stat(path + ".html"); err == nil && !fi.IsDir() {
			serve(w, r, path+".html")
			return
		}
		idx := filepath.Join(path, "index.html")
		if fi, err := os.Stat(idx); err == nil && !fi.IsDir() {
			serve(w, r, idx)
			return
		}
		// SPA fallback — try root index.html, else 404.
		fallback := filepath.Join(root, "index.html")
		if fi, err := os.Stat(fallback); err == nil && !fi.IsDir() {
			w.WriteHeader(http.StatusNotFound)
			serve(w, r, fallback)
			return
		}
		http.NotFound(w, r)
	})
}

func serve(w http.ResponseWriter, r *http.Request, path string) {
	http.ServeFile(w, r, path)
}
EOF
RUN go mod init server && CGO_ENABLED=0 go build -ldflags="-s -w" -o /server .

FROM scratch
COPY --from=server /server /server
COPY out/ /public
ENV PORT=3000 ROOT=/public
EXPOSE 3000
ENTRYPOINT ["/server"]
