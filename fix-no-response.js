/**
 * Debug why bot doesn't respond even though webhook receives the message
 */

const https = require('https');

const BOT_TOKEN = process.env.BOT_TOKEN || process.env.TOKEN;
const CHAT_ID = process.env.CHAT_ID ? Number(process.env.CHAT_ID) : 123456789; // Replace or set CHAT_ID env var

if (!BOT_TOKEN) {
  console.error('❌ Error: BOT_TOKEN or TOKEN environment variable is required');
  process.exit(1);
}

console.log('🔍 Testing bot response...\n');

// Test 1: Check if bot can send messages
console.log('1️⃣ Testing sendMessage API...');

const testMessage = {
  chat_id: CHAT_ID,
  text: 'Test message from bot'
};

const options = {
  hostname: 'api.telegram.org',
  path: `/bot${BOT_TOKEN}/sendMessage`,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': JSON.stringify(testMessage).length
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
        console.log('✅ Bot can send messages!');
        console.log(`   Message ID: ${result.result.message_id}`);
      } else {
        console.log('❌ Error sending message:');
        console.log(`   ${result.description}`);
        console.log(`   Error code: ${result.error_code}`);
        
        if (result.error_code === 403) {
          console.log('\n   ⚠️  Bot is blocked or chat not found');
        } else if (result.error_code === 400) {
          console.log('\n   ⚠️  Invalid chat_id or message format');
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

req.write(JSON.stringify(testMessage));
req.end();




