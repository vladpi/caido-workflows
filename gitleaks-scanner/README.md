# Gitleaks Scanner

Caido passive workflow that scans HTTP response bodies for leaked secrets (API keys, tokens, credentials) using [gitleaks](https://github.com/gitleaks/gitleaks).

## Prerequisites

```bash
brew install gitleaks
```

## How it works

```
On Intercept Response → In Scope → Shell (gitleaks) → JavaScript (create findings) → Passive End
```

1. **Shell node** extracts the response body from Caido's STDIN JSON and pipes it to `gitleaks stdin`
2. **JavaScript node** parses gitleaks JSON output and creates deduplicated Caido findings
