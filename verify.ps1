$ErrorActionPreference = "Stop"

Write-Host "=== [1/2] Verifying Backend (ruff + mypy + pytest) ===" -ForegroundColor Cyan
Push-Location backend
try {
    ruff check .
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

    mypy api core db repo schemas services workers main.py
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

    pytest -q
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
}
finally {
    Pop-Location
}

Write-Host "`n=== [2/2] Verifying Frontend (typecheck + lint + build) ===" -ForegroundColor Cyan
Push-Location frontend
try {
    npm run verify
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
}
finally {
    Pop-Location
}

Write-Host "`nALL VERIFICATION GATES PASSED!" -ForegroundColor Green