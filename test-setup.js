/**
 * Test script to verify your setup
 * Run: node test-setup.js
 */

const https = require('https');
const http = require('http');

const WORKER_URL = 'https://telegram-study-planner.mohamadfiery.workers.dev';
const PAGES_URL = 'https://dde9f6b1.telegram-study-planner.pages.dev';

console.log('🔍 Testing Your Setup...\n');
console.log(`Worker URL: ${WORKER_URL}`);
console.log(`Pages URL: ${PAGES_URL}\n`);

// Test 1: Check Worker is accessible
console.log('1️⃣ Testing Worker accessibility...');
testURL(WORKER_URL, (success, status) => {
  if (success) {
    console.log(`   ✅ Worker is accessible (Status: ${status})\n`);
  } else {
    console.log(`   ❌ Worker is NOT accessible (Status: ${status})\n`);
  }
  
  // Test 2: Check API endpoint
  console.log('2️⃣ Testing API endpoint...');
  testURL(`${WORKER_URL}/api/user/123`, (success, status, data) => {
    if (success && status === 200) {
      console.log(`   ✅ API endpoint works (Status: ${status})`);
      try {
        const json = JSON.parse(data);
        console.log(`   Response:`, json);
      } catch (e) {
        console.log(`   Response: ${data}`);
      }
    } else {
      console.log(`   ❌ API endpoint failed (Status: ${status})`);
      if (data) console.log(`   Error: ${data}`);
    }
    console.log('');
    
    // Test 3: Check CORS
    console.log('3️⃣ Testing CORS headers...');
    testCORS(`${WORKER_URL}/api/user/123`, (hasCORS) => {
      if (hasCORS) {
        console.log(`   ✅ CORS headers are present\n`);
      } else {
        console.log(`   ❌ CORS headers missing\n`);
      }
      
      // Test 4: Check Pages
      console.log('4️⃣ Testing Pages URL...');
      testURL(PAGES_URL, (success, status) => {
        if (success) {
          console.log(`   ✅ Pages URL is accessible (Status: ${status})\n`);
        } else {
          console.log(`   ❌ Pages URL is NOT accessible (Status: ${status})`);
          console.log(`   ⚠️  Make sure your Pages URL is complete (should end with .pages.dev)\n`);
        }
        
        // Summary
        console.log('📊 Summary:');
        console.log('   - Check the results above');
        console.log('   - If any test failed, fix the issue and run again');
        console.log('   - Make sure both Worker and Pages are deployed');
        console.log('\n💡 Common fixes:');
        console.log('   1. Complete Pages URL in wrangler.toml (add .dev)');
        console.log('   2. Redeploy Worker: wrangler deploy');
        console.log('   3. Check browser console for errors');
      });
    });
  });
});

function testURL(url, callback) {
  const client = url.startsWith('https') ? https : http;
  
  const req = client.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      callback(true, res.statusCode, data);
    });
  });
  
  req.on('error', (error) => {
    callback(false, error.code || 'ERROR', error.message);
  });
  
  req.setTimeout(5000, () => {
    req.destroy();
    callback(false, 'TIMEOUT', 'Request timeout');
  });
}

function testCORS(url, callback) {
  const client = url.startsWith('https') ? https : http;
  
  const options = new URL(url);
  const req = client.request({
    hostname: options.hostname,
    path: options.pathname,
    method: 'OPTIONS',
    headers: {
      'Origin': 'https://example.com',
      'Access-Control-Request-Method': 'GET'
    }
  }, (res) => {
    const hasCORS = res.headers['access-control-allow-origin'] !== undefined;
    callback(hasCORS);
  });
  
  req.on('error', () => callback(false));
  req.end();
}

