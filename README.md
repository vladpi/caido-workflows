# Caido Workflows

Custom passive workflows for [Caido](https://caido.io/) proxy, designed for bug bounty automation. Each workflow runs external CLI tools against intercepted HTTP responses and creates findings directly in Caido.

## Workflows

| Workflow | Tool | Description |
|----------|------|-------------|
| [gitleaks-scanner](gitleaks-scanner/) | gitleaks | Detect leaked secrets in HTTP responses |
| [jsluice-urls](jsluice-urls/) | jsluice | Extract URLs and API endpoints from JS responses |

## Installation

1. Install prerequisites (see each workflow's README) — all workflows also require `jq` (`brew install jq`)
2. Download the `.json` file from the [latest release](../../releases/latest), or build with `python3 scripts/build.py`
3. Caido → Workflows → Import → select the file → Enable

### PATH configuration

The workflows add `/opt/homebrew/bin` and `~/go/bin` to PATH by default. If your tools are installed elsewhere, edit the **Init** field in the Shell node.

## License

[MIT](LICENSE)
