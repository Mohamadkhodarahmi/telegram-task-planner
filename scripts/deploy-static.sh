#!/bin/bash

# Script to deploy static files to Cloudflare Pages
# Usage: ./scripts/deploy-static.sh

echo "🚀 Deploying static files to Cloudflare Pages..."

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "❌ Error: wrangler is not installed"
    echo "Install it with: npm install -g wrangler"
    exit 1
fi

# Check if public directory exists
if [ ! -d "public" ]; then
    echo "❌ Error: public directory not found"
    exit 1
fi

# Deploy to Cloudflare Pages
echo "📦 Uploading files from public/ directory..."
wrangler pages deploy public --project-name=telegram-study-planner

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📝 Next steps:"
echo "1. Copy your Pages URL (shown above)"
echo "2. Update TELEGRAM_WEBAPP_URL in wrangler.toml"
echo "3. Redeploy your Worker: wrangler deploy"
echo "4. Test your mini app in Telegram!"




