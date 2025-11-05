import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Github, Twitter, Heart } from 'lucide-react';
import logo from '../../src/assets/logo.png'

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Browse Materials', path: '/materials' },
    { name: 'Upload Content', path: '/upload' },
    { name: 'About Us', path: '/about' },
  ];
  
  const categories = [
    { name: 'Notes', path: '/materials?type=notes' },
    { name: 'Assignments', path: '/materials?type=assignments' },
    { name: 'Practicals', path: '/materials?type=practicals' },
    { name: 'Previous Year Questions', path: '/materials?type=pyqs' },
  ];

  return (
    <footer className="bg-noto-dark dark:bg-gray-950 text-white transition-colors duration-300">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <div className="flex items-center -space-x-2 mb-4">
              <div className="w-16 h-10 rounded-lg flex items-center justify-center">
                <img src={logo} alt="Noto logo" />
              </div>
              <span className="text-2xl font-bold">NOTO</span>
            </div>
            <p className="text-gray-300 mb-6 text-sm leading-relaxed">
              Empowering students with comprehensive study materials, notes, and academic resources 
              for engineering and technical education.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-noto-secondary transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-noto-secondary transition-colors"
                aria-label="Github"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="mailto:contact@noto.com"
                className="text-gray-400 hover:text-noto-secondary transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4 text-noto-secondary">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4 text-noto-secondary">Categories</h3>
            <ul className="space-y-3">
              {categories.map((category) => (
                <li key={category.path}>
                  <Link
                    to={category.path}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        <div className="border-t border-gray-700 dark:border-gray-800 mt-12 pt-8 transition-colors duration-300">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col sm:flex-row items-center text-center sm:text-left space-y-2 sm:space-y-0 sm:space-x-2 text-gray-300 dark:text-gray-400 text-sm transition-colors duration-300">
              <div className="flex items-center space-x-2">
                <span>Made with</span>
                <Heart className="w-4 h-4 text-red-500 dark:text-red-400" />
                <span>for students</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-400 dark:text-gray-500 hidden sm:inline">•</span>
                <span className="text-noto-secondary dark:text-blue-400 font-medium text-xs sm:text-sm transition-colors duration-300">From BCA+MCA(DUAL) 2021-26</span>
              </div>
            </div>
            <div className="text-gray-300 dark:text-gray-400 text-sm text-center md:text-right transition-colors duration-300">
              <p>&copy; {currentYear} NOTO. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;