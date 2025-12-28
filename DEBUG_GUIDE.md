# Debugging Guide - Mini App Not Working

Let's systematically check what's wrong:

## Step 1: Check Your URLs

### Your Current Configuration:
- **Worker URL:** `https://telegram-study-planner.mohamadfiery.workers.dev`
- **Pages URL:** `https://4ddd318c.telegram-study-planner.pages` (looks incomplete!)

### Issues Found:

1. **Pages URL is incomplete** - Should end with `.pages.dev`
2. **API_BASE might need `/api` prefix** - Check if your routes work

## Step 2: Verify Static Files Are Accessible

Open in browser:
```
https://4ddd318c.telegram-study-planner.pages.dev
```

**Expected:** You should see the Study Planner interface
**If not:** Your Pages deployment might have issues

## Step 3: Test API Endpoints

Test these URLs in your browser or with curl:

### Test 1: Check if Worker is responding
```
https://telegram-study-planner.mohamadfiery.workers.dev/api/user/123
```

**Expected:** JSON response (even if user not found)
**If error:** Worker might not be deployed or routes are wrong

### Test 2: Check CORS
Open browser console on your Pages site and check for CORS errors.

## Step 4: Check Browser Console

1. Open your Pages URL in browser
2. Open Developer Tools (F12)
3. Go to Console tab
4. Look for errors

Common errors:
- `Failed to fetch` - API URL wrong or CORS issue
- `404 Not Found` - Route doesn't exist
- `CORS policy` - CORS headers missing

## Step 5: Check Network Tab

1. Open Developer Tools → Network tab
2. Try to use the app
3. Check which requests are failing
4. Look at the response status codes

## Step 6: Verify Configuration

### Check `wrangler.toml`:
```toml
[vars]
TELEGRAM_WEBAPP_URL = "https://4ddd318c.telegram-study-planner.pages.dev"  # Must be complete URL
SECRET = "your-secret-token-here"
```

### Check `public/app.js`:
```javascript
const API_BASE = 'https://telegram-study-planner.mohamadfiery.workers.dev';
```

**Note:** The API routes in the worker expect `/api/` prefix, so this should work.

## Common Issues & Fixes

### Issue 1: Pages URL incomplete
**Fix:** Make sure it ends with `.pages.dev` or `.cloudflarepages.com`

### Issue 2: API not responding
**Fix:** 
- Check worker is deployed: `wrangler deploy`
- Check worker logs: `wrangler tail`
- Verify routes in `src/index.ts`

### Issue 3: CORS errors
**Fix:** Already handled in code, but verify CORS headers are present

### Issue 4: User ID not found
**Fix:** Make sure Telegram WebApp SDK is initialized and `userId` is set

## Quick Test Script

Create `test-api.js`:
```javascript
const API_BASE = 'https://telegram-study-planner.mohamadfiery.workers.dev';

async function testAPI() {
  console.log('Testing API...');
  
  // Test 1: Get user (should work even if user doesn't exist)
  try {
    const response = await fetch(`${API_BASE}/api/user/123`);
    const data = await response.json();
    console.log('✅ User endpoint works:', data);
  } catch (error) {
    console.error('❌ User endpoint failed:', error);
  }
  
  // Test 2: Check CORS
  try {
    const response = await fetch(`${API_BASE}/api/user/123`, {
      method: 'OPTIONS'
    });
    console.log('✅ CORS headers:', response.headers.get('Access-Control-Allow-Origin'));
  } catch (error) {
    console.error('❌ CORS test failed:', error);
  }
}

testAPI();
```

Run: `node test-api.js`

## Still Not Working?

1. **Check Worker Logs:**
   ```bash
   wrangler tail
   ```
   Then use your app and watch for errors

2. **Check Pages Logs:**
   - Go to Cloudflare Dashboard
   - Workers & Pages → Your Pages project
   - Check deployment logs

3. **Test in Telegram:**
   - Open your bot
   - Send `/start`
   - Click "Open Study Planner"
   - Check what happens

4. **Share these details:**
   - Browser console errors
   - Network tab failed requests
   - Worker logs output
   - What exactly happens when you click "Open Study Planner"




