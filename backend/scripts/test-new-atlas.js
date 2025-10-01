const mongoose = require('mongoose');

// Your new Atlas connection string
const newAtlasUri = 'mongodb+srv://kiboxsonleena:20040620Kiyu@cluster0.cr1byep.mongodb.net/passkey?retryWrites=true&w=majority&appName=Cluster0';

const testNewAtlasConnection = async () => {
  console.log('🔍 Testing New MongoDB Atlas Connection...');
  console.log('📋 New Cluster: cluster0.cr1byep.mongodb.net');
  console.log('👤 Username: kiboxsonleena');
  console.log('📊 Database: passkey');
  
  try {
    console.log('\n🔄 Attempting connection...');
    
    const conn = await mongoose.connect(newAtlasUri, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });
    
    console.log('✅ SUCCESS! New Atlas connection works!');
    console.log('🏠 Host:', conn.connection.host);
    console.log('📊 Database:', conn.connection.name);
    console.log('🔗 Connection State:', conn.connection.readyState === 1 ? 'Connected' : 'Disconnected');
    
    // Test database operations
    const collections = await conn.connection.db.listCollections().toArray();
    console.log('📁 Available Collections:', collections.map(c => c.name));
    
    console.log('\n🎉 Atlas connection is working perfectly!');
    console.log('💡 Now update your .env file with this connection string');
    
  } catch (error) {
    console.log('❌ Connection Failed:', error.message);
    
    if (error.message.includes('ENOTFOUND')) {
      console.log('💡 DNS resolution failed - check internet connection');
    } else if (error.message.includes('authentication')) {
      console.log('💡 Authentication failed - check username/password');
      console.log('🔧 Verify credentials in MongoDB Atlas');
    } else if (error.message.includes('timeout')) {
      console.log('💡 Connection timeout - check IP whitelist');
    }
  } finally {
    mongoose.connection.close();
  }
};

testNewAtlasConnection();
