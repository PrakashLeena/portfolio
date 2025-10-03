const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const connectDB = require("./config/database");
require('dotenv').config();

const app = express();

// Middleware
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000', 
      'http://127.0.0.1:3000', 
      'http://localhost:3001',
      /\.vercel\.app$/, // Allow all Vercel deployments
      /\.netlify\.app$/, // Allow Netlify deployments
      /\.railway\.app$/, // Allow Railway deployments
      /\.up\.railway\.app$/, // Allow Railway custom domains
      /^https?:\/\/localhost(:\d+)?$/, // Allow any localhost port
    ];
    
    // Check if origin matches any allowed pattern
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (typeof allowedOrigin === 'string') {
        return origin === allowedOrigin;
      } else if (allowedOrigin instanceof RegExp) {
        return allowedOrigin.test(origin);
      }
      return false;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB Atlas (with error handling)
connectDB().catch(err => {
  console.log('⚠️  MongoDB connection failed, running without database');
  console.log('Contact form will work but emails won\'t be sent');
});

// Define Mongoose schema
const credentialSchema = new mongoose.Schema({
  user: String,
  pass: String
});

const Credential = mongoose.model("Credential", credentialSchema, "BulkMail");

// Contact form schema
const contactSchema = new mongoose.Schema({
  name: String,
  message: String,
  timestamp: { type: Date, default: Date.now }
});

const Contact = mongoose.model("Contact", contactSchema, "ContactMessages");

// Blog schema
const blogSchema = new mongoose.Schema({
  title: String,
  content: String,
  category: String,
  tags: [String],
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  published: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Blog = mongoose.model("Blog", blogSchema, "Blogs");

// Root endpoint for Railway health checks
app.get('/', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Portfolio Backend API is running',
    timestamp: new Date().toISOString(),
    port: process.env.PORT || 5000,
    endpoints: ['/health', '/test', '/contact', '/sendmail', '/blogs']
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Backend server is running',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// Test endpoint
app.get('/test', (req, res) => {
  res.json({ 
    message: 'Backend is working!',
    cors: 'CORS is configured',
    endpoints: ['/health', '/test', '/contact', '/sendmail', '/blogs', '/admin/login']
  });
});

// Admin authentication endpoint
app.post('/admin/login', (req, res) => {
  const { username, password } = req.body;
  
  // Simple admin credentials (you can change these)
  const ADMIN_USERNAME = 'admin';
  const ADMIN_PASSWORD = 'portfolio2024';
  
  console.log(`🔐 Admin login attempt: ${username}`);
  
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    console.log('✅ Admin login successful');
    res.json({
      success: true,
      message: 'Admin login successful',
      isAdmin: true
    });
  } else {
    console.log('❌ Admin login failed - invalid credentials');
    res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }
});

// Admin Dashboard Endpoints

// Projects endpoints
app.post('/projects', async (req, res) => {
  try {
    const { title, description, technologies, githubUrl, liveUrl, image } = req.body;
    
    console.log('💼 Adding new project:', title);
    
    // For now, just log the project data
    // In a real app, you'd save to database
    const projectData = {
      title,
      description,
      technologies,
      githubUrl,
      liveUrl,
      image,
      createdAt: new Date()
    };
    
    console.log('📊 Project data:', projectData);
    
    res.json({
      success: true,
      message: 'Project added successfully',
      project: projectData
    });
  } catch (error) {
    console.error('❌ Error adding project:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add project'
    });
  }
});

// Work Experience endpoints
app.post('/experiences', async (req, res) => {
  try {
    const { title, company, duration, description, skills } = req.body;
    
    console.log('👨‍💻 Adding new experience:', title, 'at', company);
    
    const experienceData = {
      title,
      company,
      duration,
      description,
      skills,
      createdAt: new Date()
    };
    
    console.log('📊 Experience data:', experienceData);
    
    res.json({
      success: true,
      message: 'Work experience added successfully',
      experience: experienceData
    });
  } catch (error) {
    console.error('❌ Error adding experience:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add experience'
    });
  }
});

// Technical Skills endpoints
app.post('/skills', async (req, res) => {
  try {
    const { category, skills } = req.body;
    
    console.log('⚡ Adding new skill category:', category);
    
    const skillData = {
      category,
      skills,
      createdAt: new Date()
    };
    
    console.log('📊 Skill data:', skillData);
    
    res.json({
      success: true,
      message: 'Technical skill added successfully',
      skill: skillData
    });
  } catch (error) {
    console.error('❌ Error adding skill:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add skill'
    });
  }
});

// Certifications endpoints
app.post('/certifications', async (req, res) => {
  try {
    const { title, issuer, date, credentialUrl, description } = req.body;
    
    console.log('🏆 Adding new certification:', title, 'from', issuer);
    
    const certificationData = {
      title,
      issuer,
      date,
      credentialUrl,
      description,
      createdAt: new Date()
    };
    
    console.log('📊 Certification data:', certificationData);
    
    res.json({
      success: true,
      message: 'Certification added successfully',
      certification: certificationData
    });
  } catch (error) {
    console.error('❌ Error adding certification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add certification'
    });
  }
});

// Blog endpoints

// Get all blogs
app.get('/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find({ published: true })
      .sort({ createdAt: -1 })
      .limit(10);
    
    console.log(`📚 Retrieved ${blogs.length} blogs`);
    res.json({
      success: true,
      blogs: blogs
    });
  } catch (error) {
    console.error('❌ Error fetching blogs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch blogs'
    });
  }
});

// Get single blog by ID
app.get('/blogs/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    // Increment views
    blog.views += 1;
    await blog.save();

    console.log(`📖 Blog viewed: ${blog.title}`);
    res.json({
      success: true,
      blog: blog
    });
  } catch (error) {
    console.error('❌ Error fetching blog:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch blog'
    });
  }
});

// Create new blog
app.post('/blogs', async (req, res) => {
  const { title, content, category, tags } = req.body;

  if (!title || !content) {
    return res.status(400).json({
      success: false,
      message: 'Title and content are required'
    });
  }

  try {
    const newBlog = new Blog({
      title,
      content,
      category: category || 'General',
      tags: tags || []
    });

    await newBlog.save();
    console.log(`📝 New blog created: ${title}`);
    
    res.json({
      success: true,
      message: 'Blog created successfully!',
      blog: newBlog
    });
  } catch (error) {
    console.error('❌ Error creating blog:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create blog'
    });
  }
});

// Update blog
app.put('/blogs/:id', async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;
    
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      {
        title,
        content,
        category,
        tags,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!updatedBlog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    console.log(`✏️ Blog updated: ${updatedBlog.title}`);
    res.json({
      success: true,
      message: 'Blog updated successfully!',
      blog: updatedBlog
    });
  } catch (error) {
    console.error('❌ Error updating blog:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update blog'
    });
  }
});

// Delete blog
app.delete('/blogs/:id', async (req, res) => {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
    
    if (!deletedBlog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    console.log(`🗑️ Blog deleted: ${deletedBlog.title}`);
    res.json({
      success: true,
      message: 'Blog deleted successfully!'
    });
  } catch (error) {
    console.error('❌ Error deleting blog:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete blog'
    });
  }
});

// Like blog
app.post('/blogs/:id/like', async (req, res) => {
  try {
    console.log(`💖 Like request received for blog ID: ${req.params.id}`);
    
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      console.log(`❌ Blog not found with ID: ${req.params.id}`);
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    const previousLikes = blog.likes || 0;
    blog.likes = previousLikes + 1;
    await blog.save();

    console.log(`❤️ Blog liked: "${blog.title}" (${previousLikes} → ${blog.likes} likes)`);
    
    res.json({
      success: true,
      likes: blog.likes,
      message: 'Blog liked successfully'
    });
  } catch (error) {
    console.error('❌ Error liking blog:', error);
    console.error('Error details:', error.message);
    
    res.status(500).json({
      success: false,
      message: 'Failed to like blog: ' + error.message
    });
  }
});

// Send mail endpoint (original bulk mail)
app.post("/sendmail", async (req, res) => {
  const { message, recipients } = req.body;

  if (!recipients || recipients.length === 0) {
    return res.json(false);
  }

  try {
    const data = await Credential.find();
    if (!data || data.length === 0) {
      return res.json(false);
    }

    const transporter = nodemailer.createTransporter({
      service: "gmail",
      auth: {
        user: data[0].user,
        pass: data[0].pass, // Gmail app password
      },
    });

    // Send emails one by one
    for (let i = 0; i < recipients.length; i++) {
      await transporter.sendMail({
        from: data[0].user,
        to: recipients[i],
        subject: "Message from Bulk Mail",
        text: message,
      });
    }

    console.log("All mails sent successfully ✅");
    res.json(true);

  } catch (error) {
    console.error("Error sending mail:", error);
    res.json(false);
  }
});

// Contact form endpoint
app.post("/contact", async (req, res) => {
  const { name, message } = req.body;

  console.log('📧 Contact form submission received:', { name, message: message.substring(0, 50) + '...' });

  if (!name || !message) {
    return res.status(400).json({ 
      success: false, 
      message: "Name and message are required" 
    });
  }

  try {
    // Try to save to database if connected
    if (mongoose.connection.readyState === 1) {
      const contactMessage = new Contact({
        name,
        message
      });
      await contactMessage.save();
      console.log('💾 Message saved to database');
    } else {
      console.log('⚠️  Database not connected, skipping save');
    }

    // Get email credentials from database
    const data = await Credential.find();
    if (!data || data.length === 0) {
      console.log('⚠️  Email credentials not found in database');
      return res.status(500).json({ 
        success: false, 
        message: "Email configuration not available" 
      });
    }

    // Create email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: data[0].user, // This should be kiboxsonleena51@gmail.com
        pass: data[0].pass, // Gmail app password
      },
    });

    // Send email to your receiving address
    await transporter.sendMail({
      from: data[0].user, // From: kiboxsonleena51@gmail.com
      to: "kiboxsonleena2004@gmail.com", // To: your receiving email
      subject: `New Contact Form Message from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #8b5cf6; text-align: center;">New Contact Form Submission</h2>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong style="color: #333;">Name:</strong> ${name}</p>
            <p><strong style="color: #333;">Timestamp:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          <div style="background-color: #fff; padding: 15px; border-left: 4px solid #8b5cf6; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Message:</h3>
            <p style="color: #555; line-height: 1.6;">${message}</p>
          </div>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="text-align: center; color: #888; font-size: 12px;">
            <em>Sent from your portfolio contact form</em>
          </p>
        </div>
      `
    });

    console.log(`📧 Email sent successfully to kiboxsonleena2004@gmail.com from ${name}`);
    res.json({ 
      success: true, 
      message: "Message sent successfully!" 
    });

  } catch (error) {
    console.error("❌ Error processing contact form:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to send message. Please try again." 
    });
  }
});

const PORT = process.env.PORT || 5000;

// Start the server (Railway, local development, or other hosting)
// Only skip if explicitly in a serverless environment like Netlify
if (!process.env.NETLIFY && !process.env.AWS_LAMBDA_FUNCTION_NAME) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📧 Contact endpoint: /contact`);
    console.log(`📮 Bulk mail endpoint: /sendmail`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

// Export the app for serverless deployment
module.exports = app;