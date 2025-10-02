import React from 'react';
import Dynamicbg from './components/Dynamicbg';
import Portfolio from './components/Portfolio';
import Projects from './components/Projects';
import Certifications from './components/Certifications';
import Articles from './components/Articles';
import AdminDashboard from './components/AdminDashboard';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="relative min-h-screen">
      <Dynamicbg />
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/certifications" element={<Certifications />} />
        <Route path="/articles" element={<Articles />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </div>
  );
}

export default App;
