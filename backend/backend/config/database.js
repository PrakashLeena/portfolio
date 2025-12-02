const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  const atlasUri = process.env.MONGODB_URI;

  if (!atlasUri) {
    console.error('❌ MONGODB_URI not found in .env file!');
    throw new Error('MONGODB_URI is required');
  }

  try {
    console.log('🔄 Connecting to MongoDB Atlas...');
    console.log('🔗 URI:', atlasUri.replace(/:[^:@]+@/, ':****@')); // Hide password

    const conn = await mongoose.connect(atlasUri, {
      serverSelectionTimeoutMS: 15000, // 15 second timeout
    });

    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
  } catch (error) {
    console.error('❌ Atlas connection failed:', error.message);
    console.error('💡 Possible reasons:');
    console.error('   - IP not whitelisted in MongoDB Atlas Network Access');
    console.error('   - Invalid credentials in MONGODB_URI');
    console.error('   - Network connectivity issues');
    console.error('🔧 Please check your MongoDB Atlas settings');
    throw error;
  }

  // Connection event listeners
  mongoose.connection.on('connected', () => {
    console.log('🔗 Mongoose connected successfully');
  });

  mongoose.connection.on('error', (err) => {
    console.error('❌ Mongoose connection error:', err);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('🔌 Mongoose disconnected');
  });

  // Graceful shutdown
  process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('🛑 MongoDB connection closed through app termination');
    process.exit(0);
  });
};

module.exports = connectDB;
