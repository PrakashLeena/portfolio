import React, { useState } from 'react';

const Dynamicbg = () => {
  const [floatingShapes] = useState(() => 
    [...Array(8)].map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 60 + 20,
      delay: Math.random() * 6,
      duration: Math.random() * 4 + 4,
    }))
  );

  const [driftingParticles] = useState(() => 
    [...Array(15)].map((_, i) => ({
      id: i,
      top: Math.random() * 100,
      size: Math.random() * 4 + 2,
      delay: Math.random() * 10,
      duration: Math.random() * 8 + 10,
      reverse: Math.random() > 0.5,
    }))
  );

  const [glowOrbs] = useState(() => 
    [...Array(5)].map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 100 + 50,
      delay: Math.random() * 3,
    }))
  );

  return (
    <>
      {/* Dynamic Moving Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {/* Animated Gradient Background */}
        <div 
          className="absolute inset-0 opacity-90 animate-gradient-shift"
          style={{
            background: 'linear-gradient(-45deg, #150734, #2d1b69, #4a2c85, #5e42a6, #b74e91)',
            backgroundSize: '400% 400%',
          }}
        ></div>

        {/* Radial gradient overlays for depth */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 20% 80%, rgba(255, 174, 66, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 174, 66, 0.1) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(255, 255, 255, 0.05) 0%, transparent 50%)',
            animation: 'backgroundPulse 20s ease-in-out infinite',
          }}
        ></div>
        
        {/* Floating Geometric Shapes */}
        <div className="absolute inset-0">
          {floatingShapes.map((shape) => (
            <div
              key={shape.id}
              className="absolute opacity-20 animate-float"
              style={{
                left: `${shape.left}%`,
                top: `${shape.top}%`,
                width: `${shape.size}px`,
                height: `${shape.size}px`,
                animationDelay: `${shape.delay}s`,
                animationDuration: `${shape.duration}s`,
              }}
            >
              <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-500 rounded-full animate-rotate-slow"></div>
            </div>
          ))}
        </div>

        {/* Drifting Particles */}
        <div className="absolute inset-0">
          {driftingParticles.map((particle) => (
            <div
              key={particle.id}
              className={`absolute rounded-full opacity-40 ${
                particle.reverse ? 'animate-drift-reverse' : 'animate-drift'
              }`}
              style={{
                top: `${particle.top}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                background: 'rgba(255, 174, 66, 0.3)',
                animationDelay: `${particle.delay}s`,
                animationDuration: `${particle.duration}s`,
              }}
            ></div>
          ))}
        </div>

        {/* Glowing Orbs */}
        <div className="absolute inset-0">
          {glowOrbs.map((orb) => (
            <div
              key={orb.id}
              className="absolute rounded-full animate-pulse-glow"
              style={{
                left: `${orb.left}%`,
                top: `${orb.top}%`,
                width: `${orb.size}px`,
                height: `${orb.size}px`,
                background: 'radial-gradient(circle, rgba(183, 78, 145, 0.3) 0%, rgba(94, 66, 166, 0.2) 50%, transparent 100%)',
                animationDelay: `${orb.delay}s`,
              }}
            ></div>
          ))}
        </div>

        {/* Moving Wave Lines */}
        <div className="absolute inset-0">
          <svg className="w-full h-full opacity-10" viewBox="0 0 1200 800" preserveAspectRatio="none">
            <path
              d="M0,400 Q300,200 600,400 T1200,400 V800 H0 Z"
              fill="url(#wave-gradient)"
              className="animate-float-slow"
            />
            <path
              d="M0,500 Q400,300 800,500 T1600,500 V800 H0 Z"
              fill="url(#wave-gradient-2)"
              className="animate-float-fast"
            />
            <defs>
              <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#5e42a6" stopOpacity="0.3" />
                <stop offset="50%" stopColor="#b74e91" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#5e42a6" stopOpacity="0.3" />
              </linearGradient>
              <linearGradient id="wave-gradient-2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#b74e91" stopOpacity="0.2" />
                <stop offset="50%" stopColor="#953d75" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#b74e91" stopOpacity="0.2" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Twinkling Stars */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse-glow"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${Math.random() * 2 + 2}s`,
              }}
            ></div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Dynamicbg;
