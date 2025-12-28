# Quick Webhook Setup ⚡

## The Easiest Way (Recommended)

### Step 1: Deploy Your Worker
```bash
wrangler deploy
```

### Step 2: Set Your Secrets
```bash
# Set your bot token
wrangler secret put TOKEN

# Your SECRET should already be in wrangler.toml
```

### Step 3: Register Webhook
Just open this URL in your browser (replace with your worker URL):
```
https://your-worker-url.workers.dev/registerWebhook
```

**That's it!** You should see: `Webhook registered successfully!`

### Step 4: Test
Send `/start` to your bot in Telegram. It should respond!

---

## Alternative: Using Scripts

### Set Webhook with Script:
```bash
# Set environment variables
export BOT_TOKEN=your-bot-token
export WEBHOOK_URL=https://your-worker.workers.dev/webhook
export SECRET_TOKEN=your-secret-token

# Run the script
npm run set-webhook
```

### Check Webhook Status:
```bash
export BOT_TOKEN=your-bot-token
npm run check-webhook
```

---

## Verify It's Working

1. **Check webhook info:**
   ```bash
   npm run check-webhook
   ```

2. **Test your bot:**
   - Open Telegram
   - Find your bot
   - Send `/start`
   - Bot should respond!

3. **Check logs:**
   ```bash
   wrangler tail
   ```
   Then send a message and watch the logs appear.

---

## Troubleshooting

**Bot not responding?**
- Check logs: `wrangler tail`
- Verify webhook: `npm run check-webhook`
- Make sure worker is deployed: `wrangler deploy`

**Need more help?**
See `WEBHOOK_SETUP.md` for detailed instructions.




