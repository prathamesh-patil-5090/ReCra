import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <p className="text-sm text-gray-600">© 2025 ReCra. All Rights Reserved.</p>
        <p className="text-sm text-gray-600">
          Made with <span className="text-red-500">❤️</span> by{' '}
          <a href="https://x.com/Aid4Pratham" className="text-blue-600 hover:underline">
            Prathamesh Patil
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;