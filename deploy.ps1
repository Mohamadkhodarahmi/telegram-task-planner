# Deploy Script for Telegram Study Planner
# Usage: .\deploy.ps1

Write-Host "🚀 Starting deployment..." -ForegroundColor Cyan

# Check if API Token is set
if (-not $env:CLOUDFLARE_API_TOKEN) {
    Write-Host "❌ CLOUDFLARE_API_TOKEN is not set!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please set it first:" -ForegroundColor Yellow
    Write-Host '  $env:CLOUDFLARE_API_TOKEN="your-token-here"' -ForegroundColor White
    Write-Host ""
    Write-Host "Or get a token from: https://dash.cloudflare.com/profile/api-tokens" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ API Token found" -ForegroundColor Green
Write-Host ""

# Deploy Pages
Write-Host "📦 Deploying Pages..." -ForegroundColor Cyan
wrangler pages deploy public --project-name=telegram-study-planner

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Pages deployment failed!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Pages deployed successfully!" -ForegroundColor Green
Write-Host ""

# Deploy Worker
Write-Host "⚙️  Deploying Worker..." -ForegroundColor Cyan
wrangler deploy

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Worker deployment failed!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Worker deployed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "🎉 Deployment complete!" -ForegroundColor Green



