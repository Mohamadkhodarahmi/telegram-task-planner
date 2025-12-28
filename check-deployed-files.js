/**
 * Check if deployed files match local files
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const PAGES_URL = 'https://764571ce.telegram-study-planner.pages.dev';

console.log('🔍 Checking deployed files...\n');

// Read local files
const localCSS = fs.readFileSync(path.join(__dirname, 'public', 'styles.css'), 'utf8');
const localJS = fs.readFileSync(path.join(__dirname, 'public', 'app.js'), 'utf8');

// Check for key markers
const cssMarkers = [
    'transform: translateX(100%)',
    '.screen:not(.active)',
    '!important'
];

const jsMarkers = [
    'langScreen.style.transform',
    'langScreen.style.opacity',
    'langScreen.style.visibility'
];

console.log('📄 Local Files:');
console.log('   CSS markers found:');
cssMarkers.forEach(marker => {
    const found = localCSS.includes(marker);
    console.log(`   ${found ? '✅' : '❌'} ${marker}`);
});

console.log('\n   JS markers found:');
jsMarkers.forEach(marker => {
    const found = localJS.includes(marker);
    console.log(`   ${found ? '✅' : '❌'} ${marker}`);
});

// Check deployed files
console.log('\n🌐 Deployed Files:');
checkDeployedFile(`${PAGES_URL}/styles.css`, 'CSS', cssMarkers, () => {
    checkDeployedFile(`${PAGES_URL}/app.js`, 'JS', jsMarkers, () => {
        console.log('\n📊 Summary:');
        console.log('   - If all markers are ✅, files are up to date');
        console.log('   - If ❌, files need to be redeployed');
    });
});

function checkDeployedFile(url, name, markers, callback) {
    https.get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
            console.log(`\n   ${name} (${data.length} bytes):`);
            markers.forEach(marker => {
                const found = data.includes(marker);
                console.log(`   ${found ? '✅' : '❌'} ${marker}`);
            });
            callback();
        });
    }).on('error', (error) => {
        console.error(`   ❌ Error loading ${name}:`, error.message);
        callback();
    });
}




