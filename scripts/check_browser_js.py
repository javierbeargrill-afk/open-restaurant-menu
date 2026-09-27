#!/usr/bin/env python3
import re
import subprocess
import tempfile
from pathlib import Path

html = Path("index.html").read_text(encoding="utf-8")
scripts = re.findall(r"<script(?:\s[^>]*)?>([\s\S]*?)</script>", html)
browser = [s for s in scripts if s.strip() and not s.lstrip().startswith("{")]
with tempfile.NamedTemporaryFile("w", suffix=".js", encoding="utf-8", delete=False) as tmp:
    tmp.write("\n".join(browser))
    path = tmp.name
subprocess.run(["node", "--check", path], check=True)
print("Browser JavaScript syntax OK")
