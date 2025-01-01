import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext'; // Update the import path
import NavBar from './components/NavBar';
import HomePage from './components/homePage';
import Login from './components/Login';
import SignUp from './components/SignUp';
import About from './components/About';
import ResumeCreator from './components/ResumeCreator';
import Pricing from './components/Pricing';
import Footer from './components/Footer';
import LearnMore from './components/LearnMore';
import AnalysisCards from './components/AnalysisCards';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <AuthProvider> {/* Wrap the entire app with AuthProvider */}
      <div className="min-h-screen flex flex-col">
        <NavBar brandName="ReCra" />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/about" element={<About />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/learn-more" element={<LearnMore />} />
            
            {/* Protected Routes */}
            <Route 
              path="/analyze-resume" 
              element={
                <ProtectedRoute>
                  <AnalysisCards />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/create-resume" 
              element={
                <ProtectedRoute>
                  <ResumeCreator />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
