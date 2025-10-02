import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Certifications = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Certificate handling functions
  const showCopyFeedback = (button, message) => {
    const originalText = button.textContent;
    button.textContent = message;
    button.classList.remove('text-gray-400', 'hover:text-gray-300');
    button.classList.add('text-green-400');

    setTimeout(() => {
      button.textContent = originalText;
      button.classList.remove('text-green-400');
      button.classList.add('text-gray-400', 'hover:text-gray-300');
    }, 2000);
  };

  const fallbackCopy = (text, buttonElement) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand('copy');
      showCopyFeedback(buttonElement, 'Link Copied!');
    } catch (err) {
      alert('Certificate link: ' + text);
    }

    document.body.removeChild(textArea);
  };

  // Add global functions for certificate handling
  useEffect(() => {
    // Global function for showing copy feedback
    window.showCopyFeedback = showCopyFeedback;

    // Global function for fallback copy
    window.fallbackCopy = fallbackCopy;
  }, []);

  const handleCertificateClick = (e, url) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCopyLink = (e, url) => {
    if (navigator.clipboard && window.isSecureContext) {
      // Use modern clipboard API
      navigator.clipboard.writeText(url).then(() => {
        showCopyFeedback(e.target, 'Link Copied!');
      }).catch((err) => {
        console.warn('Clipboard API failed:', err);
        fallbackCopy(url, e.target);
      });
    } else {
      // Fallback for older browsers
      fallbackCopy(url, e.target);
    }
  };

  const certifications = [
    {
      title: 'Fundamentals of Web Development Program at EMC Academy(India)',
      certificate: 'https://drive.google.com/file/d/1GoM9b0CHoOO_pMztZ0My4VFE7J1sbSFZ/view?usp=drive_link'
    },
    {
      title: 'Full-Stack Web Development course at EMC Academy(India)',
      certificate: null
    },
    {
      title: 'Prompt Engineering Course at EMC Academy(India)',
      certificate: 'https://drive.google.com/file/d/1qG4K18seWKbTQSZi0BTcyas5styfCbBU/view?usp=drive_link'
    },
    {
      title: 'Python For Biginners at University Of Moratuwa',
      certificate: 'https://drive.google.com/file/d/1q8Q7MEPp_Y1A0Mzts2vimWTcSkMfwa7P/view?usp=drive_link'
    }
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="relative min-h-screen text-white">
      {/* Mobile Menu Button */}
      <div
        className={`fixed top-5 left-5 z-50 cursor-pointer flex flex-col justify-around w-10 h-10 p-2 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg shadow-lg transition-all duration-300 md:hidden ${
          isMobileMenuOpen ? 'active' : ''
        }`}
        onClick={toggleMobileMenu}
      >
        <span className={`block h-0.5 w-full bg-white transition-all duration-300 ${
          isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''
        }`}></span>
        <span className={`block h-0.5 w-full bg-white transition-all duration-300 ${
          isMobileMenuOpen ? 'opacity-0' : ''
        }`}></span>
        <span className={`block h-0.5 w-full bg-white transition-all duration-300 ${
          isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
        }`}></span>
      </div>

      {/* Header */}
      <section className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${isMobileMenuOpen ? 'mobile-active' : ''}`}>
        <div className="backdrop-blur-md bg-gradient-to-r from-purple-900/90 to-pink-900/90 border-b border-white/20 shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div className="text-white font-bold text-xl">
                Portfolio
              </div>
              <div className="hidden md:block">
                <ul className="flex space-x-8">
                  <li>
                    <Link to="/" className="text-white hover:text-purple-300 transition-colors duration-300 uppercase tracking-wider font-semibold">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link to="/projects" className="text-white hover:text-pink-300 transition-colors duration-300 uppercase tracking-wider font-semibold">
                      Projects
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section className="pt-24 pb-16 px-4 min-h-screen bg-gradient-to-br from-black/30 via-purple-900/20 to-black/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 bg-clip-text text-transparent">
              Courses & Certifications
            </h1>
            <div className="mx-auto mt-6 w-32 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {certifications.map((cert, index) => (
              <div
                key={index}
                className="group relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-xl p-8 border border-white/10 hover:border-cyan-500/50 transition-all duration-300 cursor-pointer hover:transform hover:-translate-y-2"
              >
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                    <img
                      src="/images/bg.png"
                      alt="Profile"
                      className="w-12 h-12 rounded-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <span className="text-2xl" style={{display: 'none'}}>👨‍💻</span>
                  </div>

                  <div className="flex-1">
                    <h2 className="text-lg md:text-xl text-white mb-3 leading-relaxed">
                      {cert.title}
                    </h2>

                    {cert.certificate && (
                      <div className="flex flex-col space-y-2">
                        <a
                          href={cert.certificate}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-cyan-400 hover:text-cyan-300 text-sm underline decoration-1 underline-offset-2 transition-colors duration-200"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          View Certificate →
                        </a>
                        <button
                          onClick={(e) => handleCopyLink(e, cert.certificate)}
                          className="text-xs text-gray-400 hover:text-gray-300 underline transition-colors duration-200"
                        >
                          Copy Link
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-cyan-500/0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Click outside to close mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default Certifications;
