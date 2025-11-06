import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest, API_BASE_URL } from '../config/api';

// Contact Form State Hook
const useContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const result = await apiRequest('contact', {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      if (result.success) {
        setSubmitStatus('success');
        setFormData({ name: '', message: '' });
      } else {
        setSubmitStatus('error');
      }
      
      setTimeout(() => setSubmitStatus(null), 5000);
    } catch (error) {
      console.error('❌ Network error:', error);
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus(null), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { formData, isSubmitting, submitStatus, handleChange, handleSubmit };
};

const Portfolio = () => {
  const [likes, setLikes] = useState(0);
  const [experiences, setExperiences] = useState([]);
  const [loadingExperiences, setLoadingExperiences] = useState(true);
  const [skills, setSkills] = useState([]);
  const [loadingSkills, setLoadingSkills] = useState(true);
  const [resume, setResume] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [hasLiked, setHasLiked] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Contact form state
  const { formData, isSubmitting, submitStatus, handleChange, handleSubmit } = useContactForm();

  // Load likes from backend on component mount
  useEffect(() => {
    const loadLikes = async () => {
      try {
        // Get current likes and user's like status from backend
        const response = await apiRequest('portfolio/likes', {
          method: 'GET'
        });
        
        if (response.success && response.data) {
          setLikes(response.data.likes);
          // Set hasLiked based on backend response (IP-based tracking)
          setHasLiked(response.data.hasLiked || false);
        }
      } catch (error) {
        console.error('❌ Error loading likes from backend:', error);
      }
    };
    
    loadLikes();
  }, []);

  // Fetch experiences from API
  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const result = await apiRequest('experiences');
        
        if (result.success && result.data.experiences) {
          setExperiences(result.data.experiences);
        }
      } catch (error) {
        console.error('❌ Error fetching experiences:', error);
      } finally {
        setLoadingExperiences(false);
      }
    };

    fetchExperiences();
  }, []);

  // Fetch skills from API
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const result = await apiRequest('skills');
        
        if (result.success && result.data.skills) {
          setSkills(result.data.skills);
        }
      } catch (error) {
        console.error('❌ Error fetching skills:', error);
      } finally {
        setLoadingSkills(false);
      }
    };

    fetchSkills();
  }, []);

  // Fetch resume
  useEffect(() => {
    const fetchResume = async () => {
      try {
        const result = await apiRequest('resume');
        console.log('📄 Resume API response:', result);
        
        if (result.success && result.data.resume) {
          console.log('✅ Resume data:', result.data.resume);
          console.log('📎 Resume URL:', result.data.resume.fileUrl);
          setResume(result.data.resume);
        } else {
          console.log('⚠️ No resume found in response');
        }
      } catch (error) {
        console.error('❌ Error fetching resume:', error);
      }
    };

    fetchResume();
  }, []);

  // Fetch profile photo
  useEffect(() => {
    const fetchProfilePhoto = async () => {
      try {
        const result = await apiRequest('profile-photo');
        
        if (result.success && result.data.profilePhoto) {
          setProfilePhoto(result.data.profilePhoto);
        }
      } catch (error) {
        console.error('❌ Error fetching profile photo:', error);
      }
    };

    fetchProfilePhoto();
  }, []);

  const handleLike = async () => {
    if (!hasLiked) {
      // Optimistic update
      const newLikes = likes + 1;
      setLikes(newLikes);
      setHasLiked(true);
      setIsAnimating(true);
      
      try {
        // Send like to backend
        const response = await apiRequest('portfolio/like', {
          method: 'POST'
        });
        
        if (response.success && response.data) {
          // Update with actual count from backend
          setLikes(response.data.likes);
        } else {
          // Revert optimistic update on failure
          setLikes(likes);
          setHasLiked(false);
          
          // Show user-friendly message if already liked
          if (response.error && response.error.includes('already liked')) {
            console.log('ℹ️ You have already liked this portfolio');
          } else {
            console.error('❌ Failed to like portfolio:', response);
          }
        }
      } catch (error) {
        // Revert optimistic update on error
        setLikes(likes);
        setHasLiked(false);
        console.error('❌ Error liking portfolio:', error);
      }
      
      // Remove animation class after animation completes
      setTimeout(() => setIsAnimating(false), 600);
    } else {
      // Unlike functionality
      setLikes(likes - 1);
      setHasLiked(false);
      
      try {
        // Send unlike to backend
        const response = await apiRequest('portfolio/unlike', {
          method: 'POST'
        });
        
        if (response.success && response.data) {
          // Update with actual count from backend
          setLikes(response.data.likes);
        } else {
          // Revert optimistic update on failure
          setLikes(likes);
          setHasLiked(true);
          console.error('❌ Failed to unlike portfolio:', response);
        }
      } catch (error) {
        // Revert optimistic update on error
        setLikes(likes);
        setHasLiked(true);
        console.error('❌ Error unliking portfolio:', error);
      }
    }
  };

  return (
    <div className="min-h-screen text-white relative">
      {/* Education Top Banner */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 text-white py-3 opacity-0 animate-fade-in shadow-lg">
        <div className="container mx-auto text-center px-4">
          <span className="text-sm font-bold tracking-wide">Undergraduate Student at University of Kelaniya (Sri Lanka)</span><br />
          
        </div>
      </div>

      {/* Welcome Section */}
      <section id="welcome" className="pt-8 pb-20 px-4 min-h-screen">
        <div className="container mx-auto">
          {/* Location Tag - Top Right */}
          <div className="absolute top-16 right-8 bg-black bg-opacity-50 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center space-x-2 z-10 opacity-0 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#ffae42" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 6.11 12.16 6.38 12.44.37.39.98.39 1.36 0C12.89 21.16 19 14.25 19 9c0-3.87-3.13-7-7-7zm0 17.3C10.09 17.3 7 12.97 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 3.97-3.09 8.3-5 10.3z" />
              <circle cx="12" cy="9" r="2.5" />
            </svg>
            <span className="text-sm">
              <a href="https://maps.app.goo.gl/2xYv8W1dTKLiAHxc6" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300">
                Sri Lanka
              </a>
            </span>
          </div>

          {/* Two Column Layout - Text Left, Image Right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center max-w-7xl mx-auto mt-16">
            {/* Left Side - Text Content */}
            <div className="space-y-8 lg:pl-12">
              {/* Name and Welcome */}
              <div className="space-y-4 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <h1 className="text-3xl md:text-5xl font-extrabold">
                  <span className="bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">Hi, I'm</span>
                  <br />
                  <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 bg-clip-text text-transparent">A.G. PRAKASH LEENA</span>
                </h1>
                <h2 className="text-xl md:text-2xl font-light text-white/90 tracking-wide">Full-Stack Developer & Tech Enthusiast</h2>
              </div>

              {/* Description Paragraph */}
              <div className="space-y-4 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                <p className="text-base md:text-lg text-white/90 leading-relaxed font-light">
                  A highly motivated MIT undergraduate with hands-on experience in{' '}
                  <span className="text-purple-300 font-semibold">Full-Stack Web Development</span>
                </p>
                <p className="text-sm md:text-base text-white/70 font-light">
                  A quick learner, creative problem solver, and collaborative team player, passionate about building
                  responsive, user-friendly web applications and delivering smart digital solutions.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 opacity-0 animate-fade-in-up pt-4" style={{ animationDelay: '0.7s' }}>
                <Link to="/projects" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl text-sm tracking-wide uppercase">
                  Projects
                </Link>
                <Link to="/articles" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl text-sm tracking-wide uppercase">
                  Articles
                </Link>
                <Link to="/certifications" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl text-sm tracking-wide uppercase">
                  Courses
                </Link>
                {resume ? (
                  <a 
                    href={resume.fileUrl}
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={() => console.log('🔗 Opening resume URL:', resume.fileUrl)}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl text-sm tracking-wide uppercase"
                  >
                    📄 Resume
                  </a>
                ) : (
                  <a 
                    href="https://drive.google.com/file/d/1-NfCYAQAYxfHy9bgMfUSSnYYKg8AU8Ht/view?usp=drive_link"
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl text-sm tracking-wide uppercase"
                  >
                    Resume
                  </a>
                )}
                <a href="#contact" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl text-sm tracking-wide uppercase">
                  Contact
                </a>
              </div>
            </div>

            {/* Right Side - Profile Image */}
            <div className="flex justify-center opacity-0 animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <div className="w-64 h-64 md:w-80 md:h-80 bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl">
                <div className="w-[15rem] h-[15rem] md:w-[19rem] md:h-[19rem] bg-gray-900 rounded-full flex items-center justify-center overflow-hidden border-4 border-white/10">
                  <img
                    src={profilePhoto ? profilePhoto.imageUrl : "/images/bg.png"}
                    alt="Prakash Leena Profile"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = '/images/bg.png';
                    }}
                  />
                  <span className="text-5xl" style={{ display: 'none' }}>👨‍💻</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Combined Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-black/40 via-purple-900/20 to-black/40">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Work Experiences */}
            <div className="opacity-0 animate-fade-in-up h-full" style={{animationDelay: '0.9s'}}>
              <div className="text-center mb-10">
                <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">Work Experience</h2>
                <div className="w-32 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full"></div>
              </div>

              {loadingExperiences ? (
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-10 h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500 mb-4"></div>
                    <p className="text-white/70">Loading experiences...</p>
                  </div>
                </div>
              ) : experiences.length === 0 ? (
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-10 h-full flex flex-col shadow-2xl">
                  <div className="flex items-center space-x-5 mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                      <span className="text-3xl">👨‍💻</span>
                    </div>
                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold text-purple-300">Freelancing</h3>
                      <p className="text-white/80 font-medium">Fiverr</p>
                      <p className="text-white/60 text-sm">Jan. 2025 – Present</p>
                    </div>
                  </div>

                  <ul className="space-y-5 text-white/80 mb-8 flex-grow">
                    <li className="flex items-start space-x-4">
                      <span className="text-purple-400 mt-1 flex-shrink-0 text-lg">▸</span>
                      <span className="leading-relaxed">Worked as a freelancer on Fiverr for 5 months, successfully delivering multiple web development projects with on-time delivery and quick response rates, maintaining strong client satisfaction and communication.</span>
                    </li>
                    <li className="flex items-start space-x-4">
                      <span className="text-purple-400 mt-1 flex-shrink-0 text-lg">▸</span>
                      <span className="leading-relaxed">Built responsive, user-friendly websites and applications, focusing on performance, scalability, and clean code.</span>
                    </li>
                  </ul>

                  <div className="space-y-5 mt-auto pt-6 border-t border-white/10">
                    <div>
                      <h4 className="text-purple-300 font-bold mb-3 text-lg">Relevant Skills</h4>
                      <p className="text-white/70 text-sm leading-relaxed">HTML5, CSS3, JavaScript, React.js, Tailwind CSS, Bootstrap, Responsive Web Design, DOM Manipulation, Node.js, Express.js, RESTful API Development, MongoDB, Mongoose, Git & GitHub, VS Code, Postman, Deployment: Netlify, Vercel</p>
                    </div>
                    <div>
                      <h4 className="text-pink-300 font-bold mb-3 text-lg">Soft Skills</h4>
                      <p className="text-white/70 text-sm leading-relaxed">Quick Learner & Problem Solver, Effective Communication, Time Management, Team Collaboration, Client Handling (Fiverr)</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {experiences.map((exp, index) => (
                    <div key={exp._id} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-2xl hover:shadow-purple-500/20 transition-all duration-300">
                      <div className="flex items-center space-x-5 mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                          <span className="text-2xl">👨‍💻</span>
                        </div>
                        <div>
                          <h3 className="text-xl md:text-2xl font-bold text-purple-300">{exp.title}</h3>
                          <p className="text-white/80 font-medium">{exp.company}</p>
                          {exp.duration && <p className="text-white/60 text-sm">{exp.duration}</p>}
                        </div>
                      </div>

                      {exp.description && (
                        <div className="mb-6">
                          <p className="text-white/80 leading-relaxed">{exp.description}</p>
                        </div>
                      )}

                      {exp.skills && (
                        <div className="pt-4 border-t border-white/10">
                          <h4 className="text-purple-300 font-bold mb-2 text-sm">Skills</h4>
                          <p className="text-white/70 text-sm leading-relaxed">{exp.skills}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Technical Skills */}
            <div className="opacity-0 animate-fade-in-up h-full" style={{animationDelay: '1.5s'}}>
              <div className="text-center mb-10">
                <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">Technical Skills</h2>
                <div className="w-32 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full"></div>
              </div>

              {loadingSkills ? (
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-10 h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500 mb-4"></div>
                    <p className="text-white/70">Loading skills...</p>
                  </div>
                </div>
              ) : skills.length === 0 ? (
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-10 h-full flex flex-col shadow-2xl hover:shadow-pink-500/20 transition-all duration-300">
                  <div className="flex items-center space-x-5 mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                      <span className="text-3xl">⚡</span>
                    </div>
                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold text-pink-300">Tech Stack</h3>
                    </div>
                  </div>

                  <ul className="space-y-5 text-white/80 flex-grow">
                    <li className="flex items-start space-x-4">
                      <span className="text-purple-400 mt-1 flex-shrink-0 text-lg">▸</span>
                      <span className="leading-relaxed"><strong className="text-purple-300">Programming Languages:</strong> Python, JavaScript, CSS, HTML</span>
                    </li>
                    <li className="flex items-start space-x-4">
                      <span className="text-purple-400 mt-1 flex-shrink-0 text-lg">▸</span>
                      <span className="leading-relaxed"><strong className="text-purple-300">JavaScript Libraries:</strong> Node.js, React.js, Express.js</span>
                    </li>
                    <li className="flex items-start space-x-4">
                      <span className="text-purple-400 mt-1 flex-shrink-0 text-lg">▸</span>
                      <span className="leading-relaxed"><strong className="text-purple-300">Python Libraries:</strong> NumPy, Pandas</span>
                    </li>
                    <li className="flex items-start space-x-4">
                      <span className="text-purple-400 mt-1 flex-shrink-0 text-lg">▸</span>
                      <span className="leading-relaxed"><strong className="text-purple-300">Database:</strong>MongoDB</span>
                    </li>
                    <li className="flex items-start space-x-4">
                      <span className="text-purple-400 mt-1 flex-shrink-0 text-lg">▸</span>
                      <span className="leading-relaxed"><strong className="text-purple-300">CSS:</strong> Tailwind</span>
                    </li>
                    <li className="flex items-start space-x-4">
                      <span className="text-purple-400 mt-1 flex-shrink-0 text-lg">▸</span>
                      <span className="leading-relaxed"><strong className="text-purple-300">Version Control:</strong> Git & GitHub ,Vercel</span>
                    </li>
                    <li className="flex items-start space-x-4">
                      <span className="text-purple-400 mt-1 flex-shrink-0 text-lg">▸</span>
                      <span className="leading-relaxed"><strong className="text-purple-300">Work with</strong>FireBase , Cloudinary</span>
                    </li>
                  </ul>
                </div>
              ) : (
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-10 h-full flex flex-col shadow-2xl hover:shadow-pink-500/20 transition-all duration-300">
                  <div className="flex items-center space-x-5 mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                      <span className="text-3xl">⚡</span>
                    </div>
                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold text-pink-300">Tech Stack</h3>
                    </div>
                  </div>

                  <ul className="space-y-5 text-white/80 flex-grow">
                    {skills.map((skill, index) => (
                      <li key={skill._id || index} className="flex items-start space-x-4">
                        <span className="text-purple-400 mt-1 flex-shrink-0 text-lg">▸</span>
                        <span className="leading-relaxed">
                          <strong className="text-purple-300">{skill.category}:</strong> {skill.skills}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section with Form */}
      <section id="contact" className="py-24 px-4 bg-gradient-to-b from-black/40 to-purple-900/30">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="text-center mb-12 opacity-0 animate-fade-in-up" style={{ animationDelay: '2.1s' }}>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-6">Get in touch</h1>
            <p className="text-white/70 text-lg max-w-3xl mx-auto leading-relaxed">
            Want to debug challenges or deploy new ideas? Initialize a chat with me and let’s push great things to production.
            </p>
          </div>

          {/* Contact Form Grid */}
          <div className="grid md:grid-cols-2 gap-12">
            {/* Left Side - Form */}
            <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '2.3s' }}>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-white font-semibold mb-2">Name</label>
                  <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all backdrop-blur-sm"
                    placeholder="Your name" />
                </div>
                <div>
                  <label htmlFor="message" className="block text-white font-semibold mb-2">Message</label>
                  <textarea id="message" name="message" value={formData.message} onChange={handleChange} required rows="6"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all resize-none backdrop-blur-sm"
                    placeholder="Your message..." />
                </div>
                <div>
                  <button type="submit" disabled={isSubmitting}
                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg font-semibold tracking-wider text-white transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                    {isSubmitting ? 'SENDING...' : 'SEND MESSAGE'}
                  </button>
                </div>
                {submitStatus === 'success' && (
                  <div className="p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-300 animate-fade-in">
                    ✓ Message sent successfully!
                  </div>
                )}
                {submitStatus === 'error' && (
                  <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 animate-fade-in">
                    ✗ Failed to send message. Please try again.
                  </div>
                )}
              </form>
            </div>

            {/* Right Side - Contact Info */}
            <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '2.5s' }}>
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-4 text-white">Address</h3>
                <div className="text-gray-300 space-y-1">
                  <p>WARD NO.06 VANKALAI,</p>
                  <p>MANNAR</p>
                  <p>SRI LANKA</p>
                </div>
              </div>
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-4 text-white">Email</h3>
                <a href="mailto:kiboxsonleena2004@gmail.com" className="text-gray-300 hover:text-purple-400 transition-colors border-b border-gray-600 hover:border-purple-400">kiboxsonleena2004@gmail.com</a>
              </div>
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-4 text-white">Phone</h3>
                <a href="tel:+94701269689" className="text-gray-300 hover:text-purple-400 transition-colors">+94-701269689</a>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-4 text-white">Social</h3>
                <div className="flex space-x-4">
                  <a href="https://facebook.com/kiboxson51" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-purple-400 transition-colors transform hover:scale-110" aria-label="Facebook">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </a>
                  <a href="https://github.com/PrakashLeena" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-purple-400 transition-colors transform hover:scale-110" aria-label="GitHub">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                  </a>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-purple-400 transition-colors transform hover:scale-110" aria-label="Instagram">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                  </a>
                  <a href="https://www.linkedin.com/in/kiboxson-leena5111/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-purple-400 transition-colors transform hover:scale-110" aria-label="LinkedIn">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Like Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <button
          onClick={handleLike}
          className={`group relative bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full p-4 shadow-2xl transition-all duration-300 transform hover:scale-110 ${
            isAnimating ? 'animate-pulse scale-125' : ''
          }`}
        >
          {/* Heart Icon */}
          <svg
            className={`w-8 h-8 transition-all duration-300 ${hasLiked ? 'fill-white' : 'fill-none stroke-white stroke-2'}`}
            viewBox="0 0 24 24"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          
          {/* Like Count Badge */}
          {likes > 0 && (
            <span className="absolute -top-2 -right-2 bg-white text-purple-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-lg">
              {likes}
            </span>
          )}
          
          {/* Tooltip */}
          <span className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            {hasLiked ? 'Unlike Portfolio' : 'Like Portfolio'}
          </span>
        </button>
      </div>
    </div>
  );
};

export default Portfolio;
