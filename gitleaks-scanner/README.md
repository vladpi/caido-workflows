# Gitleaks Scanner

Caido passive workflow that automatically scans HTTP response bodies for leaked secrets (API keys, tokens, credentials) using [gitleaks](https://github.com/gitleaks/gitleaks). Findings are grouped by rule and deduplicated.

## Prerequisites

```bash
brew install gitleaks jq
```

## What it catches

API keys, tokens, passwords, private keys, cloud credentials, and other secrets — anything gitleaks detects with its [default ruleset](https://github.com/gitleaks/gitleaks#rules).
