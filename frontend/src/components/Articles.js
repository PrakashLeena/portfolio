import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createApiUrl } from '../config/api';

// Custom styles for dark dropdown
const darkSelectStyles = `
  .dark-select {
    background: rgba(255, 255, 255, 0.1) !important;
    color: white !important;
  }
  
  .dark-select option {
    background: #1f2937 !important;
    color: white !important;
  }
  
  .dark-select:focus option {
    background: #374151 !important;
    color: white !important;
  }
  
  .dark-select option:hover {
    background: #4b5563 !important;
    color: white !important;
  }
  
  .dark-select option:checked {
    background: #7c3aed !important;
    color: white !important;
  }
`;

// Inject styles once
if (typeof document !== 'undefined' && !document.getElementById('dark-select-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'dark-select-styles';
  styleSheet.type = 'text/css';
  styleSheet.innerText = darkSelectStyles;
  document.head.appendChild(styleSheet);
}

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [showReadModal, setShowReadModal] = useState(false);
  const [newArticle, setNewArticle] = useState({
    title: '',
    content: '',
    category: 'React',
    tags: []
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  
  // Admin authentication state
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminCredentials, setAdminCredentials] = useState({
    username: '',
    password: ''
  });

  // Sample articles data
  const sampleArticles = [
    {
      id: 1,
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
      date: "Dec 28, 2024",
      views: 124,
      likes: 18,
      published: true,
      readTime: "5 min read"
    },
    {
      id: 2,
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
      date: "Dec 25, 2024",
      views: 89,
      likes: 12,
      published: true,
      readTime: "4 min read"
    },
    {
      id: 3,
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
      date: "Dec 22, 2024",
      views: 156,
      likes: 24,
      published: true,
      readTime: "6 min read"
    }
  ];

  useEffect(() => {
    fetchArticles();
    // Check if admin is already logged in (from localStorage)
    const adminStatus = localStorage.getItem('portfolioAdmin');
    if (adminStatus === 'true') {
      setIsAdmin(true);
    }
  }, []);

  const fetchArticles = async () => {
    try {
      console.log('🔄 Fetching articles from Atlas database...');
      const response = await fetch(createApiUrl('blogs'));
      const data = await response.json();
      
      console.log('📊 API Response:', data);
      
      if (data.success && data.blogs && data.blogs.length > 0) {
        const formattedArticles = data.blogs.map(article => ({
          ...article,
          id: article._id || article.id, // Ensure we have an ID
          date: new Date(article.createdAt).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
          }),
          readTime: `${Math.ceil(article.content.length / 200)} min read`
        }));
        setArticles(formattedArticles);
        console.log(`✅ Loaded ${formattedArticles.length} articles from Atlas`);
      } else {
        console.log('📝 No articles in database, using sample data');
        setArticles(sampleArticles);
      }
    } catch (error) {
      console.error('❌ Error fetching articles:', error);
      console.log('📝 Falling back to sample data');
      setArticles(sampleArticles);
    }
  };

  // Admin authentication functions
  const handleAdminLogin = async () => {
    const { username, password } = adminCredentials;
    
    if (!username || !password) {
      alert('Please enter both username and password.');
      return;
    }

    try {
      console.log('🔐 Attempting admin login...');
      
      const response = await fetch(createApiUrl('admin/login'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();
      
      if (result.success) {
        setIsAdmin(true);
        setShowAdminLogin(false);
        localStorage.setItem('portfolioAdmin', 'true');
        setAdminCredentials({ username: '', password: '' });
        console.log('✅ Admin logged in successfully');
        alert('Welcome, Admin! You can now write articles.');
      } else {
        alert('Invalid credentials. Please try again.');
        console.log('❌ Invalid admin credentials');
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      
      // Fallback to local authentication if backend is not available
      const ADMIN_USERNAME = 'admin';
      const ADMIN_PASSWORD = 'portfolio2024';
      
      if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        setIsAdmin(true);
        setShowAdminLogin(false);
        localStorage.setItem('portfolioAdmin', 'true');
        setAdminCredentials({ username: '', password: '' });
        console.log('✅ Admin logged in successfully (offline mode)');
        alert('Welcome, Admin! You can now write articles. (Offline mode)');
      } else {
        alert('Invalid credentials. Please try again.');
        console.log('❌ Invalid admin credentials');
      }
    }
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('portfolioAdmin');
    console.log('👋 Admin logged out');
    alert('Logged out successfully.');
  };

  const handleWriteNew = () => {
    if (!isAdmin) {
      setShowAdminLogin(true);
      return;
    }
    setShowWriteModal(true);
  };

  const handleSaveArticle = async () => {
    if (!newArticle.title || !newArticle.content) {
      alert('Please fill in title and content');
      return;
    }

    try {
      console.log('📝 Publishing article to Atlas database...');
      console.log('Article data:', newArticle);
      
      const response = await fetch(createApiUrl('blogs'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newArticle.title,
          content: newArticle.content,
          category: newArticle.category,
          tags: newArticle.tags || []
        }),
      });

      const result = await response.json();
      console.log('📊 Publish response:', result);

      if (result.success) {
        console.log('✅ Article published successfully to Atlas');
        await fetchArticles(); // Refresh articles from database
        setNewArticle({ title: '', content: '', category: 'React', tags: [] });
        setShowWriteModal(false);
        alert('Article published successfully to Atlas database!');
      } else {
        console.error('❌ Failed to publish:', result.message);
        alert('Failed to publish article: ' + result.message);
      }
    } catch (error) {
      console.error('❌ Error saving article:', error);
      alert('Failed to publish article. Please check your connection and try again.');
    }
  };

  const handleReadArticle = async (article) => {
    try {
      console.log('📖 Opening article:', article.title);
      
      // Check if this is a real MongoDB article or sample data
      const articleId = article._id || article.id;
      const isSampleArticle = typeof articleId === 'number' || /^\d+$/.test(articleId);
      
      if (isSampleArticle) {
        console.log('📝 Sample article - updating view count locally');
        
        // Update view count locally for sample articles
        setArticles(prevArticles => 
          prevArticles.map(a => 
            (a.id || a._id) === articleId 
              ? { ...a, views: (a.views || 0) + 1 }
              : a
          )
        );
        
        // Update the article object for the modal
        const updatedArticle = {
          ...article,
          views: (article.views || 0) + 1
        };
        
        setSelectedArticle(updatedArticle);
        setShowReadModal(true);
        return;
      }
      
      // For real MongoDB articles, increment view count via API
      if (articleId) {
        console.log('👁 Incrementing view count for MongoDB article:', articleId);
        
        try {
          const response = await fetch(createApiUrl(`blogs/${articleId}`), {
            method: 'GET',
          });
          
          if (response.ok) {
            const data = await response.json();
            console.log('✅ View count updated:', data.blog?.views);
            
            // Update the article with new view count
            setSelectedArticle(data.blog);
            setShowReadModal(true);
            
            // Refresh articles to update view count in the list
            setTimeout(() => fetchArticles(), 500);
            return;
          }
        } catch (apiError) {
          console.log('⚠️ API call failed, showing article anyway:', apiError.message);
        }
      }
      
      // Fallback: just show the article
      setSelectedArticle(article);
      setShowReadModal(true);
      
    } catch (error) {
      console.error('❌ Error viewing article:', error);
      // Still show the article even if view tracking fails
      setSelectedArticle(article);
      setShowReadModal(true);
    }
  };

  const handleLikeArticle = async (articleId) => {
    try {
      console.log('❤️ Liking article:', articleId);
      
      if (!articleId) {
        console.log('⚠️ No article ID provided for like');
        alert('Unable to like article: No article ID found');
        return;
      }

      // Check if this is a sample article (simple numeric ID)
      const isSampleArticle = typeof articleId === 'number' || /^\d+$/.test(articleId);
      
      if (isSampleArticle) {
        console.log('📝 This is a sample article, updating locally only');
        
        // Update sample article likes locally
        setArticles(prevArticles => 
          prevArticles.map(article => 
            (article.id || article._id) === articleId 
              ? { ...article, likes: (article.likes || 0) + 1 }
              : article
          )
        );
        
        // Update selected article if it's open in modal
        if (selectedArticle && (selectedArticle.id || selectedArticle._id) === articleId) {
          setSelectedArticle(prev => ({
            ...prev,
            likes: (prev.likes || 0) + 1
          }));
        }
        
        console.log('💖 Sample article like updated locally!');
        return;
      }

      // For real MongoDB articles, make API call
      console.log('🔄 Sending like request to API...');

      const response = await fetch(createApiUrl(`blogs/${articleId}/like`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('📡 Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('📊 Like response:', result);

      if (result.success) {
        console.log('✅ Article liked successfully, new count:', result.likes);
        
        // Update the specific article in state immediately for better UX
        setArticles(prevArticles => 
          prevArticles.map(article => 
            (article._id || article.id) === articleId 
              ? { ...article, likes: result.likes }
              : article
          )
        );
        
        // Update selected article if it's open in modal
        if (selectedArticle && (selectedArticle._id || selectedArticle.id) === articleId) {
          setSelectedArticle(prev => ({
            ...prev,
            likes: result.likes
          }));
        }
        
        // Also refresh from database to ensure consistency
        setTimeout(() => fetchArticles(), 500);
        
        // Show success feedback
        console.log('💖 Like added successfully!');
      } else {
        console.error('❌ Failed to like article:', result.message);
        alert('Failed to like article: ' + (result.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('❌ Error liking article:', error);
      
      // Check if it's the ObjectId cast error
      if (error.message.includes('Cast to ObjectId failed')) {
        console.log('📝 Treating as sample article due to ObjectId error');
        
        // Update sample article likes locally
        setArticles(prevArticles => 
          prevArticles.map(article => 
            (article.id || article._id) === articleId 
              ? { ...article, likes: (article.likes || 0) + 1 }
              : article
          )
        );
        
        console.log('💖 Sample article like updated locally!');
      } else {
        alert('Failed to like article. Please check your connection and try again.');
      }
    }
  };

  const handleDeleteArticle = async (articleId) => {
    if (!window.confirm('Are you sure you want to delete this article?')) {
      return;
    }

    try {
      console.log('🗑️ Deleting article:', articleId);
      
      // Check if this is a sample article
      const isSampleArticle = typeof articleId === 'number' || /^\d+$/.test(articleId);
      
      if (isSampleArticle) {
        console.log('📝 Deleting sample article locally');
        
        // Remove sample article from local state
        setArticles(prevArticles => 
          prevArticles.filter(article => 
            (article.id || article._id) !== articleId
          )
        );
        
        alert('Sample article removed!');
        return;
      }
      
      // For real MongoDB articles, make API call
      const response = await fetch(createApiUrl(`blogs/${articleId}`), {
        method: 'DELETE',
      });

      const result = await response.json();
      console.log('📊 Delete response:', result);

      if (response.ok && result.success) {
        console.log('✅ Article deleted successfully');
        await fetchArticles(); // Refresh articles list
        alert('Article deleted successfully!');
      } else {
        console.error('❌ Failed to delete article:', result.message);
        alert('Failed to delete article: ' + result.message);
      }
    } catch (error) {
      console.error('❌ Error deleting article:', error);
      
      // Check if it's the ObjectId cast error
      if (error.message.includes('Cast to ObjectId failed')) {
        console.log('📝 Treating as sample article due to ObjectId error');
        
        // Remove sample article from local state
        setArticles(prevArticles => 
          prevArticles.filter(article => 
            (article.id || article._id) !== articleId
          )
        );
        
        alert('Sample article removed!');
      } else {
        alert('Failed to delete article. Please try again.');
      }
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'React': 'text-purple-400 bg-purple-500/20 border-purple-500/30',
      'MongoDB': 'text-green-400 bg-green-500/20 border-green-500/30',
      'Node.js': 'text-blue-400 bg-blue-500/20 border-blue-500/30',
      'JavaScript': 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30',
      'CSS': 'text-pink-400 bg-pink-500/20 border-pink-500/30',
      'General': 'text-gray-400 bg-gray-500/20 border-gray-500/30'
    };
    return colors[category] || colors['General'];
  };

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || article.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', ...new Set(articles.map(article => article.category))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black">
      {/* Header */}
      <header className="py-8 px-4 border-b border-white/10">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between">
            <div>
              <Link to="/" className="text-purple-400 hover:text-purple-300 transition-colors mb-4 inline-block">
                ← Back to Portfolio
              </Link>
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                Articles & Blog
              </h1>
              <p className="text-white/70 text-lg mt-4">
                Thoughts, tutorials, and insights on web development
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {isAdmin && (
                <div className="flex items-center space-x-3">
                  <Link to="/admin" className="text-purple-400 hover:text-purple-300 text-sm flex items-center space-x-1 transition-colors">
                    <span>⚙️</span>
                    <span>Dashboard</span>
                  </Link>
                  <span className="text-green-400 text-sm flex items-center space-x-1">
                    <span>👑</span>
                    <span>Admin</span>
                  </span>
                  <button
                    onClick={handleAdminLogout}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300"
                  >
                    Logout
                  </button>
                </div>
              )}
              <button
                onClick={handleWriteNew}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
              >
                <span>✍️</span>
                <span>{isAdmin ? 'Write Article' : 'Admin Login'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Filters and Search */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setFilterCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filterCategory === category
                      ? 'bg-purple-600 text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article) => (
              <article key={article.id || article._id} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 group cursor-pointer">
                {/* Article Header */}
                <div className="flex items-start justify-between mb-4">
                  <span className={`text-xs px-3 py-1 rounded-full border ${getCategoryColor(article.category)}`}>
                    {article.category}
                  </span>
                  <span className="text-white/50 text-xs">{article.readTime || '3 min read'}</span>
                </div>

                {/* Article Content */}
                <div onClick={() => handleReadArticle(article)}>
                  <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors mb-3">
                    {article.title}
                  </h3>
                  <p className="text-white/70 text-sm line-clamp-3 mb-4">
                    {article.content.replace(/[#*`]/g, '').substring(0, 150)}...
                  </p>
                </div>

                {/* Article Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <span className="text-white/50 text-xs">{article.date}</span>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1 text-white/50 text-xs">
                      <span>👁</span>
                      <span>{article.views}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const articleId = article._id || article.id;
                        if (articleId) {
                          handleLikeArticle(articleId);
                        } else {
                          console.warn('No article ID found for like button');
                          alert('Cannot like this article: No ID found');
                        }
                      }}
                      className="flex items-center space-x-1 text-white/50 hover:text-red-400 hover:scale-110 text-xs transition-all duration-200 active:scale-95"
                      title="Like this article"
                    >
                      <span>❤️</span>
                      <span>{article.likes || 0}</span>
                    </button>
                    {isAdmin && (article._id || article.id) && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteArticle(article._id || article.id);
                        }}
                        className="flex items-center space-x-1 text-white/50 hover:text-red-500 text-xs transition-colors"
                        title="Delete article (Admin only)"
                      >
                        <span>🗑️</span>
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>

          {filteredArticles.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-2xl font-bold text-white mb-2">No articles found</h3>
              <p className="text-white/60">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </section>

      {/* Admin Login Modal */}
      {showAdminLogin && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-white/20 rounded-2xl p-8 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                <span>👑</span>
                <span>Admin Login</span>
              </h2>
              <button 
                onClick={() => setShowAdminLogin(false)}
                className="text-white/60 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-white font-semibold mb-2">Username</label>
                <input
                  type="text"
                  value={adminCredentials.username}
                  onChange={(e) => setAdminCredentials({...adminCredentials, username: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
                  placeholder="Enter admin username"
                  onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Password</label>
                <input
                  type="password"
                  value={adminCredentials.password}
                  onChange={(e) => setAdminCredentials({...adminCredentials, password: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
                  placeholder="Enter admin password"
                  onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
                />
              </div>

              <div className="flex items-center justify-end space-x-4 pt-4">
                <button
                  onClick={() => setShowAdminLogin(false)}
                  className="px-6 py-3 border border-white/20 text-white rounded-lg hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdminLogin}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
                >
                  Login
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Write Article Modal */}
      {showWriteModal && isAdmin && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-white/20 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-white">Write New Article</h2>
              <button 
                onClick={() => setShowWriteModal(false)}
                className="text-white/60 hover:text-white text-3xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-semibold mb-2">Title</label>
                  <input
                    type="text"
                    value={newArticle.title}
                    onChange={(e) => setNewArticle({...newArticle, title: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
                    placeholder="Enter article title..."
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Category</label>
                  <select
                    value={newArticle.category}
                    onChange={(e) => setNewArticle({...newArticle, category: e.target.value})}
                    className="dark-select w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white appearance-none cursor-pointer"
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23a855f7' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: 'right 0.75rem center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '1.25em 1.25em',
                      paddingRight: '2.5rem'
                    }}
                  >
                    <option value="React" style={{ background: '#1f2937', color: 'white' }}>React</option>
                    <option value="Node.js" style={{ background: '#1f2937', color: 'white' }}>Node.js</option>
                    <option value="MongoDB" style={{ background: '#1f2937', color: 'white' }}>MongoDB</option>
                    <option value="JavaScript" style={{ background: '#1f2937', color: 'white' }}>JavaScript</option>
                    <option value="CSS" style={{ background: '#1f2937', color: 'white' }}>CSS</option>
                    <option value="General" style={{ background: '#1f2937', color: 'white' }}>General</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Content (Markdown supported)</label>
                <textarea
                  value={newArticle.content}
                  onChange={(e) => setNewArticle({...newArticle, content: e.target.value})}
                  rows="15"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400 resize-none font-mono text-sm"
                  placeholder="Write your article content here... (Markdown supported)"
                />
              </div>

              <div className="flex items-center justify-end space-x-4">
                <button
                  onClick={() => setShowWriteModal(false)}
                  className="px-6 py-3 border border-white/20 text-white rounded-lg hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveArticle}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
                >
                  Publish Article
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Read Article Modal */}
      {showReadModal && selectedArticle && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-white/20 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-4">
                  <span className={`text-xs px-3 py-1 rounded-full border ${getCategoryColor(selectedArticle.category)}`}>
                    {selectedArticle.category}
                  </span>
                  <span className="text-white/50 text-sm">{selectedArticle.date}</span>
                  <span className="text-white/50 text-sm">{selectedArticle.readTime || '3 min read'}</span>
                </div>
                <h1 className="text-3xl font-bold text-white mb-4">{selectedArticle.title}</h1>
                <div className="flex items-center space-x-6 text-white/60 text-sm">
                  <div className="flex items-center space-x-2">
                    <span>👁</span>
                    <span>{selectedArticle.views} views</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>❤️</span>
                    <span>{selectedArticle.likes} likes</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setShowReadModal(false)}
                className="text-white/60 hover:text-white text-3xl ml-4"
              >
                ×
              </button>
            </div>

            <div className="prose prose-invert max-w-none">
              <div className="text-white/80 leading-relaxed whitespace-pre-line">
                {selectedArticle.content}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
              <button
                onClick={() => {
                  handleLikeArticle(selectedArticle._id || selectedArticle.id);
                  // Update the selected article's like count immediately for better UX
                  setSelectedArticle(prev => ({
                    ...prev,
                    likes: (prev.likes || 0) + 1
                  }));
                }}
                className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
              >
                <span>❤️</span>
                <span>Like Article ({selectedArticle.likes || 0})</span>
              </button>
              <div className="text-white/60 text-sm">
                Published on {selectedArticle.date}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Articles;
