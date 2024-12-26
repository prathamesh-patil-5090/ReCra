import React from 'react';
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import HomePage from './components/homePage';
import Login from './components/Login';
import SignUp from './components/SignUp';
import About from './components/About';
import ResumeCreator from './components/ResumeCreator';
import ResumeAnalyzer from './components/ResumeAnalyzer';
import Pricing from './components/Pricing';
import Footer from './components/Footer';
import LearnMore from './components/LearnMore';
import './App.css';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar brandName="ReCra" />
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/about" element={<About />} />
          <Route path="/create-resume" element={<ResumeCreator />} />
          <Route path="/analyze-resume" element={<ResumeAnalyzer />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/learn-more" element={<LearnMore />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
