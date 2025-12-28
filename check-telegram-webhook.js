/**
 * Check if webhook is registered in Telegram
 */

const https = require('https');

// Get token from env (wrangler secret or local export)
// You need to set this: export BOT_TOKEN=your-token
const BOT_TOKEN = process.env.BOT_TOKEN || process.env.TOKEN;
const EXPECTED_WEBHOOK_URL = process.env.EXPECTED_WEBHOOK_URL;

if (!BOT_TOKEN) {
  console.error('Error: BOT_TOKEN or TOKEN environment variable is required');
  process.exit(1);
}

console.log('Checking Telegram webhook status...\n');
console.log(`Bot Token: ${BOT_TOKEN.substring(0, 15)}...\n`);

const options = {
  hostname: 'api.telegram.org',
  path: `/bot${BOT_TOKEN}/getWebhookInfo`,
  method: 'GET'
};

const req = https.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const result = JSON.parse(data);

      if (result.ok) {
        const info = result.result;

        console.log('Webhook Information:');
        console.log(`   URL: ${info.url || 'NOT SET'}`);
        console.log(`   Pending updates: ${info.pending_update_count || 0}`);

        if (info.url) {
          if (EXPECTED_WEBHOOK_URL) {
            if (info.url === EXPECTED_WEBHOOK_URL) {
              console.log('   Webhook URL is correct!');
            } else {
              console.log('   Webhook URL does not match!');
              console.log(`   Expected: ${EXPECTED_WEBHOOK_URL}`);
              console.log(`   Got: ${info.url}`);
            }
          } else {
            console.log('   Note: EXPECTED_WEBHOOK_URL not set, skipping URL match check.');
          }
        } else {
          console.log('   Webhook is NOT registered in Telegram!');
          console.log('   Fix: run the register webhook script or set it via Bot API.');
        }

        if (info.last_error_date) {
          console.log(`\n   Last error: ${new Date(info.last_error_date * 1000).toLocaleString()}`);
          console.log(`   Error message: ${info.last_error_message || 'Unknown'}`);
        }

        if (info.pending_update_count > 0) {
          console.log(`\n   There are ${info.pending_update_count} pending updates`);
          console.log('   This means Telegram tried to send updates but they failed');
        }
      } else {
        console.log('Error:', result.description);
        if (result.error_code === 401) {
          console.log('   This means the BOT_TOKEN is invalid!');
        }
      }
    } catch (error) {
      console.error('Error parsing response:', error);
      console.log('Raw response:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('Network error:', error.message);
});

req.end();
