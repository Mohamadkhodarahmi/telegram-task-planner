# Static Files Hosting Guide

Your frontend files (`public/` folder) need to be hosted separately from your Cloudflare Worker. Here are the best options:

## Option 1: Cloudflare Pages (Recommended) ⭐

**Best for:** Cloudflare users, free hosting, automatic deployments

### Steps:

1. **Install Wrangler Pages plugin:**
   ```bash
   npm install -D wrangler
   ```

2. **Deploy to Cloudflare Pages:**
   ```bash
   # From your project root
   wrangler pages deploy public
   ```

   Or use the Cloudflare Dashboard:
   - Go to Cloudflare Dashboard → Pages
   - Click "Create a project"
   - Choose "Upload assets"
   - Upload your `public/` folder
   - Deploy!

3. **Get your Pages URL:**
   After deployment, you'll get a URL like:
   ```
   https://telegram-study-planner.pages.dev
   ```

4. **Update `wrangler.toml`:**
   ```toml
   [vars]
   TELEGRAM_WEBAPP_URL = "https://telegram-study-planner.pages.dev"
   SECRET = "your-secret-token-here"
   ```

5. **Redeploy your Worker:**
   ```bash
   wrangler deploy
   ```

6. **Update `public/app.js`:**
   Make sure `API_BASE` points to your Worker URL:
   ```javascript
   const API_BASE = 'https://your-worker.workers.dev';
   ```

**Done!** Your static files are now hosted on Cloudflare Pages.

---

## Option 2: Serve from Worker (Simple but Limited)

If you want everything in one place, you can serve static files directly from your Worker. This works but is less optimal for large files.

### Steps:

1. **Update `src/index.ts`** - I'll create an updated version that serves files
2. **Bundle your static files** with your Worker
3. **Deploy**

See `STATIC_FILES_IN_WORKER.md` for this approach.

---

## Option 3: External Hosting

### Vercel (Free)

1. Go to [vercel.com](https://vercel.com)
2. Import your repository
3. Set root directory to `public/`
4. Deploy
5. Get your URL and update `TELEGRAM_WEBAPP_URL`

### Netlify (Free)

1. Go to [netlify.com](https://netlify.com)
2. Drag and drop your `public/` folder
3. Get your URL
4. Update `TELEGRAM_WEBAPP_URL`

### GitHub Pages (Free)

1. Push `public/` folder to a GitHub repository
2. Enable GitHub Pages in repository settings
3. Get your URL: `https://username.github.io/repo-name`
4. Update `TELEGRAM_WEBAPP_URL`

---

## Option 4: Serve from Worker with R2

For advanced users, you can store files in Cloudflare R2 and serve them.

1. Create an R2 bucket
2. Upload your `public/` files
3. Configure public access
4. Update Worker to serve from R2

---

## Quick Setup Checklist

- [ ] Choose hosting method (Pages recommended)
- [ ] Deploy static files
- [ ] Get hosting URL
- [ ] Update `TELEGRAM_WEBAPP_URL` in `wrangler.toml`
- [ ] Update `API_BASE` in `public/app.js` (if needed)
- [ ] Redeploy Worker
- [ ] Test mini app in Telegram

---

## Testing

After setup:

1. Open your bot in Telegram
2. Send `/start`
3. Click "Open Study Planner"
4. The mini app should load from your static hosting!

---

## Troubleshooting

**Mini app not loading:**
- Check `TELEGRAM_WEBAPP_URL` is correct
- Verify static files are accessible (open URL in browser)
- Check browser console for errors
- Make sure `API_BASE` in `app.js` points to your Worker

**CORS errors:**
- Make sure your Worker has CORS headers (already included)
- Check that static hosting allows cross-origin requests

**Files not found:**
- Verify file paths are correct
- Check that `index.html` exists at root
- Ensure all files are uploaded

---

## Recommended Setup

**For Production:**
- **Static Files:** Cloudflare Pages
- **Backend:** Cloudflare Workers
- **Both on same domain:** Use Cloudflare Workers Routes

This gives you:
- ✅ Free hosting
- ✅ Fast global CDN
- ✅ Automatic HTTPS
- ✅ Easy deployments




