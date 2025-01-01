import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import LogoAnimation from '../animations/Vanilla@1x-1.0s-280px-250px.svg';

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const defaultMenuItems = [
    { title: 'Home', path: '/' },
    { title: 'Resume Creator', path: '/create-resume', protected: true },
    { title: 'Resume Analyzer', path: '/analyze-resume', protected: true },
    { title: 'Pricing', path: '/pricing' },
    { title: 'About', path: '/about' },
  ];

  return (
    <nav className="relative bg-white border-b">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo - Adjusted size */}
          <div className="flex-shrink-0">
            <Link to="/" className="h-14"> {/* Changed from h-16 to h-12 */}
              <img 
                src={LogoAnimation} 
                alt="ReCra Logo" 
                className="h-full w-auto max-h-14" // Added max-h-12 and kept aspect ratio
              />
            </Link>
          </div>

          {/* Desktop Navigation - Justified */}
          <div className="hidden sm:flex flex-1 justify-center">
            <div className="flex space-x-12">
              {defaultMenuItems.map((item) => (
                (!item.protected || isAuthenticated) && (
                  <Link
                    key={item.title}
                    to={item.path}
                    className="text-gray-600 hover:text-black font-medium transition-colors duration-200 whitespace-nowrap"
                  >
                    {item.title}
                  </Link>
                )
              ))}
            </div>
          </div>

          {/* Auth Buttons */}
          <div className="hidden sm:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">Welcome, {user?.firstName || 'User'}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-gray-600 hover:text-black"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-black"
                >
                  <User className="h-5 w-5 inline-block mr-2" />
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {defaultMenuItems.map((item) => (
              (!item.protected || isAuthenticated) && (
                <Link
                  key={item.title}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 text-base text-gray-600 hover:text-black hover:bg-gray-50 rounded-md"
                >
                  {item.title}
                </Link>
              )
            ))}
            <div className="border-t border-gray-200 pt-4 pb-3">
              {isAuthenticated ? (
                <div className="space-y-1">
                  <div className="px-3 py-2 text-base text-gray-600">
                    Welcome, {user?.firstName || 'User'}
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center px-3 py-2 text-base text-gray-600 hover:text-black hover:bg-gray-50 rounded-md"
                  >
                    <LogOut className="h-5 w-5 mr-2" />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-1">
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center px-3 py-2 text-base text-gray-600 hover:text-black hover:bg-gray-50 rounded-md"
                  >
                    <User className="h-5 w-5 mr-2" />
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-center m-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
