# Serve Static Files from Cloudflare Worker

If you want to serve static files directly from your Worker (simpler but less optimal), follow these steps:

## Method 1: Using Wrangler Assets (Recommended)

Cloudflare Workers can serve static assets using the `assets` directory.

### Steps:

1. **Create `assets` directory:**
   ```bash
   mkdir assets
   cp -r public/* assets/
   ```

2. **Update `wrangler.toml`:**
   ```toml
   name = "telegram-study-planner"
   main = "src/index.ts"
   compatibility_date = "2024-01-01"
   
   [site]
   bucket = "./assets"
   
   [vars]
   TELEGRAM_WEBAPP_URL = "https://your-worker.workers.dev"
   SECRET = "your-secret-token-here"
   ```

3. **Update `src/index.ts` to serve static files:**
   The Worker will automatically serve files from the `assets` directory.

4. **Deploy:**
   ```bash
   wrangler deploy
   ```

**Note:** This method has limitations and is being phased out. Use Cloudflare Pages instead.

---

## Method 2: Embed Files in Worker (For Small Files)

You can embed static files directly in your Worker code.

### Steps:

1. **Install a bundler plugin** or use inline strings
2. **Update Worker code** to return file contents
3. **Deploy**

This is only practical for very small files.

---

## Method 3: Use Worker Routes (Best for Same Domain)

If you want everything on the same domain:

1. **Deploy static files to Cloudflare Pages**
2. **Use Worker Routes** to serve both
3. **Configure custom domain**

This requires more setup but gives you a unified domain.

---

## Recommendation

**Don't serve static files from Worker.** Instead:

1. ✅ Use **Cloudflare Pages** for static files (free, fast, easy)
2. ✅ Use **Workers** for API/backend only
3. ✅ Connect them via `TELEGRAM_WEBAPP_URL`

This is the best practice and what Cloudflare recommends.

See `STATIC_FILES_SETUP.md` for the recommended approach.




