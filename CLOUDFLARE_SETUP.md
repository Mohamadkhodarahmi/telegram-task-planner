# Cloudflare Workers Setup Guide

This guide will help you deploy your Telegram Study Planner bot to Cloudflare Workers, following the approach from [this tutorial](https://dev.to/msarabi/deploying-your-telegram-bots-on-cloudflare-workers-a-step-by-step-guide-3cdk).

## Benefits of Cloudflare Workers

- ✅ **Serverless** - No server management needed
- ✅ **Auto-scaling** - Handles traffic automatically
- ✅ **Global Edge Network** - Low latency worldwide
- ✅ **Free Tier** - 100,000 requests/day free
- ✅ **Webhook-based** - More efficient than polling

## Prerequisites

1. Node.js installed (v18 or higher)
2. A Cloudflare account (free)
3. A Telegram bot token from [@BotFather](https://t.me/BotFather)

## Step 1: Install Wrangler

```bash
npm install -g wrangler
```

Or use it locally:
```bash
npm install wrangler --save-dev
```

## Step 2: Login to Cloudflare

```bash
wrangler login
```

This will open your browser to authenticate with Cloudflare.

## Step 3: Install Dependencies

```bash
npm install
```

Or if using the Cloudflare-specific package.json:
```bash
npm install --package-lock-only
npm install
```

## Step 4: Configure Environment Variables

Edit `wrangler.toml` and set:

```toml
[vars]
TELEGRAM_WEBAPP_URL = "https://your-domain.com"  # Your static hosting URL
SECRET = "your-random-secret-token-here"  # Random string for webhook security
```

Then add your bot token as a secret:

```bash
wrangler secret put TOKEN
```

When prompted, paste your Telegram bot token from BotFather.

## Step 5: Deploy Your Worker

```bash
npm run deploy
```

Or:
```bash
wrangler deploy
```

After deployment, you'll get a URL like: `https://telegram-study-planner.your-username.workers.dev`

## Step 6: Register Webhook

1. Visit: `https://your-worker-url.workers.dev/registerWebhook`
2. You should see: "Webhook registered successfully!"

This tells Telegram to send updates to your Cloudflare Worker instead of polling.

## Step 7: Host Static Files

Your HTML/CSS/JS files need to be hosted separately. Options:

### Option A: Cloudflare Pages (Recommended)
1. Go to Cloudflare Dashboard → Pages
2. Create a new project
3. Connect your Git repository or upload files
4. Deploy the `public/` folder
5. Update `TELEGRAM_WEBAPP_URL` in `wrangler.toml` with your Pages URL

### Option B: Use R2 + Workers
1. Create an R2 bucket
2. Upload your static files
3. Serve them through your Worker

### Option C: External Hosting
- Vercel, Netlify, GitHub Pages, etc.
- Update `TELEGRAM_WEBAPP_URL` accordingly

## Step 8: Update Frontend API URL

In `public/app.js`, update the API base URL to your Cloudflare Worker URL:

```javascript
const API_BASE = 'https://your-worker-url.workers.dev';
```

Or use environment variables in your static hosting.

## Step 9: Test Your Bot

1. Open Telegram and find your bot
2. Send `/start`
3. Click "Open Study Planner"
4. Test all features!

## Differences from Express Version

### 1. Webhooks vs Polling
- **Express**: Uses polling (`polling: true`)
- **Workers**: Uses webhooks (Telegram sends updates to your Worker)

### 2. Storage
- **Express**: In-memory (Map) - lost on restart
- **Workers**: Use KV or Durable Objects for persistence

### 3. Static Files
- **Express**: Served directly from `public/` folder
- **Workers**: Need separate hosting (Pages, R2, or external)

### 4. Environment Variables
- **Express**: `.env` file
- **Workers**: `wrangler.toml` and `wrangler secret put`

## Adding Persistent Storage (Optional)

For production, you should use Cloudflare KV or Durable Objects:

### Using KV:

1. Create a KV namespace:
```bash
wrangler kv:namespace create USER_DATA
```

2. Update `wrangler.toml`:
```toml
[[kv_namespaces]]
binding = "USER_DATA"
id = "your-kv-namespace-id"
```

3. Update `src/index.ts` to use KV:
```typescript
// Save user
await env.USER_DATA.put(`user:${userId}`, JSON.stringify(user));

// Get user
const userData = await env.USER_DATA.get(`user:${userId}`);
```

## Troubleshooting

### Webhook not working
- Check that `/registerWebhook` was called successfully
- Verify `SECRET` matches in both `wrangler.toml` and webhook registration
- Check Cloudflare Worker logs: `wrangler tail`

### Static files not loading
- Ensure `TELEGRAM_WEBAPP_URL` is correct
- Check CORS headers if loading from different domain
- Verify static hosting is accessible

### Bot not responding
- Check Worker logs: `wrangler tail`
- Verify bot token is set: `wrangler secret list`
- Test webhook: Visit `/registerWebhook` again

## Monitoring

View real-time logs:
```bash
wrangler tail
```

View analytics in Cloudflare Dashboard → Workers & Pages → Your Worker

## Cost

- **Free Tier**: 100,000 requests/day
- **Paid**: $5/month for 10 million requests
- Perfect for most Telegram bots!

## Next Steps

1. Set up KV storage for persistence
2. Configure custom domain (optional)
3. Set up monitoring and alerts
4. Add rate limiting if needed

## Resources

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Original Tutorial](https://dev.to/msarabi/deploying-your-telegram-bots-on-cloudflare-workers-a-step-by-step-guide-3cdk)
- [Wrangler CLI Docs](https://developers.cloudflare.com/workers/wrangler/)




