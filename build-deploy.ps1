# Build and sync to root for GitHub Pages deployment
# Run from project root

# 1. Restore dev entry
Copy-Item index.dev.html index.html -Force
Write-Host "[1/5] Restored dev entry index.html"

# Verify dev entry
$entry = Get-Content index.html -Raw
if ($entry -notmatch '/src/main\.jsx') {
    Write-Error "Dev entry restore failed: /src/main.jsx not found in index.html"
    exit 1
}
Write-Host "[2/5] Verified dev entry"

# 3. Clean old build outputs
Remove-Item -Recurse -Force dist -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force assets -ErrorAction SilentlyContinue
Write-Host "[3/5] Cleaned old build outputs"

# 4. Build
npm run build
Write-Host "[4/5] Build complete"

# 5. Sync dist/ to root
Copy-Item dist/index.html index.html -Force
Copy-Item dist/assets . -Recurse -Force
Copy-Item dist/audio/* audio/ -Recurse -Force
Copy-Item dist/content/* content/ -Recurse -Force
Copy-Item dist/images/* images/ -Recurse -Force
Copy-Item dist/vite.svg vite.svg -Force
Write-Host "[5/5] Synced dist/ to root"

Write-Host "`n✅ Deployment artifacts ready. Commit index.html and assets/ to deploy."
Write-Host "   Run 'npm run dev' next time to auto-restore dev entry."
