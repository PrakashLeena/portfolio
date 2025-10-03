import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../config/api';

const AdminDashboard = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminCredentials, setAdminCredentials] = useState({
    username: '',
    password: ''
  });
  
  // Active section state
  const [activeSection, setActiveSection] = useState('projects');
  
  // Form states
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    technologies: '',
    githubUrl: '',
    liveUrl: '',
    image: ''
  });
  
  const [newExperience, setNewExperience] = useState({
    title: '',
    company: '',
    duration: '',
    description: '',
    skills: ''
  });
  
  const [newSkill, setNewSkill] = useState({
    category: '',
    skills: ''
  });
  
  const [newCertification, setNewCertification] = useState({
    title: '',
    issuer: '',
    date: '',
    credentialUrl: '',
    description: ''
  });

  useEffect(() => {
    // Check if admin is already logged in
    const adminStatus = localStorage.getItem('portfolioAdmin');
    if (adminStatus === 'true') {
      setIsAdmin(true);
    } else {
      setShowAdminLogin(true);
    }
  }, []);

  // Admin authentication
  const handleAdminLogin = async () => {
    const { username, password } = adminCredentials;
    
    if (!username || !password) {
      alert('Please enter both username and password.');
      return;
    }

    try {
      console.log('🔐 Attempting admin login...');
      const result = await apiRequest('admin/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });
      
      if (result.success) {
        setIsAdmin(true);
        setShowAdminLogin(false);
        localStorage.setItem('portfolioAdmin', 'true');
        setAdminCredentials({ username: '', password: '' });
        console.log('✅ Admin logged in successfully');
      } else {
        alert('Invalid credentials. Please try again.');
      }
    } catch (error) {
      // Fallback authentication
      const ADMIN_USERNAME = 'admin';
      const ADMIN_PASSWORD = 'portfolio2024';
      
      if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        setIsAdmin(true);
        setShowAdminLogin(false);
        localStorage.setItem('portfolioAdmin', 'true');
        setAdminCredentials({ username: '', password: '' });
        console.log('✅ Admin logged in successfully (offline mode)');
      } else {
        alert('Invalid credentials. Please try again.');
      }
    }
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('portfolioAdmin');
    setShowAdminLogin(true);
  };

  // Save functions
  const handleSaveProject = async () => {
    if (!newProject.title || !newProject.description) {
      alert('Please fill in title and description');
      return;
    }

    try {
      console.log('💼 Adding new project:', newProject.title);
      const result = await apiRequest('projects', {
        method: 'POST',
        body: JSON.stringify(newProject),
      });

      if (result.success) {
        console.log('✅ Project added successfully');
        alert('Project added successfully!');
        setNewProject({
          title: '',
          description: '',
          technologies: '',
          githubUrl: '',
          liveUrl: '',
          image: ''
        });
      } else {
        console.error('❌ Failed to add project:', result.error);
        alert('Failed to add project: ' + result.error);
      }
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Failed to save project. Please try again.');
    }
  };

  const handleSaveExperience = async () => {
    if (!newExperience.title || !newExperience.company) {
      alert('Please fill in title and company');
      return;
    }

    try {
      console.log('👨‍💻 Adding new experience:', newExperience.title, 'at', newExperience.company);
      const result = await apiRequest('experiences', {
        method: 'POST',
        body: JSON.stringify(newExperience),
      });

      if (result.success) {
        console.log('✅ Work experience added successfully');
        alert('Work experience added successfully!');
        setNewExperience({
          title: '',
          company: '',
          duration: '',
          description: '',
          skills: ''
        });
      } else {
        console.error('❌ Failed to add experience:', result.error);
        alert('Failed to add work experience: ' + result.error);
      }
    } catch (error) {
      console.error('Error saving experience:', error);
      alert('Failed to save experience. Please try again.');
    }
  };

  const handleSaveSkill = async () => {
    if (!newSkill.category || !newSkill.skills) {
      alert('Please fill in category and skills');
      return;
    }

    try {
      console.log('⚡ Adding new skill category:', newSkill.category);
      const result = await apiRequest('skills', {
        method: 'POST',
        body: JSON.stringify(newSkill),
      });

      if (result.success) {
        console.log('✅ Technical skill added successfully');
        alert('Technical skill added successfully!');
        setNewSkill({
          category: '',
          skills: ''
        });
      } else {
        console.error('❌ Failed to add skill:', result.error);
        alert('Failed to add technical skill: ' + result.error);
      }
    } catch (error) {
      console.error('Error saving skill:', error);
      alert('Failed to save skill. Please try again.');
    }
  };

  const handleSaveCertification = async () => {
    if (!newCertification.title || !newCertification.issuer) {
      alert('Please fill in title and issuer');
      return;
    }

    try {
      console.log('🏆 Adding new certification:', newCertification.title, 'from', newCertification.issuer);
      const result = await apiRequest('certifications', {
        method: 'POST',
        body: JSON.stringify(newCertification),
      });

      if (result.success) {
        console.log('✅ Certification added successfully');
        alert('Certification added successfully!');
        setNewCertification({
          title: '',
          issuer: '',
          date: '',
          credentialUrl: '',
          description: ''
        });
      } else {
        console.error('❌ Failed to add certification:', result.error);
        alert('Failed to add certification: ' + result.error);
      }
    } catch (error) {
      console.error('Error saving certification:', error);
      alert('Failed to save certification. Please try again.');
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center p-4">
        {showAdminLogin && (
          <div className="bg-gray-900 border border-white/20 rounded-2xl p-8 max-w-md w-full">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-white flex items-center justify-center space-x-2">
                <span>👑</span>
                <span>Admin Dashboard</span>
              </h2>
              <p className="text-white/60 mt-2">Login to access admin features</p>
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

              <button
                onClick={handleAdminLogin}
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
              >
                Login to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black">
      {/* Header */}
      <header className="py-6 px-4 border-b border-white/10">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <div>
              <Link to="/" className="text-purple-400 hover:text-purple-300 transition-colors mb-2 inline-block">
                ← Back to Portfolio
              </Link>
              <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-white/70 text-lg mt-2">
                Manage your portfolio content
              </p>
            </div>
            <div className="flex items-center space-x-4">
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
          </div>
        </div>
      </header>

      <div className="container mx-auto max-w-7xl p-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 sticky top-4">
              <h3 className="text-xl font-bold text-white mb-4">Sections</h3>
              <nav className="space-y-2">
                {[
                  { id: 'projects', label: 'Projects', icon: '💼' },
                  { id: 'experience', label: 'Work Experience', icon: '👨‍💻' },
                  { id: 'skills', label: 'Technical Skills', icon: '⚡' },
                  { id: 'certifications', label: 'Certifications', icon: '🏆' }
                ].map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 flex items-center space-x-3 ${
                      activeSection === section.id
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <span>{section.icon}</span>
                    <span>{section.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8">
              
              {/* Projects Section */}
              {activeSection === 'projects' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
                    <span>💼</span>
                    <span>Add New Project</span>
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-white font-semibold mb-2">Project Title</label>
                      <input
                        type="text"
                        value={newProject.title}
                        onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
                        placeholder="Enter project title"
                      />
                    </div>

                    <div>
                      <label className="block text-white font-semibold mb-2">Technologies</label>
                      <input
                        type="text"
                        value={newProject.technologies}
                        onChange={(e) => setNewProject({...newProject, technologies: e.target.value})}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
                        placeholder="React, Node.js, MongoDB"
                      />
                    </div>

                    <div>
                      <label className="block text-white font-semibold mb-2">GitHub URL</label>
                      <input
                        type="url"
                        value={newProject.githubUrl}
                        onChange={(e) => setNewProject({...newProject, githubUrl: e.target.value})}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
                        placeholder="https://github.com/username/repo"
                      />
                    </div>

                    <div>
                      <label className="block text-white font-semibold mb-2">Live URL</label>
                      <input
                        type="url"
                        value={newProject.liveUrl}
                        onChange={(e) => setNewProject({...newProject, liveUrl: e.target.value})}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
                        placeholder="https://project-demo.com"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-white font-semibold mb-2">Image URL</label>
                      <input
                        type="url"
                        value={newProject.image}
                        onChange={(e) => setNewProject({...newProject, image: e.target.value})}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
                        placeholder="https://example.com/project-image.jpg"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-white font-semibold mb-2">Description</label>
                      <textarea
                        value={newProject.description}
                        onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                        rows="4"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
                        placeholder="Describe your project..."
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleSaveProject}
                    className="mt-6 px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
                  >
                    Add Project
                  </button>
                </div>
              )}

              {/* Work Experience Section */}
              {activeSection === 'experience' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
                    <span>👨‍💻</span>
                    <span>Add Work Experience</span>
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-white font-semibold mb-2">Job Title</label>
                      <input
                        type="text"
                        value={newExperience.title}
                        onChange={(e) => setNewExperience({...newExperience, title: e.target.value})}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
                        placeholder="Full Stack Developer"
                      />
                    </div>

                    <div>
                      <label className="block text-white font-semibold mb-2">Company</label>
                      <input
                        type="text"
                        value={newExperience.company}
                        onChange={(e) => setNewExperience({...newExperience, company: e.target.value})}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
                        placeholder="Company Name"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-white font-semibold mb-2">Duration</label>
                      <input
                        type="text"
                        value={newExperience.duration}
                        onChange={(e) => setNewExperience({...newExperience, duration: e.target.value})}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
                        placeholder="Jan 2023 - Present"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-white font-semibold mb-2">Skills Used</label>
                      <input
                        type="text"
                        value={newExperience.skills}
                        onChange={(e) => setNewExperience({...newExperience, skills: e.target.value})}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
                        placeholder="React, Node.js, MongoDB, etc."
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-white font-semibold mb-2">Description</label>
                      <textarea
                        value={newExperience.description}
                        onChange={(e) => setNewExperience({...newExperience, description: e.target.value})}
                        rows="4"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
                        placeholder="Describe your role and achievements..."
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleSaveExperience}
                    className="mt-6 px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
                  >
                    Add Experience
                  </button>
                </div>
              )}

              {/* Technical Skills Section */}
              {activeSection === 'skills' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
                    <span>⚡</span>
                    <span>Add Technical Skills</span>
                  </h2>
                  
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="block text-white font-semibold mb-2">Category</label>
                      <select
                        value={newSkill.category}
                        onChange={(e) => setNewSkill({...newSkill, category: e.target.value})}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                      >
                        <option value="">Select Category</option>
                        <option value="Programming Languages">Programming Languages</option>
                        <option value="JavaScript Libraries">JavaScript Libraries</option>
                        <option value="Python Libraries">Python Libraries</option>
                        <option value="Database">Database</option>
                        <option value="CSS">CSS</option>
                        <option value="Version Control">Version Control</option>
                        <option value="Work with">Work with</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-white font-semibold mb-2">Skills</label>
                      <input
                        type="text"
                        value={newSkill.skills}
                        onChange={(e) => setNewSkill({...newSkill, skills: e.target.value})}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
                        placeholder="React, Vue.js, Angular (comma separated)"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleSaveSkill}
                    className="mt-6 px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
                  >
                    Add Skill
                  </button>
                </div>
              )}

              {/* Certifications Section */}
              {activeSection === 'certifications' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
                    <span>🏆</span>
                    <span>Add Certification</span>
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-white font-semibold mb-2">Certification Title</label>
                      <input
                        type="text"
                        value={newCertification.title}
                        onChange={(e) => setNewCertification({...newCertification, title: e.target.value})}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
                        placeholder="AWS Certified Developer"
                      />
                    </div>

                    <div>
                      <label className="block text-white font-semibold mb-2">Issuer</label>
                      <input
                        type="text"
                        value={newCertification.issuer}
                        onChange={(e) => setNewCertification({...newCertification, issuer: e.target.value})}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
                        placeholder="Amazon Web Services"
                      />
                    </div>

                    <div>
                      <label className="block text-white font-semibold mb-2">Date</label>
                      <input
                        type="text"
                        value={newCertification.date}
                        onChange={(e) => setNewCertification({...newCertification, date: e.target.value})}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
                        placeholder="Dec 2024"
                      />
                    </div>

                    <div>
                      <label className="block text-white font-semibold mb-2">Credential URL</label>
                      <input
                        type="url"
                        value={newCertification.credentialUrl}
                        onChange={(e) => setNewCertification({...newCertification, credentialUrl: e.target.value})}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
                        placeholder="https://credential-url.com"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-white font-semibold mb-2">Description</label>
                      <textarea
                        value={newCertification.description}
                        onChange={(e) => setNewCertification({...newCertification, description: e.target.value})}
                        rows="3"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
                        placeholder="Brief description of the certification..."
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleSaveCertification}
                    className="mt-6 px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
                  >
                    Add Certification
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
