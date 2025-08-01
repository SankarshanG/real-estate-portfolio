import React from 'react'
import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, Home as HomeIcon, Facebook, Instagram, Twitter } from 'lucide-react'

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <HomeIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Highland Homes</h3>
                <p className="text-sm text-slate-400">Premium Real Estate</p>
              </div>
            </div>
            <p className="text-slate-400 mb-6 leading-relaxed">
              Building exceptional homes and communities for over 25 years. 
              We specialize in luxury real estate with premium amenities.
            </p>
            <div className="flex space-x-4">
              <a href="/#" className="w-10 h-10 bg-slate-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors duration-200">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="/#" className="w-10 h-10 bg-slate-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors duration-200">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="/#" className="w-10 h-10 bg-slate-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors duration-200">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-slate-400 hover:text-white transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/homes" className="text-slate-400 hover:text-white transition-colors duration-200">
                  Available Homes
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-400 hover:text-white transition-colors duration-200">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-400 hover:text-white transition-colors duration-200">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Our Services</h4>
            <ul className="space-y-3">
              <li>
                <a href="/#" className="text-slate-400 hover:text-white transition-colors duration-200">
                  New Construction
                </a>
              </li>
              <li>
                <a href="/#" className="text-slate-400 hover:text-white transition-colors duration-200">
                  Custom Homes
                </a>
              </li>
              <li>
                <a href="/#" className="text-slate-400 hover:text-white transition-colors duration-200">
                  Property Management
                </a>
              </li>
              <li>
                <a href="/#" className="text-slate-400 hover:text-white transition-colors duration-200">
                  Investment Properties
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Get In Touch</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-blue-400 mt-1" />
                <div>
                  <p className="text-white font-medium">Visit Our Office</p>
                  <p className="text-slate-400 text-sm">4400 State Hwy 121</p>
                  <p className="text-slate-400 text-sm">Suite 410</p>
                  <p className="text-slate-400 text-sm">Lewisville, TX 75056</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-white font-medium">(972) 410-5701</p>
                  <p className="text-slate-400 text-sm">Call us today</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-white font-medium">info@premiumrealestate.com</p>
                  <p className="text-slate-400 text-sm">Send us an email</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400 text-sm">
              © {currentYear} Highland Homes. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm mt-4 md:mt-0">
              <a href="/#" className="text-slate-400 hover:text-white transition-colors duration-200">
                Privacy Policy
              </a>
              <a href="/#" className="text-slate-400 hover:text-white transition-colors duration-200">
                Terms of Service
              </a>
              <a href="/#" className="text-slate-400 hover:text-white transition-colors duration-200">
                Equal Housing Opportunity
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer