const mongoose = require('mongoose');
require('dotenv').config();

// Connect to database
const connectDB = async () => {
  // Use the working Atlas URI directly
  const atlasUri = 'mongodb+srv://kiboxsonleena:20040620Kiyu@cluster0.cr1byep.mongodb.net/passkey?retryWrites=true&w=majority&appName=Cluster0';
  const localUri = 'mongodb://localhost:27017/portfolio';
  
  try {
    console.log('🔄 Connecting to Atlas database...');
    await mongoose.connect(atlasUri);
    console.log('✅ Connected to MongoDB Atlas');
  } catch (atlasError) {
    console.log('⚠️  Atlas failed, trying local...');
    try {
      await mongoose.connect(localUri);
      console.log('✅ Connected to Local MongoDB');
    } catch (localError) {
      console.error('❌ Both connections failed:', localError.message);
      process.exit(1);
    }
  }
};

// Schema
const credentialSchema = new mongoose.Schema({
  user: String,
  pass: String
});

const Credential = mongoose.model("Credential", credentialSchema, "BulkMail");

// Add credentials
const addCredentials = async () => {
  try {
    await connectDB();
    
    // Clear existing credentials
    await Credential.deleteMany({});
    console.log('🗑️  Cleared existing credentials');
    
    // Add new credentials
    const newCredential = new Credential({
      user: 'kiboxsonleena51@gmail.com',
      pass: 'kgtd emuu ofrd nrld' // You need to get this from Google
    });
    
    await newCredential.save();
    console.log('✅ Email credentials added successfully!');
    console.log('📧 From: kiboxsonleena51@gmail.com');
    console.log('📨 To: kiboxsonleena2004@gmail.com');
    console.log('');
    console.log('🚀 Now restart your backend server to test email functionality');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    mongoose.connection.close();
  }
};

addCredentials();
