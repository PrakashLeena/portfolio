const https = require('https');

console.log('🔍 Checking your current IP address...\n');

// Method 1: Using ipify API
https.get('https://api.ipify.org?format=json', (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const result = JSON.parse(data);
      console.log('📍 Your current IP address:', result.ip);
      console.log('\n📋 Steps to whitelist this IP in MongoDB Atlas:');
      console.log('1. Go to https://cloud.mongodb.com/');
      console.log('2. Select your project');
      console.log('3. Click "Network Access" in the left sidebar');
      console.log('4. Click "Add IP Address"');
      console.log(`5. Enter: ${result.ip}/32`);
      console.log('6. Click "Confirm"');
      console.log('\n💡 Or for development, use 0.0.0.0/0 to allow all IPs');
    } catch (error) {
      console.error('❌ Error parsing IP response:', error);
    }
  });
}).on('error', (error) => {
  console.error('❌ Error fetching IP:', error.message);
  console.log('\n🔧 Alternative: Check your IP manually at https://whatismyipaddress.com/');
});
