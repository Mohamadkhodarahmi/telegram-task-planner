/**
 * Script to check Telegram webhook status
 * 
 * Usage:
 *   node scripts/check-webhook.js
 * 
 * Make sure to set BOT_TOKEN environment variable
 */

require('dotenv').config();

const https = require('https');

const BOT_TOKEN = process.env.BOT_TOKEN || process.env.TOKEN;

if (!BOT_TOKEN) {
  console.error('❌ Error: BOT_TOKEN or TOKEN environment variable is required');
  process.exit(1);
}

console.log('🔍 Checking webhook status...\n');

const options = {
  hostname: 'api.telegram.org',
  path: `/bot${BOT_TOKEN}/getWebhookInfo`,
  method: 'GET'
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
        const info = result.result;
        console.log('📊 Webhook Information:');
        console.log(`   URL: ${info.url || 'Not set'}`);
        console.log(`   Has custom certificate: ${info.has_custom_certificate ? 'Yes' : 'No'}`);
        console.log(`   Pending updates: ${info.pending_update_count || 0}`);
        if (info.last_error_date) {
          console.log(`   ⚠️  Last error: ${new Date(info.last_error_date * 1000).toLocaleString()}`);
          console.log(`   Error message: ${info.last_error_message || 'Unknown'}`);
        }
        if (info.max_connections) {
          console.log(`   Max connections: ${info.max_connections}`);
        }
        if (info.allowed_updates) {
          console.log(`   Allowed updates: ${info.allowed_updates.join(', ')}`);
        }
      } else {
        console.log('❌ Error getting webhook info:');
        console.log(`   ${result.description}`);
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

req.end();




