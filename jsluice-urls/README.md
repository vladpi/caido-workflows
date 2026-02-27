# jsluice URL Extractor

Caido passive workflow that automatically extracts URLs, API endpoints, and paths from JavaScript responses using [jsluice](https://github.com/BishopFox/jsluice). Only processes responses with `Content-Type: javascript`.

## Prerequisites

```bash
go install github.com/BishopFox/jsluice/cmd/jsluice@latest
brew install jq
```

## What it finds

URLs extracted from JS files, categorized as:
- **API endpoints** — paths matching `/api/`, `/v1/`, `/graphql`, etc.
- **External URLs** — full `https://` links to third-party services
- **Paths** — relative paths and routes
