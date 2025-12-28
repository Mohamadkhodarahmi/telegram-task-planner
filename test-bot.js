/**
 * Test script to check if bot is working
 * Run: node test-bot.js
 */

require('dotenv').config();
const https = require('https');

// Get bot token from environment or ask user
const BOT_TOKEN = process.env.BOT_TOKEN || process.env.TOKEN;

if (!BOT_TOKEN) {
  console.log('❌ BOT_TOKEN not found in environment');
  console.log('Set it with: export BOT_TOKEN=your-bot-token');
  console.log('Or check wrangler secret: wrangler secret list');
  process.exit(1);
}

console.log('🤖 Testing Telegram Bot...\n');
console.log(`Bot Token: ${BOT_TOKEN.substring(0, 10)}...\n`);

// Test 1: Get bot info
console.log('1️⃣ Getting bot information...');
getBotInfo((botInfo) => {
  if (botInfo.ok) {
    console.log(`   ✅ Bot is active: @${botInfo.result.username}`);
    console.log(`   Name: ${botInfo.result.first_name}\n`);
  } else {
    console.log(`   ❌ Error: ${botInfo.description}\n`);
    return;
  }

  // Test 2: Check webhook
  console.log('2️⃣ Checking webhook status...');
  getWebhookInfo((webhookInfo) => {
    if (webhookInfo.ok) {
      const info = webhookInfo.result;
      console.log(`   URL: ${info.url || 'Not set'}`);
      console.log(`   Pending updates: ${info.pending_update_count || 0}`);
      
      if (info.url) {
        console.log(`   ✅ Webhook is set\n`);
      } else {
        console.log(`   ❌ Webhook is NOT set\n`);
        console.log('   Fix: Visit https://telegram-study-planner.mohamadfiery.workers.dev/registerWebhook\n');
        return;
      }

      if (info.last_error_date) {
        console.log(`   ⚠️  Last error: ${new Date(info.last_error_date * 1000).toLocaleString()}`);
        console.log(`   Error: ${info.last_error_message}\n`);
      }
    } else {
      console.log(`   ❌ Error: ${webhookInfo.description}\n`);
    }

    // Test 3: Test webhook endpoint
    console.log('3️⃣ Testing webhook endpoint...');
    testWebhookEndpoint((success) => {
      if (success) {
        console.log(`   ✅ Webhook endpoint is accessible\n`);
      } else {
        console.log(`   ❌ Webhook endpoint is NOT accessible\n`);
      }

      console.log('📊 Summary:');
      console.log('   - If all tests pass, your bot should work!');
      console.log('   - Try sending /start to your bot in Telegram');
      console.log('   - Check logs with: wrangler tail');
    });
  });
});

function getBotInfo(callback) {
  const options = {
    hostname: 'api.telegram.org',
    path: `/bot${BOT_TOKEN}/getMe`,
    method: 'GET'
  };

  const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      try {
        callback(JSON.parse(data));
      } catch (e) {
        callback({ ok: false, description: 'Invalid response' });
      }
    });
  });

  req.on('error', (error) => {
    callback({ ok: false, description: error.message });
  });

  req.end();
}

function getWebhookInfo(callback) {
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
        callback(JSON.parse(data));
      } catch (e) {
        callback({ ok: false, description: 'Invalid response' });
      }
    });
  });

  req.on('error', (error) => {
    callback({ ok: false, description: error.message });
  });

  req.end();
}

function testWebhookEndpoint(callback) {
  const https = require('https');
  const options = {
    hostname: 'telegram-study-planner.mohamadfiery.workers.dev',
    path: '/webhook',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Telegram-Bot-Api-Secret-Token': 'your-secret-token-here'
    }
  };

  const testData = JSON.stringify({
    update_id: 123,
    message: {
      message_id: 1,
      from: { id: 123456, is_bot: false, first_name: 'Test' },
      chat: { id: 123456, type: 'private' },
      date: Math.floor(Date.now() / 1000),
      text: '/start'
    }
  });

  const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      callback(res.statusCode === 200);
    });
  });

  req.on('error', () => {
    callback(false);
  });

  req.write(testData);
  req.end();
}




