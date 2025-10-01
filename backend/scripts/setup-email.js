const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB (try Atlas first, then local)
const connectDB = async () => {
  const atlasUri = process.env.MONGODB_URI;
  const localUri = 'mongodb://localhost:27017/portfolio';
  
  // Try Atlas first
  if (atlasUri) {
    try {
      console.log('🔄 Attempting MongoDB Atlas connection...');
      await mongoose.connect(atlasUri);
      console.log('✅ Connected to MongoDB Atlas');
      return;
    } catch (atlasError) {
      console.log('⚠️  Atlas connection failed, trying local MongoDB...');
    }
  }
  
  // Try local MongoDB as fallback
  try {
    await mongoose.connect(localUri);
    console.log('✅ Connected to Local MongoDB');
  } catch (localError) {
    console.error('❌ Both Atlas and Local MongoDB connection failed');
    console.log('💡 Make sure MongoDB is running locally');
    process.exit(1);
  }
};

// Define schema
const credentialSchema = new mongoose.Schema({
  user: String,
  pass: String
});

const Credential = mongoose.model("Credential", credentialSchema, "BulkMail");

// Setup email credentials
const setupEmailCredentials = async () => {
  try {
    await connectDB();
    
    // Check if credentials already exist
    const existingCredentials = await Credential.find();
    
    if (existingCredentials.length > 0) {
      console.log('📧 Email credentials already exist:');
      console.log('User:', existingCredentials[0].user);
      console.log('Pass: ******* (hidden)');
      
      // Ask if user wants to update
      console.log('\n🔄 To update credentials, delete existing ones first');
      return;
    }
    
    // Create new credentials
    const newCredential = new Credential({
      user: 'kiboxsonleena51@gmail.com',
      pass: 'YOUR_GMAIL_APP_PASSWORD_HERE' // You need to replace this
    });
    
    await newCredential.save();
    console.log('✅ Email credentials saved successfully!');
    console.log('📧 Sender email: kiboxsonleena51@gmail.com');
    console.log('📨 Receiver email: kiboxsonleena2004@gmail.com');
    
    console.log('\n⚠️  IMPORTANT: Replace YOUR_GMAIL_APP_PASSWORD_HERE with actual Gmail App Password');
    console.log('🔗 How to get Gmail App Password:');
    console.log('1. Go to Google Account settings');
    console.log('2. Security → 2-Step Verification → App passwords');
    console.log('3. Generate app password for "Mail"');
    console.log('4. Update the password in MongoDB');
    
  } catch (error) {
    console.error('❌ Error setting up credentials:', error);
  } finally {
    mongoose.connection.close();
  }
};

setupEmailCredentials();
