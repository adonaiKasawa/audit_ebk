#!/usr/bin/env bash
set -euo pipefail
OUTDIR="./audit-reports"
mkdir -p "$OUTDIR"
DATE=$(date --iso-8601=seconds)

echo "[*] Audit started at $DATE"

# meta
git rev-parse --abbrev-ref HEAD > "$OUTDIR/git-branch.txt" || true
git rev-parse HEAD > "$OUTDIR/git-head.txt" || true
echo "{\"date\":\"$DATE\"}" > "$OUTDIR/meta.json"

# 1) detect languages/build files
echo "[*] Detecting project files..."
ls -la > "$OUTDIR/root-listing.txt"

# 2) Node / frontend checks (if package.json exists)
if [ -f package.json ]; then
  echo "[*] Found package.json -> running npm audit & eslint & build (if scripts exist)"
  npm install --package-lock-only >/dev/null 2>&1 || true
  npm audit --json > "$OUTDIR/npm-audit.json" || true
  if command -v npx >/dev/null 2>&1; then
    npx eslint . -f json -o "$OUTDIR/eslint.json" || true
    # If there is a build script, run it (safe mode)
    if jq -r '.scripts.build // empty' package.json >/dev/null 2>&1; then
      echo "[*] Running npm run build (if available) — may fail if env missing"
      npm run build --if-present || true
    fi
  fi
fi

# 3) Python checks (pip-audit, bandit)
if [ -f requirements.txt ] || [ -f pyproject.toml ]; then
  echo "[*] Python project detected: running pip-audit and bandit"
  python3 -m pip install --user pip-audit bandit >/dev/null 2>&1 || true
  python3 -m pip_audit --format json > "$OUTDIR/pip-audit.json" || true
  bandit -r . -f json -o "$OUTDIR/bandit.json" || true
fi

# 4) Go modules
if [ -f go.mod ]; then
  echo "[*] Go project: listing modules"
  go list -m -u all > "$OUTDIR/go-mods.txt" || true
fi

# 5) gitleaks (secrets)
if ! command -v gitleaks >/dev/null 2>&1; then
  echo "[*] Installing gitleaks"
  curl -sSfL https://raw.githubusercontent.com/zricethezav/gitleaks/main/install.sh | bash -s -- -b /usr/local/bin || true
fi
echo "[*] Running gitleaks..."
gitleaks detect --source . --format json --report-path "$OUTDIR/gitleaks.json" || true

# 6) semgrep (SAST)
if ! command -v semgrep >/dev/null 2>&1; then
  python3 -m pip install --user semgrep >/dev/null 2>&1 || true
fi
echo "[*] Running semgrep (auto rules)..."
semgrep --config=auto --json --output "$OUTDIR/semgrep.json" || true

# 7) trivy filesystem scan (containers / filesystem vulns)
if ! command -v trivy >/dev/null 2>&1; then
  echo "[*] Installing trivy..."
  curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sudo sh -s -- -b /usr/local/bin || true
fi
echo "[*] Running trivy filesystem scan..."
trivy fs --format json --output "$OUTDIR/trivy-fs.json" . || true

# 8) dockerfile lint (hadolint) if Dockerfile exists
if [ -f Dockerfile ]; then
  if ! command -v hadolint >/dev/null 2>&1; then
    echo "[*] Installing hadolint..."
    wget -qO /usr/local/bin/hadolint https://github.com/hadolint/hadolint/releases/latest/download/hadolint-$(uname -s)-$(uname -m)
    chmod +x /usr/local/bin/hadolint || true
  fi
  echo "[*] Running hadolint on Dockerfile..."
  hadolint -f json Dockerfile > "$OUTDIR/hadolint.json" || true
fi

# 9) performance: lighthouse (if site available locally)
if command -v lighthouse >/dev/null 2>&1; then
  echo "[*] Running Lighthouse on http://localhost:3000 (if app runs)"
  lighthouse http://localhost:3000 --output json --output-path "$OUTDIR/lighthouse.json" --quiet || true
else
  echo "[*] Lighthouse not installed — skip performance scan of running site"
fi

# 10) CI / workflow checks: list .github/workflows
if [ -d .github/workflows ]; then
  echo "[*] Listing workflows..."
  ls -la .github/workflows > "$OUTDIR/workflows-listing.txt"
  for f in .github/workflows/*.yml .github/workflows/*.yaml; do
    [ -f "$f" ] || continue
    echo "---- $f ----" >> "$OUTDIR/workflows.ymls"
    cat "$f" >> "$OUTDIR/workflows.ymls"
  done
fi

echo "[*] Audit finished. Reports -> $OUTDIR"
