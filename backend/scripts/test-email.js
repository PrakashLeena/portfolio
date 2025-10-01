const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Connect to database
const connectDB = async () => {
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

// Test email functionality
const testEmail = async () => {
  try {
    await connectDB();
    
    // Get credentials
    const data = await Credential.find();
    if (!data || data.length === 0) {
      console.log('❌ No email credentials found');
      console.log('💡 Run: npm run add-email');
      return;
    }
    
    console.log('📧 Found credentials for:', data[0].user);
    
    // Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: data[0].user,
        pass: data[0].pass,
      },
    });
    
    // Send test email
    console.log('📨 Sending test email...');
    await transporter.sendMail({
      from: data[0].user,
      to: "kiboxsonleena2004@gmail.com",
      subject: "Test Email from Portfolio Backend",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #8b5cf6;">🎉 Email Setup Successful!</h2>
          <p>This is a test email to confirm your portfolio contact form email system is working.</p>
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>From:</strong> ${data[0].user}</p>
            <p><strong>To:</strong> kiboxsonleena2004@gmail.com</p>
            <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
          </div>
          <p style="color: #666;">Your contact form is now ready to receive messages!</p>
        </div>
      `
    });
    
    console.log('✅ Test email sent successfully!');
    console.log('📬 Check kiboxsonleena2004@gmail.com for the test email');
    
  } catch (error) {
    console.error('❌ Email test failed:', error.message);
    if (error.message.includes('authentication')) {
      console.log('💡 Check your Gmail App Password');
    }
  } finally {
    mongoose.connection.close();
  }
};

testEmail();
