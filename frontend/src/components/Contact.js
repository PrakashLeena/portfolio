import React, { useState, useEffect } from 'react';
import { createApiUrl, testApiConnection, apiRequest } from '../config/api';
import ConnectionDebugger from './ConnectionDebugger';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [apiStatus, setApiStatus] = useState('checking'); // checking, connected, disconnected

  // Test API connection on component mount
  useEffect(() => {
    const checkConnection = async () => {
      const result = await testApiConnection();
      setApiStatus(result.success ? 'connected' : 'disconnected');
    };
    
    checkConnection();
  }, []);

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
      console.log('📧 Submitting contact form...', { name: formData.name, message: formData.message.substring(0, 50) + '...' });
      
      const result = await apiRequest('contact', {
        method: 'POST',
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message
        }),
      });

      if (result.success) {
        console.log('✅ Contact form submitted successfully');
        setSubmitStatus('success');
        setFormData({ name: '', email: '', message: '' });
        
        // Clear success message after 5 seconds
        setTimeout(() => setSubmitStatus(null), 5000);
      } else {
        console.error('❌ Contact form submission failed:', result.error);
        setSubmitStatus('error');
        
        // Clear error message after 5 seconds
        setTimeout(() => setSubmitStatus(null), 5000);
      }
    } catch (error) {
      console.error('❌ Error submitting contact form:', error);
      setSubmitStatus('error');
      
      // Clear error message after 5 seconds
      setTimeout(() => setSubmitStatus(null), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen relative text-white">
      {/* Debug Component - Remove after testing */}
      <ConnectionDebugger />
      
      {/* Contact Section */}
      <section id="contact" className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-12 opacity-0 animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 bg-clip-text text-transparent">
              Get in touch
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed max-w-3xl">
              Phasellus convallis elit id ullamcorper pulvinar. Duis aliquam turpis mauris, eu ultricies erat malesuada quis. 
              Aliquam dapibus, lacus eget hendrerit bibendum, urna est aliquam sem, sit amet imperdiet est velit quis lorem.
            </p>
            
            {/* API Status Indicator */}
            <div className="mt-4 flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                apiStatus === 'connected' ? 'bg-green-500' : 
                apiStatus === 'disconnected' ? 'bg-red-500' : 
                'bg-yellow-500 animate-pulse'
              }`}></div>
              <span className="text-sm text-gray-400">
                Backend: {
                  apiStatus === 'connected' ? 'Connected' : 
                  apiStatus === 'disconnected' ? 'Disconnected' : 
                  'Checking...'
                }
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Left Side - Form */}
            <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name and Email Row */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Name Input */}
                  <div>
                    <label htmlFor="name" className="block text-white font-semibold mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all backdrop-blur-sm"
                      placeholder="Your name"
                    />
                  </div>

                  {/* Email Input */}
                  <div>
                    <label htmlFor="email" className="block text-white font-semibold mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all backdrop-blur-sm"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                {/* Message Textarea */}
                <div>
                  <label htmlFor="message" className="block text-white font-semibold mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all resize-none backdrop-blur-sm"
                    placeholder="Your message..."
                  />
                </div>

                {/* Submit Button */}
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg font-semibold tracking-wider text-white transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isSubmitting ? 'SENDING...' : 'SEND MESSAGE'}
                  </button>
                </div>

                {/* Status Messages */}
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
            <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              {/* Address */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-4 text-white">Address</h3>
                <div className="text-gray-300 space-y-1">
                  <p>WARD NO.06 VANKALAI,</p>
                  <p>MANNAR</p>
                  <p>SRI LANKA</p>
                </div>
              </div>

              {/* Email */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-4 text-white">Email</h3>
                <a 
                  href="kiboxsonleena2004@gmail.com" 
                  className="text-gray-300 hover:text-purple-400 transition-colors border-b border-gray-600 hover:border-purple-400"
                >
                  kiboxsonleena2004@gmail.com
                </a>
              </div>

              {/* Phone */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-4 text-white">Phone</h3>
                <a 
                  href="tel:+94701269689" 
                  className="text-gray-300 hover:text-purple-400 transition-colors"
                >
                  +94-701269689
                </a>
              </div>

              {/* Social */}
              <div>
                <h3 className="text-2xl font-bold mb-4 text-white">Social</h3>
                <div className="flex space-x-4">
                  <a 
                    href="https://facebook.com/kibxson51" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-purple-400 transition-colors transform hover:scale-110"
                    aria-label="Facebook"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  <a 
                    href="https://github.com/PrakashLeena" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-purple-400 transition-colors transform hover:scale-110"
                    aria-label="GitHub"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </a>
                  <a 
                    href="https://instagram.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-purple-400 transition-colors transform hover:scale-110"
                    aria-label="Instagram"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                  <a 
                    href="https://www.linkedin.com/in/kiboxson-leena5111" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-purple-400 transition-colors transform hover:scale-110"
                    aria-label="LinkedIn"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
