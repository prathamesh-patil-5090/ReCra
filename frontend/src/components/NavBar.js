import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronDown, User, LogOut } from 'lucide-react';
import { useAuth } from './context/AuthContext';
import LogoAnimation from '../animations/Vanilla@1x-1.0s-280px-250px.svg';

const NavBar = ({ menuItems }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dropdownOpenIndex, setDropdownOpenIndex] = useState(null);
  const { isAuthenticated, logout, user } = useAuth();

  const defaultMenuItems = [
    { title: 'Home', path: '/' },
    { title: 'Resume Creator', path: '/create-resume' },
    { title: 'Resume Analyzer', path: '/analyze-resume' },
    { title: 'Pricing', path: '/pricing' },
    { title: 'About', path: '/about' },
  ];

  const items = menuItems || defaultMenuItems;

  return (
    <nav className="relative bg-white border-b">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-12.5 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="h-16">
              <img src={LogoAnimation} alt="ReCra Logo" className="h-full w-auto" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-6">
              {items.map((item, index) => (
                item.submenu ? (
                  <div
                    key={item.title}
                    className="relative"
                    onMouseEnter={() => setDropdownOpenIndex(index)}
                    onMouseLeave={() => setDropdownOpenIndex(null)}
                  >
                    <button
                      className="flex items-center space-x-1 px-3 py-2 text-gray-600 hover:text-black font-medium transition-colors duration-200"
                      aria-expanded={dropdownOpenIndex === index}
                    >
                      <span>{item.title}</span>
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    {dropdownOpenIndex === index && (
                      <div className="absolute left-0 mt-2 w-48 rounded-xl bg-white py-2 shadow-lg ring-1 ring-black ring-opacity-5">
                        {item.submenu.map((subItem) => (
                          <Link
                            key={subItem.title}
                            to={subItem.path}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            {subItem.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={item.title}
                    to={item.path}
                    className="px-3 py-2 text-gray-600 hover:text-black font-medium transition-colors duration-300"
                  >
                    {item.title}
                  </Link>
                )
              ))}
            </div>
          </div>

          {/* Login and Sign-Up or Logout */}
          <div className="hidden items-center space-x-4 md:flex">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">{user?.firstName || 'User'}</span>
                <button
                  onClick={logout}
                  className="flex items-center rounded-lg bg-black px-6 py-2.5 text-white transition-colors hover:bg-gray-800 font-medium"
                >
                  <LogOut className="mr-2 h-5 w-5" />
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="flex items-center text-gray-600 hover:text-black font-medium">
                  <User className="mr-2 h-5 w-5" />
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="rounded-lg bg-black px-6 py-2.5 text-white transition-colors hover:bg-gray-800 font-medium"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
              className="inline-flex items-center justify-center rounded-lg p-2 text-gray-400 hover:bg-gray-100 transition-colors duration-200"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute w-full bg-white shadow-lg z-50">
          <div className="space-y-1 px-4 py-4">
            {items.map((item) => (
              <React.Fragment key={item.title}>
                {item.submenu ? (
                  <>
                    <div className="px-3 py-2 text-base font-medium text-gray-900">
                      {item.title}
                    </div>
                    {item.submenu.map((subItem) => (
                      <Link
                        key={subItem.title}
                        to={subItem.path}
                        onClick={() => setIsMenuOpen(false)}
                        className="block px-3 py-2 pl-8 text-base text-gray-500 hover:bg-gray-50 transition-colors duration-200"
                      >
                        {subItem.title}
                      </Link>
                    ))}
                  </>
                ) : (
                  <Link
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2 text-base text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                  >
                    {item.title}
                  </Link>
                )}
              </React.Fragment>
            ))}
            <div className="mt-4 space-y-2">
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full px-3 py-2 text-base text-white bg-black hover:bg-gray-800 rounded-lg text-center"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2 text-base text-gray-600 hover:bg-gray-50 rounded-lg"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2 text-base text-white bg-black hover:bg-gray-800 rounded-lg text-center"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
