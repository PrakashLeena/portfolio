const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const connectDB = require("./config/database");
require('dotenv').config();

const app = express();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('📁 Created uploads directory');
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // Create unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'project-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    // Accept images only
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Configure multer for PDF resume uploads
const resumeStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // Create unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'resume-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const uploadResume = multer({
  storage: resumeStorage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit for PDFs
  },
  fileFilter: function (req, file, cb) {
    // Accept PDF files only
    const allowedTypes = /pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = file.mimetype === 'application/pdf';
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed for resume!'));
    }
  }
});

// Middleware
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      return callback(null, true);
    }
    
    const allowedOrigins = [
      'http://localhost:3000', 
      'http://127.0.0.1:3000', 
      'http://localhost:3001',
      /\.vercel\.app$/, // Allow all Vercel deployments
      /\.netlify\.app$/, // Allow Netlify deployments
      /\.railway\.app$/, // Allow Railway deployments
      /\.up\.railway\.app$/, // Allow Railway custom domains
      /^https?:\/\/localhost(:\d+)?$/, // Allow any localhost port
      // Add specific Vercel domains
      'https://portfolio-git-main-prakashleenas-projects.vercel.app',
      'https://newportfolio-prakashleenas-projects.vercel.app',
      'https://newportfolio-git-main-prakashleenas-projects.vercel.app',
      'https://newportfolio-prakashleenas-projects.vercel.app',
      // Allow any subdomain of prakashleenas-projects.vercel.app
      /https:\/\/.*-prakashleenas-projects\.vercel\.app$/,
      // Allow any vercel.app domain (temporary for debugging)
      /^https:\/\/.*\.vercel\.app$/,
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

// Serve uploaded files statically
app.use('/uploads', express.static(uploadsDir));
console.log('📂 Serving uploads from:', uploadsDir);

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

// Portfolio likes schema
const portfolioLikesSchema = new mongoose.Schema({
  totalLikes: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now }
});

const PortfolioLikes = mongoose.model("PortfolioLikes", portfolioLikesSchema, "PortfolioLikes");

// Project schema
const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  technologies: String,
  githubUrl: String,
  liveUrl: String,
  image: String,
  createdAt: { type: Date, default: Date.now }
});

const Project = mongoose.model("Project", projectSchema, "Projects");

// Work Experience schema
const experienceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  duration: String,
  description: String,
  skills: String,
  createdAt: { type: Date, default: Date.now }
});

const Experience = mongoose.model("Experience", experienceSchema, "Experiences");

// Technical Skills schema
const skillSchema = new mongoose.Schema({
  category: { type: String, required: true },
  skills: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Skill = mongoose.model("Skill", skillSchema, "Skills");

// Certification schema
const certificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  issuer: { type: String, required: true },
  date: String,
  credentialUrl: String,
  description: String,
  image: String,
  createdAt: { type: Date, default: Date.now }
});

const Certification = mongoose.model("Certification", certificationSchema, "Certifications");

// Resume schema
const resumeSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  fileUrl: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
});

const Resume = mongoose.model("Resume", resumeSchema, "Resumes");

// Profile Photo schema
const profilePhotoSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
});

const ProfilePhoto = mongoose.model("ProfilePhoto", profilePhotoSchema, "ProfilePhotos");

// Root endpoint for Railway health checks
app.get('/', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Portfolio Backend API is running',
    timestamp: new Date().toISOString(),
    port: process.env.PORT || 5000,
    endpoints: ['/health', '/test', '/contact', '/sendmail', '/blogs', '/portfolio/likes']
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
  const ADMIN_USERNAME = 'kibo';
  const ADMIN_PASSWORD = '123456';
  
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

// File upload endpoint
app.post('/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Return the file path that can be used to access the image
    const fileUrl = `/uploads/${req.file.filename}`;
    
    console.log('📸 Image uploaded successfully:', req.file.filename);
    
    res.json({
      success: true,
      message: 'File uploaded successfully',
      fileUrl: fileUrl,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('❌ Error uploading file:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading file',
      error: error.message
    });
  }
});

// Resume file upload endpoint
app.post('/upload-resume', uploadResume.single('resume'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No resume file uploaded'
      });
    }

    // Return the file path that can be used to access the resume
    const fileUrl = `/uploads/${req.file.filename}`;
    
    console.log('📄 Resume uploaded successfully:', req.file.filename);
    
    res.json({
      success: true,
      message: 'Resume uploaded successfully',
      fileUrl: fileUrl,
      filename: req.file.filename,
      originalName: req.file.originalname
    });
  } catch (error) {
    console.error('❌ Error uploading resume:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload resume',
      error: error.message
    });
  }
});

// Admin Dashboard Endpoints

// Projects endpoints
// GET all projects
app.get('/projects', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    
    res.json({
      success: true,
      projects: projects
    });
  } catch (error) {
    console.error('❌ Error fetching projects:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch projects',
      error: error.message
    });
  }
});

// POST new project
app.post('/projects', async (req, res) => {
  try {
    const { title, description, technologies, githubUrl, liveUrl, image } = req.body;
    
    console.log('💼 Adding new project:', title);
    
    // Create new project in database
    const newProject = new Project({
      title,
      description,
      technologies,
      githubUrl,
      liveUrl,
      image
    });
    
    await newProject.save();
    console.log('✅ Project saved to database:', newProject._id);
    
    res.json({
      success: true,
      message: 'Project added successfully',
      project: newProject
    });
  } catch (error) {
    console.error('❌ Error adding project:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add project',
      error: error.message
    });
  }
});

// DELETE project
app.delete('/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('🗑️ Deleting project:', id);
    
    const deletedProject = await Project.findByIdAndDelete(id);
    
    if (!deletedProject) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    // Delete associated image file if it exists
    if (deletedProject.image && deletedProject.image.startsWith('/uploads/')) {
      const imagePath = path.join(__dirname, deletedProject.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
        console.log('🗑️ Deleted image file:', imagePath);
      }
    }
    
    console.log('✅ Project deleted successfully:', id);
    
    res.json({
      success: true,
      message: 'Project deleted successfully',
      project: deletedProject
    });
  } catch (error) {
    console.error('❌ Error deleting project:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete project',
      error: error.message
    });
  }
});

// Work Experience endpoints
// GET all experiences
app.get('/experiences', async (req, res) => {
  try {
    const experiences = await Experience.find().sort({ createdAt: -1 });
    
    res.json({
      success: true,
      experiences: experiences
    });
  } catch (error) {
    console.error('❌ Error fetching experiences:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch experiences',
      error: error.message
    });
  }
});

// POST new experience
app.post('/experiences', async (req, res) => {
  try {
    const { title, company, duration, description, skills } = req.body;
    
    console.log('👨‍💻 Adding new experience:', title, 'at', company);
    
    const newExperience = new Experience({
      title,
      company,
      duration,
      description,
      skills
    });
    
    await newExperience.save();
    console.log('✅ Experience saved to database:', newExperience._id);
    
    res.json({
      success: true,
      message: 'Work experience added successfully',
      experience: newExperience
    });
  } catch (error) {
    console.error('❌ Error adding experience:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add experience',
      error: error.message
    });
  }
});

// PUT (update) experience
app.put('/experiences/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, company, duration, description, skills } = req.body;
    
    console.log('✏️ Updating experience:', id);
    
    const updatedExperience = await Experience.findByIdAndUpdate(
      id,
      { title, company, duration, description, skills },
      { new: true, runValidators: true }
    );
    
    if (!updatedExperience) {
      return res.status(404).json({
        success: false,
        message: 'Experience not found'
      });
    }
    
    console.log('✅ Experience updated successfully:', id);
    
    res.json({
      success: true,
      message: 'Experience updated successfully',
      experience: updatedExperience
    });
  } catch (error) {
    console.error('❌ Error updating experience:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update experience',
      error: error.message
    });
  }
});

// DELETE experience
app.delete('/experiences/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('🗑️ Deleting experience:', id);
    
    const deletedExperience = await Experience.findByIdAndDelete(id);
    
    if (!deletedExperience) {
      return res.status(404).json({
        success: false,
        message: 'Experience not found'
      });
    }
    
    console.log('✅ Experience deleted successfully:', id);
    
    res.json({
      success: true,
      message: 'Experience deleted successfully',
      experience: deletedExperience
    });
  } catch (error) {
    console.error('❌ Error deleting experience:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete experience',
      error: error.message
    });
  }
});

// Technical Skills endpoints
// GET all skills
app.get('/skills', async (req, res) => {
  try {
    const skills = await Skill.find().sort({ createdAt: -1 });
    
    res.json({
      success: true,
      skills: skills
    });
  } catch (error) {
    console.error('❌ Error fetching skills:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch skills',
      error: error.message
    });
  }
});

// POST new skill
app.post('/skills', async (req, res) => {
  try {
    const { category, skills } = req.body;
    
    console.log('⚡ Adding new skill category:', category);
    
    const newSkill = new Skill({
      category,
      skills
    });
    
    await newSkill.save();
    console.log('✅ Skill saved to database:', newSkill._id);
    
    res.json({
      success: true,
      message: 'Technical skill added successfully',
      skill: newSkill
    });
  } catch (error) {
    console.error('❌ Error adding skill:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add skill',
      error: error.message
    });
  }
});

// PUT (update) skill
app.put('/skills/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { category, skills } = req.body;
    
    console.log('✏️ Updating skill:', id);
    
    const updatedSkill = await Skill.findByIdAndUpdate(
      id,
      { category, skills },
      { new: true, runValidators: true }
    );
    
    if (!updatedSkill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }
    
    console.log('✅ Skill updated successfully:', id);
    
    res.json({
      success: true,
      message: 'Skill updated successfully',
      skill: updatedSkill
    });
  } catch (error) {
    console.error('❌ Error updating skill:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update skill',
      error: error.message
    });
  }
});

// DELETE skill
app.delete('/skills/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('🗑️ Deleting skill:', id);
    
    const deletedSkill = await Skill.findByIdAndDelete(id);
    
    if (!deletedSkill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }
    
    console.log('✅ Skill deleted successfully:', id);
    
    res.json({
      success: true,
      message: 'Skill deleted successfully',
      skill: deletedSkill
    });
  } catch (error) {
    console.error('❌ Error deleting skill:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete skill',
      error: error.message
    });
  }
});

// Certifications endpoints
// GET all certifications
app.get('/certifications', async (req, res) => {
  try {
    const certifications = await Certification.find().sort({ createdAt: -1 });
    
    res.json({
      success: true,
      certifications: certifications
    });
  } catch (error) {
    console.error('❌ Error fetching certifications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch certifications',
      error: error.message
    });
  }
});

// POST new certification
app.post('/certifications', async (req, res) => {
  try {
    const { title, issuer, date, credentialUrl, description, image } = req.body;
    
    console.log('🏆 Adding new certification:', title, 'from', issuer);
    
    const newCertification = new Certification({
      title,
      issuer,
      date,
      credentialUrl,
      description,
      image
    });
    
    await newCertification.save();
    console.log('✅ Certification saved to database:', newCertification._id);
    
    res.json({
      success: true,
      message: 'Certification added successfully',
      certification: newCertification
    });
  } catch (error) {
    console.error('❌ Error adding certification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add certification',
      error: error.message
    });
  }
});

// PUT (update) certification
app.put('/certifications/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, issuer, date, credentialUrl, description, image } = req.body;
    
    console.log('✏️ Updating certification:', id);
    
    const updatedCertification = await Certification.findByIdAndUpdate(
      id,
      { title, issuer, date, credentialUrl, description, image },
      { new: true, runValidators: true }
    );
    
    if (!updatedCertification) {
      return res.status(404).json({
        success: false,
        message: 'Certification not found'
      });
    }
    
    console.log('✅ Certification updated successfully:', id);
    
    res.json({
      success: true,
      message: 'Certification updated successfully',
      certification: updatedCertification
    });
  } catch (error) {
    console.error('❌ Error updating certification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update certification',
      error: error.message
    });
  }
});

// DELETE certification
app.delete('/certifications/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('🗑️ Deleting certification:', id);
    
    const deletedCertification = await Certification.findByIdAndDelete(id);
    
    if (!deletedCertification) {
      return res.status(404).json({
        success: false,
        message: 'Certification not found'
      });
    }
    
    // Delete associated image file if it exists
    if (deletedCertification.image && deletedCertification.image.startsWith('/uploads/')) {
      const imagePath = path.join(__dirname, deletedCertification.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
        console.log('🗑️ Deleted image file:', imagePath);
      }
    }
    
    console.log('✅ Certification deleted successfully:', id);
    
    res.json({
      success: true,
      message: 'Certification deleted successfully',
      certification: deletedCertification
    });
  } catch (error) {
    console.error('❌ Error deleting certification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete certification',
      error: error.message
    });
  }
});

// Resume endpoints
// Upload resume (using existing upload endpoint, then save metadata)
app.post('/resume', async (req, res) => {
  try {
    const { fileName, fileUrl } = req.body;
    
    if (!fileName || !fileUrl) {
      return res.status(400).json({
        success: false,
        message: 'fileName and fileUrl are required'
      });
    }
    
    console.log('📄 Uploading resume:', fileName);
    
    // Deactivate all previous resumes
    await Resume.updateMany({}, { isActive: false });
    
    // Create new resume entry
    const newResume = new Resume({
      fileName,
      fileUrl,
      isActive: true
    });
    
    await newResume.save();
    console.log('✅ Resume saved to database:', newResume._id);
    
    res.json({
      success: true,
      message: 'Resume uploaded successfully',
      resume: newResume
    });
  } catch (error) {
    console.error('❌ Error uploading resume:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload resume',
      error: error.message
    });
  }
});

// Get active resume
app.get('/resume', async (req, res) => {
  try {
    const resume = await Resume.findOne({ isActive: true }).sort({ uploadedAt: -1 });
    
    if (!resume) {
      return res.json({
        success: true,
        resume: null
      });
    }
    
    console.log('✅ Active resume found:', resume.fileName);
    
    res.json({
      success: true,
      resume: resume
    });
  } catch (error) {
    console.error('❌ Error fetching resume:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch resume',
      error: error.message
    });
  }
});

// Delete resume
app.delete('/resume/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('🗑️ Deleting resume:', id);
    
    const deletedResume = await Resume.findByIdAndDelete(id);
    
    if (!deletedResume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }
    
    // Delete associated file if it exists
    if (deletedResume.fileUrl && deletedResume.fileUrl.startsWith('/uploads/')) {
      const filePath = path.join(__dirname, deletedResume.fileUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log('🗑️ Deleted resume file:', filePath);
      }
    }
    
    console.log('✅ Resume deleted successfully:', id);
    
    res.json({
      success: true,
      message: 'Resume deleted successfully',
      resume: deletedResume
    });
  } catch (error) {
    console.error('❌ Error deleting resume:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete resume',
      error: error.message
    });
  }
});

// Profile Photo endpoints
// Upload profile photo
app.post('/profile-photo', async (req, res) => {
  try {
    const { imageUrl } = req.body;
    
    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: 'imageUrl is required'
      });
    }
    
    console.log('📸 Uploading profile photo:', imageUrl);
    
    // Deactivate all previous profile photos
    await ProfilePhoto.updateMany({}, { isActive: false });
    
    // Create new profile photo entry
    const newProfilePhoto = new ProfilePhoto({
      imageUrl,
      isActive: true
    });
    
    await newProfilePhoto.save();
    console.log('✅ Profile photo saved to database:', newProfilePhoto._id);
    
    res.json({
      success: true,
      message: 'Profile photo uploaded successfully',
      profilePhoto: newProfilePhoto
    });
  } catch (error) {
    console.error('❌ Error uploading profile photo:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload profile photo',
      error: error.message
    });
  }
});

// Get active profile photo
app.get('/profile-photo', async (req, res) => {
  try {
    const profilePhoto = await ProfilePhoto.findOne({ isActive: true }).sort({ uploadedAt: -1 });
    
    if (!profilePhoto) {
      return res.json({
        success: true,
        profilePhoto: null
      });
    }
    
    console.log('✅ Active profile photo found');
    
    res.json({
      success: true,
      profilePhoto: profilePhoto
    });
  } catch (error) {
    console.error('❌ Error fetching profile photo:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile photo',
      error: error.message
    });
  }
});

// Delete profile photo
app.delete('/profile-photo/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('🗑️ Deleting profile photo:', id);
    
    const deletedPhoto = await ProfilePhoto.findByIdAndDelete(id);
    
    if (!deletedPhoto) {
      return res.status(404).json({
        success: false,
        message: 'Profile photo not found'
      });
    }
    
    // Delete associated image file if it exists
    if (deletedPhoto.imageUrl && deletedPhoto.imageUrl.startsWith('/uploads/')) {
      const imagePath = path.join(__dirname, deletedPhoto.imageUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
        console.log('🗑️ Deleted image file:', imagePath);
      }
    }
    
    console.log('✅ Profile photo deleted successfully:', id);
    
    res.json({
      success: true,
      message: 'Profile photo deleted successfully',
      profilePhoto: deletedPhoto
    });
  } catch (error) {
    console.error('❌ Error deleting profile photo:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete profile photo',
      error: error.message
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

// Portfolio likes endpoints

// Get portfolio likes
app.get('/portfolio/likes', async (req, res) => {
  try {
    console.log('💖 Getting portfolio likes...');
    
    let portfolioLikes = await PortfolioLikes.findOne();
    
    // If no likes document exists, create one
    if (!portfolioLikes) {
      portfolioLikes = new PortfolioLikes({ totalLikes: 0 });
      await portfolioLikes.save();
      console.log('📊 Created new portfolio likes document');
    }
    
    console.log(`❤️ Current portfolio likes: ${portfolioLikes.totalLikes}`);
    
    res.json({
      success: true,
      likes: portfolioLikes.totalLikes
    });
  } catch (error) {
    console.error('❌ Error fetching portfolio likes:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch portfolio likes'
    });
  }
});

// Like portfolio
app.post('/portfolio/like', async (req, res) => {
  try {
    console.log('💖 Portfolio like request received');
    
    let portfolioLikes = await PortfolioLikes.findOne();
    
    // If no likes document exists, create one
    if (!portfolioLikes) {
      portfolioLikes = new PortfolioLikes({ totalLikes: 1 });
      await portfolioLikes.save();
      console.log('📊 Created new portfolio likes document with 1 like');
    } else {
      const previousLikes = portfolioLikes.totalLikes;
      portfolioLikes.totalLikes += 1;
      portfolioLikes.lastUpdated = new Date();
      await portfolioLikes.save();
      console.log(`❤️ Portfolio liked: ${previousLikes} → ${portfolioLikes.totalLikes} likes`);
    }
    
    res.json({
      success: true,
      likes: portfolioLikes.totalLikes,
      message: 'Portfolio liked successfully'
    });
  } catch (error) {
    console.error('❌ Error liking portfolio:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to like portfolio'
    });
  }
});

// Unlike portfolio
app.post('/portfolio/unlike', async (req, res) => {
  try {
    console.log('💔 Portfolio unlike request received');
    
    let portfolioLikes = await PortfolioLikes.findOne();
    
    if (!portfolioLikes) {
      return res.status(404).json({
        success: false,
        message: 'No likes found'
      });
    }
    
    if (portfolioLikes.totalLikes > 0) {
      const previousLikes = portfolioLikes.totalLikes;
      portfolioLikes.totalLikes -= 1;
      portfolioLikes.lastUpdated = new Date();
      await portfolioLikes.save();
      console.log(`💔 Portfolio unliked: ${previousLikes} → ${portfolioLikes.totalLikes} likes`);
    }
    
    res.json({
      success: true,
      likes: portfolioLikes.totalLikes,
      message: 'Portfolio unliked successfully'
    });
  } catch (error) {
    console.error('❌ Error unliking portfolio:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to unlike portfolio'
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

    const transporter = nodemailer.createTransport({
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

    // Get email credentials from database or environment variables
    let emailUser, emailPass;
    
    try {
      const data = await Credential.find();
      if (data && data.length > 0) {
        emailUser = data[0].user;
        emailPass = data[0].pass;
        console.log('📧 Using email credentials from database');
      } else {
        // Fallback to environment variables
        emailUser = process.env.EMAIL_USER || 'kiboxsonleena51@gmail.com';
        emailPass = process.env.EMAIL_PASS;
        console.log('📧 Using email credentials from environment variables');
        
        if (!emailPass) {
          console.log('⚠️  No email credentials found in database or environment');
          return res.status(500).json({ 
            success: false, 
            message: "Email configuration not available. Please contact admin." 
          });
        }
      }
    } catch (dbError) {
      console.log('⚠️  Database error, using environment variables:', dbError.message);
      emailUser = process.env.EMAIL_USER || 'kiboxsonleena51@gmail.com';
      emailPass = process.env.EMAIL_PASS;
      
      if (!emailPass) {
        console.log('⚠️  No email credentials available');
        return res.status(500).json({ 
          success: false, 
          message: "Email configuration not available. Please contact admin." 
        });
      }
    }

    // Create email transporter with Railway-compatible settings
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: emailUser,
        pass: emailPass,
      },
      tls: {
        rejectUnauthorized: false
      },
      connectionTimeout: 60000, // 60 seconds
      greetingTimeout: 30000,   // 30 seconds
      socketTimeout: 60000      // 60 seconds
    });

    // Send email to your receiving address
    await transporter.sendMail({
      from: emailUser,
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
    
    // If email fails but message was saved to database, still return success
    if (mongoose.connection.readyState === 1) {
      console.log('💾 Message saved to database despite email error');
      res.json({ 
        success: true, 
        message: "Message received! We'll get back to you soon." 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: "Failed to send message. Please try again." 
      });
    }
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