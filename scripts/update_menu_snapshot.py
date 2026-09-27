#!/usr/bin/env python3
"""Optional helper that checks whether the public menu endpoint is reachable.

Forks can extend this script to prerender product cards into index.html.
It intentionally contains no business identifiers or secrets.
"""
import json
import os
import urllib.request

url = os.environ.get("MENU_JSON_URL")
if not url:
    raise SystemExit("Set MENU_JSON_URL to a public JSON menu endpoint.")

with urllib.request.urlopen(url, timeout=30) as response:
    data = json.loads(response.read().decode("utf-8"))

print(f"Menu endpoint OK. Top-level records: {len(data) if isinstance(data, list) else 1}")
