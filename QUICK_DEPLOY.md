# 🚀 Deploy سریع

## 1. دریافت API Token:

1. https://dash.cloudflare.com/profile/api-tokens
2. "Create Token" → "Edit Cloudflare Workers" template
3. Token را کپی کنید

## 2. تنظیم Token:

```powershell
$env:CLOUDFLARE_API_TOKEN="your-token-here"
```

## 3. Deploy:

```powershell
# Pages
wrangler pages deploy public --project-name=telegram-study-planner

# Worker
wrangler deploy
```

✅ **تمام!**



