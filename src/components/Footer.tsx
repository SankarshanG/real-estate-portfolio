import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="container-max section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <div>
                <h3 className="text-lg font-bold">Premium Real Estate</h3>
                <p className="text-sm text-gray-400">Luxury Homes & Communities</p>
              </div>
            </div>
            <p className="text-gray-400 mb-6">
              Discover exceptional homes and communities across Texas. We specialize in luxury real estate 
              with premium amenities and outstanding locations.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://instagram.com" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://twitter.com" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/properties" className="text-gray-400 hover:text-white transition-colors">
                  Properties
                </Link>
              </li>
              <li>
                <Link to="/communities" className="text-gray-400 hover:text-white transition-colors">
                  Communities
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              <li>
                <a href="/services/new-construction" className="text-gray-400 hover:text-white transition-colors">
                  New Construction
                </a>
              </li>
              <li>
                <a href="/services/custom-homes" className="text-gray-400 hover:text-white transition-colors">
                  Custom Homes
                </a>
              </li>
              <li>
                <a href="/services/investment-properties" className="text-gray-400 hover:text-white transition-colors">
                  Investment Properties
                </a>
              </li>
              <li>
                <a href="/services/property-management" className="text-gray-400 hover:text-white transition-colors">
                  Property Management
                </a>
              </li>
              <li>
                <a href="/services/financing" className="text-gray-400 hover:text-white transition-colors">
                  Financing Options
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary-400 mt-0.5" />
                <div>
                  <p className="text-gray-400">4400 State Hwy 121</p>
                  <p className="text-gray-400">Suite 410</p>
                  <p className="text-gray-400">Lewisville, TX 75056</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary-400" />
                <span className="text-gray-400">(972) 410-5701</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary-400" />
                <span className="text-gray-400">info@premiumrealestate.com</span>
              </div>
            </div>
            
            <div className="mt-6">
              <h5 className="font-semibold mb-2">Office Hours</h5>
              <p className="text-gray-400 text-sm">Mon-Fri: 9AM-6PM</p>
              <p className="text-gray-400 text-sm">Sat: 10AM-4PM</p>
              <p className="text-gray-400 text-sm">Sun: Closed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container-max px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © 2025 Premium Real Estate. All Rights Reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <a href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="/terms-of-service" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="/equal-housing-opportunity" className="text-gray-400 hover:text-white transition-colors">
                Equal Housing Opportunity
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 