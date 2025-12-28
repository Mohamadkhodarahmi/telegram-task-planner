/**
 * Script to verify deployment
 */

const https = require('https');

const PAGES_URL = 'https://53828200.telegram-study-planner.pages.dev';

console.log('🔍 Checking deployment...\n');

// Check CSS
console.log('1️⃣ Checking CSS file...');
checkFile(`${PAGES_URL}/styles.css`, (content) => {
    if (content.includes('transform: translateX(100%)')) {
        console.log('   ✅ New CSS code found (transform method)');
    } else {
        console.log('   ⚠️  Old CSS code (may need cache clear)');
    }
    
    // Check JS
    console.log('\n2️⃣ Checking JS file...');
    checkFile(`${PAGES_URL}/app.js`, (content) => {
        if (content.includes('transform: translateX') || content.includes('selectLanguage')) {
            console.log('   ✅ JS file is accessible');
        } else {
            console.log('   ⚠️  JS file may be cached');
        }
        
        console.log('\n📊 Summary:');
        console.log('   - If you see ✅, files are deployed');
        console.log('   - If you see ⚠️, try hard refresh (Ctrl+Shift+R)');
        console.log('   - In Telegram, close and reopen the mini app');
    });
});

function checkFile(url, callback) {
    https.get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
            callback(data);
        });
    }).on('error', (error) => {
        console.error('   ❌ Error:', error.message);
        callback('');
    });
}




