# PowerShell script to deploy static files to Cloudflare Pages
# Usage: .\scripts\deploy-static.ps1

Write-Host "🚀 Deploying static files to Cloudflare Pages..." -ForegroundColor Cyan

# Check if wrangler is installed
try {
    $null = Get-Command wrangler -ErrorAction Stop
} catch {
    Write-Host "❌ Error: wrangler is not installed" -ForegroundColor Red
    Write-Host "Install it with: npm install -g wrangler" -ForegroundColor Yellow
    exit 1
}

# Check if public directory exists
if (-not (Test-Path "public")) {
    Write-Host "❌ Error: public directory not found" -ForegroundColor Red
    exit 1
}

# Deploy to Cloudflare Pages
Write-Host "📦 Uploading files from public/ directory..." -ForegroundColor Cyan
wrangler pages deploy public --project-name=telegram-study-planner

Write-Host ""
Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Yellow
Write-Host "1. Copy your Pages URL (shown above)"
Write-Host "2. Update TELEGRAM_WEBAPP_URL in wrangler.toml"
Write-Host "3. Redeploy your Worker: wrangler deploy"
Write-Host "4. Test your mini app in Telegram!"




