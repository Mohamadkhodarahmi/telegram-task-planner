/**
 * Manually register webhook with Telegram API
 */

const https = require('https');

const BOT_TOKEN = process.env.BOT_TOKEN || process.env.TOKEN;
const WEBHOOK_URL = process.env.WEBHOOK_URL;
const SECRET = process.env.SECRET || process.env.SECRET_TOKEN;

if (!BOT_TOKEN || !WEBHOOK_URL) {
  console.error('❌ Error: BOT_TOKEN/TOKEN and WEBHOOK_URL environment variables are required');
  process.exit(1);
}

console.log('🔧 Registering webhook manually...\n');
console.log(`Bot Token: ${BOT_TOKEN.substring(0, 15)}...`);
console.log(`Webhook URL: ${WEBHOOK_URL}`);
console.log(`Secret: ${SECRET ? 'Set' : 'Not set'}\n`);

const body = JSON.stringify({
  url: WEBHOOK_URL,
  ...(SECRET && { secret_token: SECRET })
});

const options = {
  hostname: 'api.telegram.org',
  path: `/bot${BOT_TOKEN}/setWebhook`,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': body.length
  }
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
        console.log('✅ Webhook registered successfully!');
        console.log(`   URL: ${result.result.url || WEBHOOK_URL}`);
        console.log(`   Pending updates: ${result.result.pending_update_count || 0}`);
        
        // Verify it was set
        setTimeout(() => {
          console.log('\n🔍 Verifying webhook...');
          verifyWebhook();
        }, 1000);
      } else {
        console.log('❌ Error registering webhook:');
        console.log(`   ${result.description}`);
        if (result.error_code) {
          console.log(`   Error code: ${result.error_code}`);
        }
      }
    } catch (error) {
      console.error('❌ Error parsing response:', error);
      console.log('Raw response:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Network error:', error.message);
});

req.write(body);
req.end();

function verifyWebhook() {
  const options = {
    hostname: 'api.telegram.org',
    path: `/bot${BOT_TOKEN}/getWebhookInfo`,
    method: 'GET'
  };

  const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      try {
        const result = JSON.parse(data);
        if (result.ok && result.result.url) {
          console.log(`✅ Verified! Webhook URL: ${result.result.url}`);
        } else {
          console.log('⚠️  Webhook not found after registration');
        }
      } catch (e) {
        console.log('Could not verify');
      }
    });
  });
  req.end();
}




