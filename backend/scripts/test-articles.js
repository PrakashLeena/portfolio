const mongoose = require('mongoose');

// Connect to Atlas
const connectDB = async () => {
  const atlasUri = 'mongodb+srv://kiboxsonleena:20040620Kiyu@cluster0.cr1byep.mongodb.net/passkey?retryWrites=true&w=majority&appName=Cluster0';
  
  try {
    console.log('🔄 Connecting to MongoDB Atlas...');
    await mongoose.connect(atlasUri);
    console.log('✅ Connected to Atlas');
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    process.exit(1);
  }
};

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

// Sample articles
const sampleArticles = [
  {
    title: "Building Scalable React Applications",
    content: `# Building Scalable React Applications

React has become one of the most popular frontend frameworks, but building scalable applications requires careful planning and best practices.

## Key Principles

### 1. Component Architecture
- Keep components small and focused
- Use composition over inheritance
- Implement proper prop drilling solutions

### 2. State Management
- Choose the right state management solution
- Consider Redux for complex applications
- Use React Context for simpler state sharing

### 3. Performance Optimization
- Implement React.memo for expensive components
- Use useMemo and useCallback hooks wisely
- Lazy load components with React.Suspense

## Code Example

\`\`\`jsx
import React, { memo, useMemo } from 'react';

const ExpensiveComponent = memo(({ data, filter }) => {
  const filteredData = useMemo(() => {
    return data.filter(item => item.category === filter);
  }, [data, filter]);

  return (
    <div>
      {filteredData.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
});
\`\`\`

## Conclusion

Building scalable React applications is about making smart architectural decisions early and following established patterns that promote maintainability and performance.`,
    category: "React",
    tags: ["React", "JavaScript", "Performance", "Architecture"],
    views: 45,
    likes: 8
  },
  {
    title: "MongoDB Atlas vs Local Development",
    content: `# MongoDB Atlas vs Local Development

Choosing between MongoDB Atlas and local development setup is a crucial decision that affects your development workflow.

## MongoDB Atlas Advantages

### Cloud Benefits
- No local setup required
- Automatic backups and scaling
- Built-in security features
- Global cluster deployment

### Developer Experience
- Easy connection from anywhere
- Collaborative development
- Production-like environment

## Local MongoDB Benefits

### Development Speed
- Faster queries (no network latency)
- Offline development capability
- Full control over configuration

### Cost Considerations
- No usage-based pricing
- Unlimited local testing
- No bandwidth costs

## Best Practices

### For Development
1. Use local MongoDB for rapid prototyping
2. Switch to Atlas for team collaboration
3. Mirror production environment structure

### For Production
- Always use MongoDB Atlas or managed service
- Implement proper backup strategies
- Monitor performance metrics

## Connection Examples

### Local Connection
\`\`\`javascript
const localUri = 'mongodb://localhost:27017/myapp';
await mongoose.connect(localUri);
\`\`\`

### Atlas Connection
\`\`\`javascript
const atlasUri = 'mongodb+srv://user:pass@cluster.mongodb.net/myapp';
await mongoose.connect(atlasUri);
\`\`\`

Choose based on your specific needs and development stage.`,
    category: "MongoDB",
    tags: ["MongoDB", "Database", "Cloud", "Development"],
    views: 32,
    likes: 5
  },
  {
    title: "Email Integration with Nodemailer",
    content: `# Email Integration with Nodemailer

Implementing email functionality in Node.js applications is essential for user communication and notifications.

## Getting Started

### Installation
\`\`\`bash
npm install nodemailer
\`\`\`

### Basic Setup
\`\`\`javascript
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-app-password'
  }
});
\`\`\`

## Gmail App Password Setup

1. Enable 2-Step Verification in Google Account
2. Go to Security → App passwords
3. Generate password for "Mail"
4. Use this password in your application

## Sending Emails

### Basic Email
\`\`\`javascript
const mailOptions = {
  from: 'sender@gmail.com',
  to: 'recipient@gmail.com',
  subject: 'Hello from Node.js',
  text: 'This is a plain text email',
  html: '<h1>This is HTML email</h1>'
};

await transporter.sendMail(mailOptions);
\`\`\`

### HTML Templates
\`\`\`javascript
const htmlTemplate = \`
  <div style="font-family: Arial, sans-serif;">
    <h2 style="color: #8b5cf6;">Welcome!</h2>
    <p>Thank you for joining our platform.</p>
  </div>
\`;
\`\`\`

## Error Handling

Always implement proper error handling:

\`\`\`javascript
try {
  await transporter.sendMail(mailOptions);
  console.log('Email sent successfully');
} catch (error) {
  console.error('Email failed:', error);
}
\`\`\`

## Security Best Practices

- Never hardcode credentials
- Use environment variables
- Implement rate limiting
- Validate email addresses
- Use HTTPS for sensitive data

Email integration enhances user experience significantly when implemented correctly.`,
    category: "Node.js",
    tags: ["Node.js", "Email", "Nodemailer", "Backend"],
    views: 67,
    likes: 12
  }
];

const setupArticles = async () => {
  try {
    await connectDB();
    
    // Clear existing articles
    await Blog.deleteMany({});
    console.log('🗑️ Cleared existing articles');
    
    // Add sample articles
    for (const article of sampleArticles) {
      const newArticle = new Blog(article);
      await newArticle.save();
      console.log(`📝 Added article: ${article.title}`);
    }
    
    console.log('✅ Sample articles added to Atlas database!');
    console.log(`📊 Total articles: ${sampleArticles.length}`);
    
    // Test fetching
    const articles = await Blog.find().sort({ createdAt: -1 });
    console.log('\n📚 Articles in database:');
    articles.forEach((article, index) => {
      console.log(`${index + 1}. ${article.title} (${article.category}) - Views: ${article.views}, Likes: ${article.likes}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    mongoose.connection.close();
  }
};

setupArticles();
