#!/usr/bin/env python3
import json
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
DIST_DIR = REPO_ROOT / "dist"


def resolve_file_refs(obj, workflow_dir):
    """Recursively walk JSON and replace {"$file": "name"} with file contents."""
    if isinstance(obj, dict):
        if "$file" in obj and len(obj) == 1:
            filepath = workflow_dir / obj["$file"]
            if not filepath.exists():
                print(f"ERROR: Referenced file not found: {filepath}", file=sys.stderr)
                sys.exit(1)
            return filepath.read_text().rstrip("\n")
        return {k: resolve_file_refs(v, workflow_dir) for k, v in obj.items()}
    if isinstance(obj, list):
        return [resolve_file_refs(item, workflow_dir) for item in obj]
    return obj


def build():
    templates = sorted(REPO_ROOT.glob("*/definition.template.json"))
    if not templates:
        print("No definition.template.json files found.", file=sys.stderr)
        sys.exit(1)

    DIST_DIR.mkdir(exist_ok=True)

    for template_path in templates:
        workflow_dir = template_path.parent
        workflow_name = workflow_dir.name
        print(f"Building {workflow_name}...")

        with open(template_path) as f:
            template = json.load(f)

        resolved = resolve_file_refs(template, workflow_dir)
        out_path = DIST_DIR / f"{workflow_name}.json"

        with open(out_path, "w") as f:
            json.dump(resolved, f, indent=2)
            f.write("\n")

        print(f"  -> {out_path.relative_to(REPO_ROOT)}")

    print("Done.")


if __name__ == "__main__":
    build()
