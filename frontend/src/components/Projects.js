import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Projects = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const projects = [
    {
      id: 1,
      title: 'Interactive E-Learning Website (clone)',
      description: 'Educational platform with interactive animations (frontend)',
      image: './images/1.png',
      link: 'https://prakashleena.github.io/project1-udemyclone-restructure/',
      technologies: ['HTML5', 'CSS']
    },
    {
      id: 2,
      title: 'Trip Advisor (clone)',
      description: 'E-commerce website with interactive animations (frontend)',
      image: '/images/2.png',
      link: 'https://prakashleena.github.io/project2-tripadvisor/',
      technologies: ['HTML5', 'Tailwind CSS']
    },
    {
      id: 3,
      title: 'Greenden (clone)',
      description: 'E-commerce plants selling website (frontend)',
      image: '/images/3.png',
      link: 'https://prakashleena.github.io/Greenden-tailwind-clone/',
      technologies: ['HTML5', 'Tailwind CSS', 'JavaScript']
    },
    {
      id: 4,
      title: 'Students Form',
      description: 'Educational platform for student with updateable UI (frontend)',
      image: '/images/4.png',
      link: 'https://prakashleena.github.io/STUDENT-FORM/',
      technologies: ['HTML5', 'Tailwind CSS', 'JavaScript']
    },
    {
      id: 5,
      title: 'Nostra (clone)',
      description: 'E-commerce cloths selling website with interactive animations (frontend)',
      image: '/images/5.png',
      link: 'https://prakashleena.github.io/Nostra/',
      technologies: ['HTML5', 'Tailwind CSS', 'JavaScript']
    },
    {
      id: 6,
      title: 'Portfolio website',
      description: 'for customer',
      image: '/images/6.png',
      link: '#',
      technologies: ['HTML5', 'Tailwind CSS', 'JavaScript']
    },
    {
      id: 7,
      title: 'Apple Website (clone)',
      description: 'E-commerce Products selling website with interactive animations (frontend)',
      image: '/images/7.png',
      link: 'https://apple-website-clone-l84m.vercel.app/',
      technologies: ['HTML5', 'Tailwind CSS', 'React.js', 'Vite.js']
    },
    {
      id: 8,
      title: 'Todo List',
      description: 'a simple todo list application (frontend & backend)',
      image: '/images/8.png',
      link: 'https://todo-pi-lemon.vercel.app/',
      technologies: ['HTML5', 'Tailwind CSS', 'React.js', 'Node.js','Express.js']
    },
    {
      id: 9,
      title: 'Netflix  (clone)',
      description: 'Functional Login and Sign up page (frontend & backend)',
      image: '/images/9.png',
      link: 'https://loginpage-git-main-a-g-prakash-leenas-projects.vercel.app/',
      technologies: ['HTML5', 'Tailwind CSS', 'React.js', 'Node.js', 'Express.js']
    },
    {
      id: 10,
      title: 'Bulk Mail',
      description: 'Ecommerce platform for sending many mails at a time in simple way   (frontend & backend & database)',
      image: '/images/10.png',
      link: 'https://bulk-mail-woad.vercel.app/',
      technologies: ['HTML5', 'Tailwind CSS', 'React.js', 'Node.js','Express.js','MongoDB(Atles)']
    }
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="relative min-h-screen text-white">
      {/* Mobile Menu Button */}
      <div
        className={`fixed top-5 left-5 z-50 cursor-pointer flex flex-col justify-around w-10 h-10 p-2 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg shadow-lg transition-all duration-300 md:hidden ${isMobileMenuOpen ? 'active' : ''}`}
        onClick={toggleMobileMenu}
      >
        <span className={`block h-0.5 w-full bg-white transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
        <span className={`block h-0.5 w-full bg-white transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
        <span className={`block h-0.5 w-full bg-white transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 -translate-y-1.5' : ''}`}></span>
      </div>

      {/* Header */}
      <section className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${isMobileMenuOpen ? 'mobile-active' : ''}`}>
        <div className="backdrop-blur-md bg-gradient-to-r from-purple-900/90 to-pink-900/90 border-b border-white/20 shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div className="text-white font-bold text-xl">
                Portfolio
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:block">
                <ul className="flex space-x-8">
                  <li>
                    <Link to="/" className="text-white hover:text-purple-300 transition-colors duration-300 uppercase tracking-wider font-semibold">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link to="/certifications" className="text-white hover:text-pink-300 transition-colors duration-300 uppercase tracking-wider font-semibold">
                      Certifications
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Mobile Navigation */}
              <div className={`fixed inset-0 bg-black/90 backdrop-blur-md md:hidden transition-all duration-300 ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                <div className="flex flex-col items-center justify-center h-full space-y-8">
                  <Link
                    to="/"
                    className="text-white text-xl hover:text-purple-300 transition-colors duration-300 uppercase tracking-wider border-b border-white/20 w-32 text-center py-2 font-bold"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <Link
                    to="/certifications"
                    className="text-white text-xl hover:text-pink-300 transition-colors duration-300 uppercase tracking-wider border-b border-white/20 w-32 text-center py-2 font-bold"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Certifications
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="pt-24 pb-16 px-4 min-h-screen bg-gradient-to-br from-black/30 via-purple-900/20 to-black/30">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 bg-clip-text text-transparent">
              My Projects
            </h2>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto font-light leading-relaxed">
              A showcase of my development work and creative solutions
            </p>
            <div className="mx-auto mt-6 w-32 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <div
                key={project.id}
                className="project-card group relative"
                style={{
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <div className="relative overflow-hidden rounded-2xl shadow-2xl transition-all duration-500 hover:shadow-purple-500/50 hover:-translate-y-3 bg-white/5 backdrop-blur-md border border-white/10">
                  <div className="relative">
                    <img
                      className="w-full h-48 object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
                      src={project.image}
                      alt={project.title}
                    />

                    {/* Animated border effect */}
                    <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-purple-400 transition-all duration-300 opacity-0 group-hover:opacity-100"></div>

                    {/* Overlay with enhanced animation */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-center pb-6">
                      <div className="text-center transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                        <div className="mb-4">
                          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-3 transform scale-75 group-hover:scale-100 transition-all duration-300 shadow-lg">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </div>
                        </div>
                        <p className="text-white font-semibold text-lg mb-2">
                          {project.link !== '#' ? (
                            <a
                              href={project.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-white hover:text-purple-200 transition-colors duration-300 font-bold"
                            >
                              View Project →
                            </a>
                          ) : (
                            <span className="text-white font-bold">View Project</span>
                          )}
                        </p>
                        <div className="flex justify-center space-x-2">
                          {project.technologies.slice(0, 3).map((tech, techIndex) => (
                            <span
                              key={techIndex}
                              className="px-2 py-1 text-xs bg-white/20 backdrop-blur-sm text-white rounded-full"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <h5 className="text-xl font-bold mb-2 text-white group-hover:text-purple-300 transition-colors duration-300">
                      {project.title}
                    </h5>
                    <p className="text-white/70 text-sm mb-4 leading-relaxed group-hover:text-white/90 transition-colors duration-300">
                      {project.description}
                    </p>

                    {/* Animated technology tags */}
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className={`px-3 py-1 text-xs rounded-full border transition-all duration-300 transform hover:scale-105 ${
                            tech.includes('HTML') ? 'bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200' :
                            tech.includes('CSS') ? 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200' :
                            tech.includes('Tailwind') ? 'bg-teal-100 text-teal-800 border-teal-200 hover:bg-teal-200' :
                            tech.includes('JavaScript') ? 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200' :
                            tech.includes('React') ? 'bg-cyan-100 text-cyan-800 border-cyan-200 hover:bg-cyan-200' :
                            tech.includes('Vite') ? 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200' :
                            tech.includes('Node') ? 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200' :
                            tech.includes('Express') ? 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200' :
                            tech.includes('MongoDB') ? 'bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200' :
                            'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200'
                          }`}
                          style={{
                            animationDelay: `${(index * 0.1) + (techIndex * 0.05)}s`
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Progress bar animation */}
                    <div className="mt-4 w-full bg-white/10 rounded-full h-1 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-1 rounded-full transition-all duration-1000 ease-out"
                        style={{
                          width: '0%',
                          animationDelay: `${index * 0.2}s`,
                          animation: 'progress-fill 1s ease-out forwards'
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Floating particles effect */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-2 h-2 bg-purple-400 rounded-full animate-ping"
                        style={{
                          animationDelay: `${i * 0.2}s`,
                          animationDuration: '1.5s',
                          left: `${Math.random() * 20}px`,
                          top: `${Math.random() * 20}px`,
                        }}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <style jsx>{`
            @keyframes progress-fill {
              from { width: 0%; }
              to { width: 85%; }
            }

            .project-card:hover {
              transform: translateY(-8px) scale(1.02);
            }

            .project-card:hover img {
              filter: brightness(1.1) contrast(1.1);
            }
          `}</style>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 bg-gradient-to-r from-purple-900 via-pink-900 to-purple-900 border-t border-white/10">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-4 text-white/90 font-light">&copy; 2024 PRAKASH LEENA. All rights reserved.</p>
          <div className="flex justify-center space-x-6">
            <a
              href="https://github.com/PrakashLeena"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-300 hover:text-purple-200 transition-all duration-300 transform hover:scale-110 text-2xl"
            >
              <i className="fab fa-github"></i>
            </a>
            <a
              href="https://www.linkedin.com/in/kiboxson-leena5111"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-300 hover:text-pink-200 transition-all duration-300 transform hover:scale-110 text-2xl"
            >
              <i className="fab fa-linkedin"></i>
            </a>
            <a
              href="https://wa.me/+94-701269689"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-300 hover:text-purple-200 transition-all duration-300 transform hover:scale-110 text-2xl"
            >
              <i className="fab fa-whatsapp"></i>
            </a>
          </div>
        </div>
      </footer>

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

export default Projects;
