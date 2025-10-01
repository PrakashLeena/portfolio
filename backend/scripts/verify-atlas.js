require('dotenv').config();

console.log('🔍 MongoDB Atlas Configuration Check\n');

const atlasUri = process.env.MONGODB_URI;

if (!atlasUri) {
  console.log('❌ MONGODB_URI not found in .env file');
  console.log('💡 Create .env file with your Atlas connection string');
  process.exit(1);
}

// Hide password in logs
const maskedUri = atlasUri.replace(/:[^:]*@/, ':****@');
console.log('📋 Connection String Found:', maskedUri);

// Check connection string format
if (!atlasUri.startsWith('mongodb+srv://')) {
  console.log('⚠️  Connection string should start with mongodb+srv://');
}

if (!atlasUri.includes('@cluster0.fk6vzxs.mongodb.net')) {
  console.log('⚠️  Cluster hostname looks different than expected');
}

console.log('\n🔧 Atlas Connection Checklist:');
console.log('1. ✅ IP Address whitelisted (you mentioned this is done)');
console.log('2. ❓ Database user has correct permissions');
console.log('3. ❓ Password is correct (no special characters issues)');
console.log('4. ❓ Network/firewall allows MongoDB connections');

console.log('\n🚀 Quick Fixes to Try:');
console.log('1. In Atlas → Network Access → Add IP: 0.0.0.0/0 (allow all - for testing)');
console.log('2. In Atlas → Database Access → Check user permissions');
console.log('3. Try connecting from MongoDB Compass with same connection string');

console.log('\n📞 Manual Test:');
console.log('Copy this connection string and test in MongoDB Compass:');
console.log(maskedUri);

// Try a basic connection test
const mongoose = require('mongoose');

console.log('\n🔄 Testing connection...');
mongoose.connect(atlasUri, {
  serverSelectionTimeoutMS: 10000,
  connectTimeoutMS: 10000,
})
.then(() => {
  console.log('✅ SUCCESS! Atlas connection works');
  mongoose.connection.close();
})
.catch((error) => {
  console.log('❌ Connection failed:', error.message);
  
  if (error.message.includes('ENOTFOUND')) {
    console.log('💡 DNS issue - check internet connection');
  } else if (error.message.includes('authentication')) {
    console.log('💡 Wrong username/password');
  } else if (error.message.includes('timeout')) {
    console.log('💡 Timeout - likely IP whitelist or firewall issue');
  }
});
