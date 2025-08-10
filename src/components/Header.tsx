import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search } from 'lucide-react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

      const navigation = [
      { 
        name: 'Properties', 
        href: '/properties',
        hasDropdown: false 
      },
      { 
        name: 'Gallery', 
        href: '/gallery',
        hasDropdown: false 
      },
      { 
        name: 'Floor Plans', 
        href: '/floor-plans',
        hasDropdown: false 
      },
      { 
        name: 'Communities', 
        href: '/communities',
        hasDropdown: false 
      },
      { 
        name: 'About', 
        href: '/about',
        hasDropdown: false 
      },
    ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Top bar - Awards, Careers, Blog, Search */}
      <div className="bg-gray-800 text-white py-2">
        <div className="container-max px-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-6">
              <Link to="/awards" className="hover:text-gray-300 transition-colors">
                Awards
              </Link>
              <Link to="/careers" className="hover:text-gray-300 transition-colors">
                Careers
              </Link>
              <Link to="/blog" className="hover:text-gray-300 transition-colors">
                Blog
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-gray-700 text-white px-3 py-1 rounded text-sm w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container-max px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="text-2xl font-bold">
              <span className="text-gray-800 font-serif">Premium Real Estate</span>
              <span className="text-primary-600 font-sans font-bold"> Properties</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`font-medium transition-colors duration-200 ${
                  isActive(item.href)
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-700 hover:text-primary-600'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link 
              to="/contact" 
              className="bg-gray-200 text-gray-800 px-6 py-2 rounded font-medium hover:bg-gray-300 transition-colors"
            >
              Contact Us
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-100"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-6 space-y-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={`block font-medium transition-colors duration-200 ${
                  isActive(item.href)
                    ? 'text-primary-600'
                    : 'text-gray-700 hover:text-primary-600'
                }`}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-gray-200">
              <Link
                to="/contact"
                onClick={() => setIsMenuOpen(false)}
                className="bg-gray-200 text-gray-800 px-6 py-2 rounded font-medium hover:bg-gray-300 transition-colors block text-center"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header; 