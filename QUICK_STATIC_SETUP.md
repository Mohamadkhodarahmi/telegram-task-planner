# Quick Static Files Setup ⚡

You're seeing this because static files need to be hosted separately. Here's the fastest way to fix it:

## Option 1: Cloudflare Pages (Recommended - 2 minutes)

### Step 1: Deploy Static Files
```bash
npm run deploy-static
```

Or manually:
```bash
wrangler pages deploy public --project-name=telegram-study-planner
```

### Step 2: Copy Your Pages URL
After deployment, you'll see a URL like:
```
https://telegram-study-planner.pages.dev
```

### Step 3: Update Configuration
Edit `wrangler.toml`:
```toml
[vars]
TELEGRAM_WEBAPP_URL = "https://telegram-study-planner.pages.dev"  # ← Your Pages URL
SECRET = "your-secret-token-here"
```

### Step 4: Update Frontend API
Edit `public/app.js` and set:
```javascript
const API_BASE = 'https://your-worker.workers.dev';  // ← Your Worker URL
```

### Step 5: Redeploy Worker
```bash
wrangler deploy
```

**Done!** Your mini app should now work! 🎉

---

## Option 2: Manual Upload (No CLI)

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Click **Workers & Pages** → **Create application** → **Pages**
3. Choose **Upload assets**
4. Zip your `public/` folder and upload it
5. Get your URL and update `wrangler.toml`

---

## Option 3: Other Free Hosting

### Vercel
```bash
npm install -g vercel
cd public
vercel
```

### Netlify
- Drag and drop your `public/` folder at [netlify.com/drop](https://app.netlify.com/drop)

### GitHub Pages
- Push `public/` to a GitHub repo
- Enable Pages in repo settings

---

## Verify It Works

1. Open your Pages URL in browser: `https://your-pages-url.pages.dev`
2. You should see the Study Planner interface
3. Open your bot in Telegram
4. Click "Open Study Planner"
5. It should load! ✅

---

## Troubleshooting

**Still seeing the error?**
- Make sure `TELEGRAM_WEBAPP_URL` in `wrangler.toml` is updated
- Redeploy your Worker: `wrangler deploy`
- Check that your Pages URL is accessible in browser

**Mini app not loading?**
- Verify `API_BASE` in `public/app.js` points to your Worker
- Check browser console for errors
- Make sure both Worker and Pages are deployed

---

## Need More Help?

See `STATIC_FILES_SETUP.md` for detailed instructions.




