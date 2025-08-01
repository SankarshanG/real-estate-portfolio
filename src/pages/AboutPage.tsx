import React from 'react';
import { Award, Users, Home, Star, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-900 to-primary-700 text-white py-16">
        <div className="container-max px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              About Premium Real Estate
            </h1>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              Building exceptional homes and communities across Texas for over 25 years. 
              We're committed to quality, innovation, and customer satisfaction.
            </p>
          </div>
        </div>
      </section>

      {/* Company Overview */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-lg text-gray-600 mb-6">
                Founded in 1999, Premium Real Estate has been at the forefront of luxury home building 
                in Texas. What started as a small family business has grown into one of the most 
                trusted names in residential construction.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                We've built over 500 homes across 15 communities, each one crafted with attention to 
                detail and a commitment to excellence. Our mission is to create not just houses, 
                but homes where families can thrive and create lasting memories.
              </p>
              <p className="text-lg text-gray-600">
                Today, we continue to innovate and push the boundaries of what's possible in home 
                design and construction, always keeping our customers' needs and dreams at the heart 
                of everything we do.
              </p>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop"
                alt="Premium Real Estate Team"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section-padding bg-gray-50">
        <div className="container-max">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">500+</div>
              <div className="text-gray-600">Homes Built</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">15</div>
              <div className="text-gray-600">Communities</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">25+</div>
              <div className="text-gray-600">Years Experience</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">98%</div>
              <div className="text-gray-600">Customer Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              These core values guide everything we do and ensure we deliver exceptional 
              homes and service to every customer.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Quality</h3>
              <p className="text-gray-600">
                We never compromise on quality. Every home we build meets the highest standards 
                of craftsmanship and materials.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Customer Focus</h3>
              <p className="text-gray-600">
                Our customers are at the heart of everything we do. We listen, understand, 
                and deliver homes that exceed expectations.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Home className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Innovation</h3>
              <p className="text-gray-600">
                We continuously innovate in design, technology, and construction methods 
                to create homes that are both beautiful and functional.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Excellence</h3>
              <p className="text-gray-600">
                We strive for excellence in every aspect of our business, from design 
                to construction to customer service.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Integrity</h3>
              <p className="text-gray-600">
                We conduct business with honesty, transparency, and ethical practices. 
                Our word is our bond.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Community</h3>
              <p className="text-gray-600">
                We're committed to building not just homes, but vibrant communities 
                where families can thrive and grow together.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-padding bg-gray-50">
        <div className="container-max">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Leadership Team</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Meet the experienced professionals who lead our company and ensure 
              every project meets our high standards.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"
                alt="John Smith"
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-semibold mb-2">John Smith</h3>
              <p className="text-primary-600 mb-3">CEO & Founder</p>
              <p className="text-gray-600 text-sm">
                With over 30 years of experience in residential construction, 
                John leads our company with vision and expertise.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <img
                src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face"
                alt="Sarah Johnson"
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-semibold mb-2">Sarah Johnson</h3>
              <p className="text-primary-600 mb-3">VP of Operations</p>
              <p className="text-gray-600 text-sm">
                Sarah oversees all construction operations and ensures 
                projects are completed on time and within budget.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"
                alt="Michael Davis"
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-semibold mb-2">Michael Davis</h3>
              <p className="text-primary-600 mb-3">VP of Sales</p>
              <p className="text-gray-600 text-sm">
                Michael leads our sales team and works closely with customers 
                to find their perfect home.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Awards & Recognition */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Awards & Recognition</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our commitment to excellence has been recognized by industry leaders 
              and satisfied customers alike.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Best Builder 2023</h3>
              <p className="text-gray-600 text-sm">Texas Home Builders Association</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Customer Choice Award</h3>
              <p className="text-gray-600 text-sm">Houston Chronicle</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Home className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Excellence in Design</h3>
              <p className="text-gray-600 text-sm">Architectural Digest</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Quality Assurance</h3>
              <p className="text-gray-600 text-sm">Better Business Bureau</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 text-white section-padding">
        <div className="container-max text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Build Your Dream Home?
          </h2>
          <p className="text-xl mb-8 text-primary-100 max-w-2xl mx-auto">
            Let our experienced team help you create the perfect home for your family. 
            Contact us today to get started.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-colors duration-200 flex items-center justify-center">
              Contact Us
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link to="/properties" className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-medium py-3 px-8 rounded-lg transition-colors duration-200">
              View Properties
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage; 