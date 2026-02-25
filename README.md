# Caido Workflows

Custom passive workflows for [Caido](https://caido.io/) proxy, designed for bug bounty automation. Each workflow runs external CLI tools against intercepted HTTP responses and creates findings directly in Caido.

## Workflows

| Workflow | Description |
|----------|-------------|
| [gitleaks-scanner](gitleaks-scanner/) | Detect leaked secrets in HTTP responses |
| [jsluice-urls](jsluice-urls/) | Extract URLs and API endpoints from JS/HTML responses |

## Installation

1. Download the `.json` file for the desired workflow from the [latest release](../../releases/latest), or build locally with `python3 scripts/build.py` (output in `dist/`)
2. Open Caido → Workflows → Import → select the downloaded file
3. Enable the workflow

### PATH configuration

If the CLI tools are not found, add to the Shell node **Init** section:

```bash
source ~/.zshrc
# or explicitly:
# export PATH="$PATH:/opt/homebrew/bin:$HOME/go/bin"
```

## License

[MIT](LICENSE)
