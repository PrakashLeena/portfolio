const mongoose = require('mongoose');
require('dotenv').config();

const testAtlasConnection = async () => {
  const atlasUri = process.env.MONGODB_URI;
  
  console.log('🔍 Testing MongoDB Atlas Connection...');
  console.log('📋 Connection String:', atlasUri ? atlasUri.replace(/:[^:]*@/, ':****@') : 'NOT FOUND');
  
  if (!atlasUri) {
    console.log('❌ MONGODB_URI not found in .env file');
    console.log('💡 Make sure your .env file contains the Atlas connection string');
    return;
  }
  
  try {
    console.log('🔄 Attempting Atlas connection...');
    
    // Set a shorter timeout for testing
    const conn = await mongoose.connect(atlasUri, {
      serverSelectionTimeoutMS: 10000, // 10 seconds timeout
    });
    
    console.log('✅ SUCCESS! MongoDB Atlas Connected');
    console.log('🏠 Host:', conn.connection.host);
    console.log('📊 Database:', conn.connection.name);
    console.log('🔗 Connection State:', conn.connection.readyState === 1 ? 'Connected' : 'Disconnected');
    
    // Test a simple operation
    const collections = await conn.connection.db.listCollections().toArray();
    console.log('📁 Available Collections:', collections.map(c => c.name));
    
  } catch (error) {
    console.log('❌ Atlas Connection Failed');
    console.log('🔍 Error Type:', error.name);
    console.log('📝 Error Message:', error.message);
    
    if (error.message.includes('ENOTFOUND')) {
      console.log('💡 DNS Resolution Failed - Check internet connection');
    } else if (error.message.includes('authentication')) {
      console.log('💡 Authentication Failed - Check username/password');
    } else if (error.message.includes('whitelist') || error.message.includes('IP')) {
      console.log('💡 IP Not Whitelisted - Add your IP to Atlas Network Access');
      console.log('🔗 Go to: https://cloud.mongodb.com/ → Network Access → Add IP Address');
    } else if (error.message.includes('timeout')) {
      console.log('💡 Connection Timeout - Check firewall or network settings');
    }
  } finally {
    mongoose.connection.close();
  }
};

testAtlasConnection();
