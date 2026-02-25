# jsluice URL Extractor

Caido passive workflow that extracts URLs, API endpoints, and paths from JavaScript and HTML responses using [jsluice](https://github.com/BishopFox/jsluice).

## Prerequisites

```bash
go install github.com/BishopFox/jsluice/cmd/jsluice@latest
```

## How it works

```
On Intercept Response → In Scope → Shell (jsluice) → JavaScript (create findings) → Passive End
```

1. **Shell node** extracts the response body from Caido's STDIN JSON and pipes it to `jsluice urls`
2. **JavaScript node** parses jsluice JSONL output, categorizes URLs (API endpoints, external URLs, paths), and creates deduplicated Caido findings
