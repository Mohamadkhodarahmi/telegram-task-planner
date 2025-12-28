# Webhook Setup Guide

This guide explains how to set up the Telegram webhook for your Cloudflare Workers bot.

## What is a Webhook?

A webhook is how Telegram sends updates (messages, button clicks, etc.) to your bot. Instead of your bot constantly asking Telegram for updates (polling), Telegram sends updates directly to your server when they happen.

## Prerequisites

1. ✅ Your Cloudflare Worker is deployed
2. ✅ You have your bot token from [@BotFather](https://t.me/BotFather)
3. ✅ You've set the `SECRET` in `wrangler.toml`
4. ✅ You've set the `TOKEN` secret using `wrangler secret put TOKEN`

## Method 1: Automatic Registration (Easiest) ⭐

This is the **recommended method** - it's built into your worker!

### Steps:

1. **Deploy your worker:**
   ```bash
   wrangler deploy
   ```

2. **Get your worker URL:**
   After deployment, you'll see something like:
   ```
   https://telegram-study-planner.your-username.workers.dev
   ```

3. **Visit the registration endpoint:**
   Open your browser and go to:
   ```
   https://your-worker-url.workers.dev/registerWebhook
   ```

4. **Verify it worked:**
   You should see: `Webhook registered successfully!`

5. **Test your bot:**
   - Open Telegram
   - Find your bot
   - Send `/start`
   - Your bot should respond!

### Troubleshooting Method 1:

**If you see an error:**
- Check that `TOKEN` secret is set: `wrangler secret list`
- Check that `SECRET` is set in `wrangler.toml`
- Make sure your worker is deployed: `wrangler deploy`

---

## Method 2: Manual Registration via Browser

You can manually call the Telegram API:

1. **Get your webhook URL:**
   ```
   https://your-worker-url.workers.dev/webhook
   ```

2. **Get your secret token:**
   Check `wrangler.toml` for the `SECRET` value

3. **Open this URL in your browser:**
   ```
   https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook?url=https://your-worker-url.workers.dev/webhook&secret_token=<YOUR_SECRET>
   ```

   Replace:
   - `<YOUR_BOT_TOKEN>` with your actual bot token
   - `your-worker-url.workers.dev` with your actual worker URL
   - `<YOUR_SECRET>` with your secret from `wrangler.toml`

4. **You should see:**
   ```json
   {"ok":true,"result":true,"description":"Webhook was set"}
   ```

---

## Method 3: Using cURL (Command Line)

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://your-worker-url.workers.dev/webhook",
    "secret_token": "your-secret-token-here"
  }'
```

Replace the placeholders with your actual values.

---

## Method 4: Using Node.js Script

Create a file `set-webhook.js`:

```javascript
const https = require('https');

const BOT_TOKEN = 'your-bot-token-here';
const WEBHOOK_URL = 'https://your-worker-url.workers.dev/webhook';
const SECRET_TOKEN = 'your-secret-token-here';

const data = JSON.stringify({
  url: WEBHOOK_URL,
  secret_token: SECRET_TOKEN
});

const options = {
  hostname: 'api.telegram.org',
  path: `/bot${BOT_TOKEN}/setWebhook`,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = https.request(options, (res) => {
  let responseData = '';
  
  res.on('data', (chunk) => {
    responseData += chunk;
  });
  
  res.on('end', () => {
    console.log('Response:', responseData);
    const result = JSON.parse(responseData);
    if (result.ok) {
      console.log('✅ Webhook set successfully!');
    } else {
      console.log('❌ Error:', result.description);
    }
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
});

req.write(data);
req.end();
```

Run it:
```bash
node set-webhook.js
```

---

## Verify Webhook is Set

Check if your webhook is configured:

**Via Browser:**
```
https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getWebhookInfo
```

**Via cURL:**
```bash
curl "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getWebhookInfo"
```

You should see something like:
```json
{
  "ok": true,
  "result": {
    "url": "https://your-worker-url.workers.dev/webhook",
    "has_custom_certificate": false,
    "pending_update_count": 0
  }
}
```

---

## Update or Remove Webhook

### Update Webhook:
Just visit `/registerWebhook` again or use any of the methods above.

### Remove Webhook:
```
https://api.telegram.org/bot<YOUR_BOT_TOKEN>/deleteWebhook
```

Or via cURL:
```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/deleteWebhook"
```

---

## Security: Secret Token

The `SECRET` token in your `wrangler.toml` is used to verify that requests are coming from Telegram. This prevents unauthorized access to your webhook endpoint.

**Important:**
- Keep your `SECRET` token secure
- Use a random, long string (at least 32 characters)
- Don't commit it to public repositories
- Use `wrangler secret put` for sensitive values

**Generate a secure secret:**
```bash
# On Linux/Mac
openssl rand -hex 32

# Or use an online generator
# Or just use a long random string
```

---

## Troubleshooting

### Bot not responding after webhook setup:

1. **Check worker logs:**
   ```bash
   wrangler tail
   ```
   Then send a message to your bot and watch the logs.

2. **Verify webhook URL:**
   - Make sure it's HTTPS (required by Telegram)
   - Make sure the path is `/webhook`
   - Check that your worker is deployed

3. **Check secret token:**
   - Must match between `wrangler.toml` and webhook registration
   - Telegram sends it in `X-Telegram-Bot-Api-Secret-Token` header

4. **Test webhook endpoint:**
   ```bash
   curl -X POST "https://your-worker-url.workers.dev/webhook" \
     -H "X-Telegram-Bot-Api-Secret-Token: your-secret" \
     -H "Content-Type: application/json" \
     -d '{"message":{"chat":{"id":123},"from":{"id":123},"text":"test"}}'
   ```

### Common Errors:

**"Unauthorized" (401):**
- Secret token doesn't match
- Check `SECRET` in `wrangler.toml` matches what you set in webhook

**"Webhook was set" but bot doesn't respond:**
- Check worker logs: `wrangler tail`
- Verify worker is deployed: `wrangler deploy`
- Make sure `/webhook` endpoint exists in your code

**"Bad Request" (400):**
- Webhook URL must be HTTPS
- URL must be publicly accessible
- Check URL format is correct

---

## Quick Checklist

- [ ] Worker is deployed
- [ ] `TOKEN` secret is set: `wrangler secret put TOKEN`
- [ ] `SECRET` is set in `wrangler.toml`
- [ ] Visited `/registerWebhook` or manually set webhook
- [ ] Verified webhook with `getWebhookInfo`
- [ ] Tested bot with `/start` command
- [ ] Checked logs with `wrangler tail` if issues

---

## Next Steps

After webhook is set:
1. Test all bot commands (`/start`, `/help`, `/buy_star`)
2. Test the mini app (click "Open Study Planner")
3. Monitor logs: `wrangler tail`
4. Set up static file hosting for your frontend

---

## Need Help?

- Check Cloudflare Worker logs: `wrangler tail`
- Verify webhook info: Use `getWebhookInfo` endpoint
- Test webhook manually: Send a POST request to `/webhook`
- Check [Telegram Bot API Docs](https://core.telegram.org/bots/api#setwebhook)




