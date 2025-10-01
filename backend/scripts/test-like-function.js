const mongoose = require('mongoose');

// Test the like functionality
const testLikeFunction = async () => {
  const atlasUri = 'mongodb+srv://kiboxsonleena:20040620Kiyu@cluster0.cr1byep.mongodb.net/passkey?retryWrites=true&w=majority&appName=Cluster0';
  
  try {
    console.log('🔄 Connecting to MongoDB Atlas...');
    await mongoose.connect(atlasUri);
    console.log('✅ Connected to Atlas');
    
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
    
    // Find all blogs
    const blogs = await Blog.find();
    console.log(`📚 Found ${blogs.length} blogs in database`);
    
    if (blogs.length > 0) {
      const testBlog = blogs[0];
      console.log(`\n📝 Testing like function on: "${testBlog.title}"`);
      console.log(`Current likes: ${testBlog.likes}`);
      
      // Increment likes
      testBlog.likes += 1;
      await testBlog.save();
      
      console.log(`✅ Like added! New count: ${testBlog.likes}`);
      console.log(`📊 Blog ID: ${testBlog._id}`);
      
      // Test the API endpoint
      console.log('\n🔗 Testing API endpoint...');
      console.log(`URL: http://localhost:5000/blogs/${testBlog._id}/like`);
      console.log('Method: POST');
      console.log('Expected response: { success: true, likes: number }');
      
    } else {
      console.log('❌ No blogs found in database');
      console.log('💡 Run: npm run test-articles to add sample articles');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.message.includes('ENOTFOUND')) {
      console.log('💡 Atlas connection failed - check IP whitelist');
      console.log('🔧 Add 0.0.0.0/0 to Network Access in MongoDB Atlas');
    }
  } finally {
    mongoose.connection.close();
  }
};

// Test API endpoint with fetch
const testAPIEndpoint = async () => {
  try {
    console.log('\n🌐 Testing backend server...');
    
    // Test if server is running
    const healthResponse = await fetch('http://localhost:5000/health');
    if (healthResponse.ok) {
      console.log('✅ Backend server is running');
      
      // Test blogs endpoint
      const blogsResponse = await fetch('http://localhost:5000/blogs');
      const blogsData = await blogsResponse.json();
      
      if (blogsData.success && blogsData.blogs.length > 0) {
        const testBlog = blogsData.blogs[0];
        console.log(`📝 Testing like API on: "${testBlog.title}"`);
        console.log(`Current likes: ${testBlog.likes}`);
        
        // Test like endpoint
        const likeResponse = await fetch(`http://localhost:5000/blogs/${testBlog._id}/like`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        const likeResult = await likeResponse.json();
        console.log('📊 Like API Response:', likeResult);
        
        if (likeResult.success) {
          console.log('✅ Like API is working correctly!');
          console.log(`💖 New like count: ${likeResult.likes}`);
        } else {
          console.log('❌ Like API failed:', likeResult.message);
        }
      } else {
        console.log('❌ No blogs found via API');
      }
    } else {
      console.log('❌ Backend server is not running');
      console.log('💡 Start backend with: npm start');
    }
  } catch (error) {
    console.error('❌ API test failed:', error.message);
    console.log('💡 Make sure backend server is running on port 5000');
  }
};

console.log('🧪 Testing Like Function...');
console.log('========================\n');

// Run database test
testLikeFunction().then(() => {
  // Run API test
  return testAPIEndpoint();
}).catch(console.error);
