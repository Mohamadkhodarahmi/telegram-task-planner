# Quick Setup Guide

## Step 1: Get Your Telegram Bot Token

1. Open Telegram and search for **@BotFather**
2. Send the command: `/newbot`
3. Follow the prompts to name your bot
4. Copy the token you receive (looks like: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

## Step 2: Install Dependencies

```bash
npm install
```

## Step 3: Create Environment File

Create a file named `.env` in the root directory with the following content:

```env
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_WEBAPP_URL=http://localhost:3000
PORT=3000
```

Replace `your_bot_token_here` with the token from Step 1.

## Step 4: Set Up Bot Commands

1. Go back to **@BotFather** in Telegram
2. Send: `/mybots`
3. Select your bot
4. Choose "Edit Bot" → "Edit Commands"
5. Add these commands:
   ```
   start - Start the Study Planner
   help - Show help information
   buy_star - Purchase stars for premium features
   ```

## Step 5: Run the Application

For development (with auto-reload):
```bash
npm run dev
```

For production:
```bash
npm start
```

## Step 6: Test Locally with ngrok

1. Install ngrok: https://ngrok.com/download
2. In a new terminal, run:
   ```bash
   ngrok http 3000
   ```
3. Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)
4. Update your `.env` file:
   ```env
   TELEGRAM_WEBAPP_URL=https://abc123.ngrok.io
   ```
5. Restart your server

## Step 7: Configure Web App in BotFather

1. Go to **@BotFather**
2. Send: `/mybots`
3. Select your bot
4. Choose "Bot Settings" → "Menu Button"
5. Set the menu button URL to your ngrok URL (or production URL)

## Step 8: Test in Telegram

1. Open your bot in Telegram
2. Send `/start`
3. Click "Open Study Planner" button
4. Test all features!

## Payment Setup (Optional - for production)

To enable real payments:

1. Set up a payment provider (Stripe, etc.)
2. In BotFather, go to `/mybots` → Your Bot → Payments
3. Configure your payment provider
4. Update `provider_token` in `server.js` and `app.js`

For testing, you can use Telegram's test mode.

## Troubleshooting

**Bot not responding:**
- Check that your bot token is correct
- Ensure the server is running
- Check console for errors

**Web app not loading:**
- Verify `TELEGRAM_WEBAPP_URL` matches your ngrok/production URL
- Ensure the URL is HTTPS (required by Telegram)
- Check browser console for errors

**Payment not working:**
- Payment requires a configured payment provider
- For testing, use Telegram's test mode
- Check that `provider_token` is set correctly




