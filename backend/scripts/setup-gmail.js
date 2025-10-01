const mongoose = require('mongoose');

// STEP 1: Get Gmail App Password
console.log('📧 Gmail App Password Setup Guide:');
console.log('1. Go to https://myaccount.google.com/');
console.log('2. Sign in with kiboxsonleena51@gmail.com');
console.log('3. Security → 2-Step Verification → App passwords');
console.log('4. Generate password for "Mail"');
console.log('5. Copy the 16-character password');
console.log('6. Replace GMAIL_APP_PASSWORD below with your actual password');
console.log('');

// STEP 2: Replace this with your actual Gmail App Password
const GMAIL_APP_PASSWORD = 'REPLACE_WITH_YOUR_16_CHAR_PASSWORD';

if (GMAIL_APP_PASSWORD === 'REPLACE_WITH_YOUR_16_CHAR_PASSWORD') {
  console.log('❌ Please replace GMAIL_APP_PASSWORD with your actual Gmail App Password');
  console.log('💡 Edit this file and update the GMAIL_APP_PASSWORD variable');
  process.exit(1);
}

// Connect and add credentials
const setupGmail = async () => {
  const atlasUri = 'mongodb+srv://kiboxsonleena:20040620Kiyu@cluster0.cr1byep.mongodb.net/passkey?retryWrites=true&w=majority&appName=Cluster0';
  
  try {
    console.log('🔄 Connecting to MongoDB Atlas...');
    await mongoose.connect(atlasUri);
    console.log('✅ Connected to Atlas');
    
    // Schema
    const credentialSchema = new mongoose.Schema({
      user: String,
      pass: String
    });
    
    const Credential = mongoose.model("Credential", credentialSchema, "BulkMail");
    
    // Clear and add credentials
    await Credential.deleteMany({});
    
    const newCredential = new Credential({
      user: 'kiboxsonleena51@gmail.com',
      pass: GMAIL_APP_PASSWORD
    });
    
    await newCredential.save();
    
    console.log('✅ Gmail credentials saved to Atlas!');
    console.log('📧 From: kiboxsonleena51@gmail.com');
    console.log('📨 To: kiboxsonleena2004@gmail.com');
    console.log('🚀 Email system is ready!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    mongoose.connection.close();
  }
};

setupGmail();
