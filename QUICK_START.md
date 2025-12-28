# Quick Start Guide

## Choose Your Deployment Method

### Option 1: Express Server (Easier for Beginners)

**Pros:**
- Everything in one place
- Easier local development
- Simple file structure

**Steps:**
1. Install: `npm install`
2. Create `.env` with your bot token
3. Run: `npm start`
4. Deploy to Heroku/Railway/etc.

**See:** `SETUP.md` for details

---

### Option 2: Cloudflare Workers (Recommended for Production)

**Pros:**
- Serverless, auto-scaling
- Free tier: 100k requests/day
- Global edge network
- Webhook-based (more efficient)

**Steps:**
1. Install: `npm install -g wrangler` (or use local)
2. Login: `wrangler login`
3. Configure: Edit `wrangler.toml` and set secrets
4. Deploy: `wrangler deploy`
5. Register webhook: Visit `/registerWebhook`

**See:** `CLOUDFLARE_SETUP.md` for details

---

## Common Setup Steps (Both Methods)

### 1. Get Bot Token
- Open Telegram → Search `@BotFather`
- Send `/newbot`
- Copy the token

### 2. Set Bot Commands
In BotFather, set:
```
start - Start the Study Planner
help - Show help
buy_star - Buy stars
```

### 3. Host Static Files
Your `public/` folder needs to be hosted:
- **Express**: Already served automatically
- **Cloudflare**: Use Cloudflare Pages, R2, or external hosting

### 4. Configure Web App URL
- **Express**: Set in `.env` as `TELEGRAM_WEBAPP_URL`
- **Cloudflare**: Set in `wrangler.toml` as `TELEGRAM_WEBAPP_URL`

### 5. Test
- Send `/start` to your bot
- Click "Open Study Planner"
- Test all features!

---

## File Structure

```
├── server.js              # Express version
├── src/index.ts          # Cloudflare Workers version
├── wrangler.toml         # Cloudflare config
├── package.json          # Express dependencies
├── package-cloudflare.json  # Workers dependencies
├── public/               # Frontend (works with both)
│   ├── index.html
│   ├── styles.css
│   └── app.js
└── README.md            # Main documentation
```

---

## Which Should I Choose?

**Start with Express if:**
- You're new to serverless
- You want everything in one place
- You're prototyping

**Use Cloudflare Workers if:**
- You want production-ready scaling
- You want to minimize costs
- You're comfortable with TypeScript

**Both work great!** You can always migrate later.

---

## Need Help?

- Express setup: See `SETUP.md`
- Cloudflare setup: See `CLOUDFLARE_SETUP.md`
- Comparison: See `README-CLOUDFLARE.md`




