const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  const atlasUri = process.env.MONGODB_URI;
  const localUri = 'mongodb://localhost:27017/portfolio';
  
  // Try Atlas first
  if (atlasUri) {
    try {
      console.log('🔄 Attempting MongoDB Atlas connection...');
      const conn = await mongoose.connect(atlasUri);
      console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
      console.log(`📊 Database: ${conn.connection.name}`);
      return;
    } catch (atlasError) {
      console.log('⚠️  Atlas connection failed:', atlasError.message);
      console.log('💡 This is likely due to IP whitelist restrictions');
      console.log('🔧 Please add your IP to MongoDB Atlas Network Access');
    }
  }

  // Try local MongoDB as fallback
  try {
    console.log('🔄 Trying local MongoDB...');
    const conn = await mongoose.connect(localUri);
    console.log(`✅ Local MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
  } catch (localError) {
    console.log('⚠️  Local MongoDB also failed:', localError.message);
    console.log('🚀 App will continue without database');
    console.log('📧 Contact form will work but data won\'t be saved');
    throw localError; // Let the calling code handle this
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
