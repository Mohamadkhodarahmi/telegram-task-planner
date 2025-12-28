/**
 * Debug script to test webhook directly
 */

const https = require('https');

const WORKER_URL = process.env.WORKER_URL;
const SECRET = process.env.SECRET || process.env.SECRET_TOKEN;

if (!WORKER_URL || !SECRET) {
  console.error('❌ Error: WORKER_URL and SECRET (or SECRET_TOKEN) environment variables are required');
  process.exit(1);
}

console.log('🔍 Testing webhook endpoint...\n');

// Create a test update (simulating Telegram)
const testUpdate = {
  update_id: 123456789,
  message: {
    message_id: 1,
    from: {
      id: 123456789,
      is_bot: false,
      first_name: 'Test',
      username: 'testuser'
    },
    chat: {
      id: 123456789,
      type: 'private',
      first_name: 'Test',
      username: 'testuser'
    },
    date: Math.floor(Date.now() / 1000),
    text: '/start'
  }
};

const workerUrl = new URL(WORKER_URL);
const options = {
  hostname: workerUrl.hostname,
  path: '/webhook',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Telegram-Bot-Api-Secret-Token': SECRET
  }
};

console.log('Sending test update to webhook...');
console.log('URL:', `https://${options.hostname}${options.path}`);
console.log('SECRET:', SECRET);
console.log('Update:', JSON.stringify(testUpdate, null, 2));
console.log('');

const req = https.request(options, (res) => {
  let data = '';
  
  console.log(`Status Code: ${res.statusCode}`);
  console.log('Headers:', res.headers);
  console.log('');
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response:', data);
    
    if (res.statusCode === 200) {
      console.log('\n✅ Webhook responded successfully!');
    } else if (res.statusCode === 401) {
      console.log('\n❌ Unauthorized - SECRET token mismatch!');
      console.log('Check SECRET in wrangler.toml matches the one used in webhook registration');
    } else {
      console.log(`\n❌ Error: Status ${res.statusCode}`);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Request error:', error.message);
});

req.write(JSON.stringify(testUpdate));
req.end();




