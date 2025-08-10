import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';
import { ContactForm } from '../types';

const ContactPage: React.FC = () => {
  const [contactForm, setContactForm] = useState<ContactForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact form submitted:', contactForm);
    alert('Thank you for your message! We will get back to you soon.');
    setContactForm({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      message: '',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-900 to-primary-700 text-white py-16">
        <div className="container-max px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Contact Us
            </h1>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              Ready to find your dream home? Get in touch with our team today. 
              We're here to help you every step of the way.
            </p>
          </div>
        </div>
      </section>

      <div className="container-max px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={contactForm.firstName}
                      onChange={(e) => setContactForm(prev => ({ ...prev, firstName: e.target.value }))}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={contactForm.lastName}
                      onChange={(e) => setContactForm(prev => ({ ...prev, lastName: e.target.value }))}
                      className="input-field"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={contactForm.phone}
                    onChange={(e) => setContactForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    value={contactForm.message}
                    onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                    className="input-field h-32 resize-none"
                    placeholder="Tell us about your dream home, preferred location, or any questions you have..."
                  />
                </div>

                <button type="submit" className="w-full btn-primary">
                  <Send className="w-5 h-5 mr-2" />
                  Send Message
                </button>
              </form>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Main Office */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Main Office</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="w-6 h-6 text-primary-600 mr-4 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Premium Real Estate</h3>
                    <p className="text-gray-600">4400 State Hwy 121</p>
                    <p className="text-gray-600">Suite 410</p>
                    <p className="text-gray-600">Lewisville, TX 75056</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Phone className="w-6 h-6 text-primary-600 mr-4" />
                  <span className="text-gray-600">(972) 410-5701</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-6 h-6 text-primary-600 mr-4" />
                  <span className="text-gray-600">info@premiumrealestate.com</span>
                </div>
                <div className="flex items-start">
                  <Clock className="w-6 h-6 text-primary-600 mr-4 mt-1" />
                  <div>
                    <p className="text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM</p>
                    <p className="text-gray-600">Saturday: 10:00 AM - 4:00 PM</p>
                    <p className="text-gray-600">Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Contact */}
            <div className="bg-primary-600 text-white rounded-lg p-8">
              <h3 className="text-xl font-semibold mb-4">Need Immediate Assistance?</h3>
              <p className="mb-6 text-primary-100">
                Our team is ready to help you find your perfect home. 
                Call us today for a personalized consultation.
              </p>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Phone className="w-5 h-5 mr-3" />
                  <span>(972) 410-5701</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-5 h-5 mr-3" />
                  <span>info@premiumrealestate.com</span>
                </div>
              </div>
            </div>

            {/* Services */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Our Services</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
                  <span className="text-gray-600">New Construction Homes</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
                  <span className="text-gray-600">Custom Home Building</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
                  <span className="text-gray-600">Property Tours</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
                  <span className="text-gray-600">Financing Assistance</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
                  <span className="text-gray-600">Investment Properties</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Visit Our Office</h2>
            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3345.1234567890123!2d-96.98765432109876!3d33.12345678901234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzPCsDA3JzM0LjQiTiA5NsKwNTknMTUuNiJX!5e0!3m2!1sen!2sus!4v1234567890123"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Premium Real Estate Office Location"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage; 