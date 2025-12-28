# Fix Checklist - Step by Step

Follow these steps in order to fix your setup:

## ✅ Step 1: Fix Pages URL

**Issue Found:** Your Pages URL is incomplete

**Current (WRONG):**
```toml
TELEGRAM_WEBAPP_URL = "https://4ddd318c.telegram-study-planner.pages"
```

**Fixed (CORRECT):**
```toml
TELEGRAM_WEBAPP_URL = "https://4ddd318c.telegram-study-planner.pages.dev"
```

**Action:** I've already fixed this in `wrangler.toml` ✅

---

## ✅ Step 2: Redeploy Worker

After fixing the URL, you MUST redeploy:

```bash
wrangler deploy
```

**Why?** The Worker needs the updated `TELEGRAM_WEBAPP_URL` environment variable.

---

## ✅ Step 3: Verify Pages URL Works

Open in browser:
```
https://4ddd318c.telegram-study-planner.pages.dev
```

**Expected:** You should see the Study Planner interface
**If not:** 
- Check Cloudflare Dashboard → Pages
- Verify deployment was successful
- Check if URL is correct

---

## ✅ Step 4: Test API Endpoint

Open in browser:
```
https://telegram-study-planner.mohamadfiery.workers.dev/api/user/123
```

**Expected:** JSON response like:
```json
{
  "language": "en",
  "stars": 0,
  "premium": false,
  "studyPlan": null,
  "progress": []
}
```

**If error:**
- Check worker is deployed
- Check worker logs: `wrangler tail`

---

## ✅ Step 5: Test in Telegram

1. Open your bot in Telegram
2. Send `/start`
3. Click "Open Study Planner" button
4. Open browser console (if possible) or check what happens

**Expected:** Mini app should load and show language selection

**If not working:**
- Check browser console for errors
- Verify `API_BASE` in `public/app.js` is correct
- Make sure both Worker and Pages are deployed

---

## ✅ Step 6: Run Test Script

I've created a test script for you:

```bash
node test-setup.js
```

This will check:
- ✅ Worker accessibility
- ✅ API endpoint
- ✅ CORS headers
- ✅ Pages URL

---

## Common Issues & Solutions

### Issue: "Failed to fetch" in console
**Solution:**
- Check `API_BASE` in `public/app.js`
- Verify Worker URL is correct
- Check CORS headers (already handled in code)

### Issue: "404 Not Found"
**Solution:**
- Make sure routes in `src/index.ts` match `/api/user/:userId`
- Check that Worker is deployed
- Verify API endpoint URL

### Issue: Mini app shows but doesn't load data
**Solution:**
- Check browser console for errors
- Verify `userId` is being retrieved from Telegram
- Check API responses in Network tab

### Issue: Pages URL not loading
**Solution:**
- Verify Pages deployment in Cloudflare Dashboard
- Check URL is complete (ends with `.pages.dev`)
- Try redeploying Pages: `wrangler pages deploy public`

---

## Quick Debug Commands

```bash
# Check worker logs
wrangler tail

# Test API
curl https://telegram-study-planner.mohamadfiery.workers.dev/api/user/123

# Redeploy worker
wrangler deploy

# Redeploy pages
wrangler pages deploy public --project-name=telegram-study-planner
```

---

## What to Check Next

1. **Browser Console:**
   - Open your Pages URL
   - Press F12 → Console tab
   - Look for errors (red text)
   - Share any errors you see

2. **Network Tab:**
   - F12 → Network tab
   - Try to use the app
   - Check which requests fail
   - Look at response status codes

3. **Worker Logs:**
   ```bash
   wrangler tail
   ```
   Then use your app and watch for errors

---

## Still Not Working?

Share these details:
1. Browser console errors (screenshot or copy text)
2. Network tab failed requests
3. Output from `node test-setup.js`
4. What exactly happens when you click "Open Study Planner"
5. Worker logs output

This will help identify the exact issue!




