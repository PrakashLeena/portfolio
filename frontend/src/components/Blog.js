import React, { useState, useEffect } from 'react';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [newBlog, setNewBlog] = useState({
    title: '',
    content: '',
    category: 'React',
    tags: []
  });

  // Sample blog data (will be replaced with API calls)
  const sampleBlogs = [
    {
      id: 1,
      title: "Building Scalable React Applications",
      content: "Exploring best practices for creating maintainable and scalable React applications with modern hooks and state management patterns...",
      category: "React",
      date: "Dec 28, 2024",
      views: 124,
      likes: 18,
      published: true
    },
    {
      id: 2,
      title: "MongoDB Atlas vs Local Development",
      content: "A comprehensive comparison of using MongoDB Atlas cloud database versus local MongoDB for development workflows...",
      category: "MongoDB",
      date: "Dec 25, 2024",
      views: 89,
      likes: 12,
      published: true
    },
    {
      id: 3,
      title: "Email Integration with Nodemailer",
      content: "Step-by-step guide to implementing email functionality in Node.js applications using Nodemailer and Gmail SMTP...",
      category: "Node.js",
      date: "Dec 22, 2024",
      views: 156,
      likes: 24,
      published: true
    }
  ];

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await fetch('http://localhost:5000/blogs');
      const data = await response.json();
      
      if (data.success && data.blogs.length > 0) {
        // Format dates for display
        const formattedBlogs = data.blogs.map(blog => ({
          ...blog,
          date: new Date(blog.createdAt).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
          })
        }));
        setBlogs(formattedBlogs);
      } else {
        // Use sample data if no blogs in database
        setBlogs(sampleBlogs);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
      // Fallback to sample data
      setBlogs(sampleBlogs);
    }
  };

  const handleWriteNew = () => {
    setShowWriteModal(true);
  };

  const handleSaveBlog = async () => {
    if (!newBlog.title || !newBlog.content) {
      alert('Please fill in title and content');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newBlog),
      });

      const result = await response.json();

      if (result.success) {
        // Refresh blogs list
        await fetchBlogs();
        
        // Reset form
        setNewBlog({ title: '', content: '', category: 'React', tags: [] });
        setShowWriteModal(false);
        
        alert('Blog published successfully!');
      } else {
        alert('Failed to publish blog: ' + result.message);
      }
    } catch (error) {
      console.error('Error saving blog:', error);
      alert('Failed to publish blog. Please try again.');
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'React': 'text-purple-400 bg-purple-500/20',
      'MongoDB': 'text-green-400 bg-green-500/20',
      'Node.js': 'text-blue-400 bg-blue-500/20',
      'JavaScript': 'text-yellow-400 bg-yellow-500/20',
      'CSS': 'text-pink-400 bg-pink-500/20'
    };
    return colors[category] || 'text-gray-400 bg-gray-500/20';
  };

  return (
    <div className="relative">
      {/* Blog Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
            <span className="text-2xl">📝</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-pink-300">Latest Posts</h3>
            <p className="text-white/60 text-sm">Thoughts on tech & development</p>
          </div>
        </div>
        <button 
          onClick={handleWriteNew}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105"
        >
          Write New
        </button>
      </div>

      {/* Blog Posts */}
      <div className="space-y-6 flex-grow overflow-y-auto max-h-96">
        {blogs.map((blog) => (
          <article key={blog.id} className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300 cursor-pointer group">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors mb-2">
                  {blog.title}
                </h4>
                <p className="text-white/70 text-sm line-clamp-2 mb-3">
                  {blog.content}
                </p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ml-3 ${getCategoryColor(blog.category)}`}>
                {blog.category}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-white/50">
              <span>{blog.date}</span>
              <div className="flex items-center space-x-3">
                <span className="flex items-center space-x-1">
                  <span>👁</span>
                  <span>{blog.views}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span>❤️</span>
                  <span>{blog.likes}</span>
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Blog Footer */}
      <div className="mt-6 pt-6 border-t border-white/10">
        <div className="flex items-center justify-between">
          <div className="text-white/60 text-sm">
            <span className="font-medium text-purple-300">{blogs.length}</span> published articles
          </div>
          <button className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors">
            View All Posts →
          </button>
        </div>
      </div>

      {/* Write New Blog Modal */}
      {showWriteModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-white/20 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Write New Article</h2>
              <button 
                onClick={() => setShowWriteModal(false)}
                className="text-white/60 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-white font-semibold mb-2">Title</label>
                <input
                  type="text"
                  value={newBlog.title}
                  onChange={(e) => setNewBlog({...newBlog, title: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
                  placeholder="Enter article title..."
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-white font-semibold mb-2">Category</label>
                <select
                  value={newBlog.category}
                  onChange={(e) => setNewBlog({...newBlog, category: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                >
                  <option value="React">React</option>
                  <option value="Node.js">Node.js</option>
                  <option value="MongoDB">MongoDB</option>
                  <option value="JavaScript">JavaScript</option>
                  <option value="CSS">CSS</option>
                </select>
              </div>

              {/* Content */}
              <div>
                <label className="block text-white font-semibold mb-2">Content</label>
                <textarea
                  value={newBlog.content}
                  onChange={(e) => setNewBlog({...newBlog, content: e.target.value})}
                  rows="10"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400 resize-none"
                  placeholder="Write your article content here..."
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-4">
                <button
                  onClick={() => setShowWriteModal(false)}
                  className="px-6 py-3 border border-white/20 text-white rounded-lg hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveBlog}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
                >
                  Publish Article
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blog;
