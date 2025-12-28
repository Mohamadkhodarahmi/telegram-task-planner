/**
 * Script to set Telegram webhook for Cloudflare Workers
 * 
 * Usage:
 *   node scripts/set-webhook.js
 * 
 * Make sure to set these environment variables:
 *   BOT_TOKEN - Your Telegram bot token
 *   WEBHOOK_URL - Your Cloudflare Worker webhook URL
 *   SECRET_TOKEN - Your secret token (from wrangler.toml)
 */

require('dotenv').config();

const https = require('https');

const BOT_TOKEN = process.env.BOT_TOKEN || process.env.TOKEN;
const WEBHOOK_URL = process.env.WEBHOOK_URL || process.env.TELEGRAM_WEBAPP_URL?.replace('/index.html', '/webhook');
const SECRET_TOKEN = process.env.SECRET_TOKEN || process.env.SECRET;

if (!BOT_TOKEN) {
  console.error('❌ Error: BOT_TOKEN or TOKEN environment variable is required');
  console.log('\nSet it with: export BOT_TOKEN=your-bot-token');
  process.exit(1);
}

if (!WEBHOOK_URL) {
  console.error('❌ Error: WEBHOOK_URL environment variable is required');
  console.log('\nSet it with: export WEBHOOK_URL=https://your-worker.workers.dev/webhook');
  process.exit(1);
}

if (!SECRET_TOKEN) {
  console.warn('⚠️  Warning: SECRET_TOKEN not set. Webhook will be set without secret token verification.');
}

console.log('🔧 Setting Telegram webhook...');
console.log(`   Bot Token: ${BOT_TOKEN.substring(0, 10)}...`);
console.log(`   Webhook URL: ${WEBHOOK_URL}`);
console.log(`   Secret Token: ${SECRET_TOKEN ? 'Set ✓' : 'Not set'}\n`);

const data = JSON.stringify({
  url: WEBHOOK_URL,
  ...(SECRET_TOKEN && { secret_token: SECRET_TOKEN })
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
    try {
      const result = JSON.parse(responseData);
      if (result.ok) {
        console.log('✅ Webhook set successfully!');
        console.log(`   URL: ${result.result.url || WEBHOOK_URL}`);
        console.log(`   Pending updates: ${result.result.pending_update_count || 0}`);
      } else {
        console.log('❌ Error setting webhook:');
        console.log(`   ${result.description}`);
        if (result.error_code) {
          console.log(`   Error code: ${result.error_code}`);
        }
      }
    } catch (error) {
      console.error('❌ Error parsing response:', error);
      console.log('Response:', responseData);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Network error:', error.message);
});

req.write(data);
req.end();




