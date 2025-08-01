import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Home, MapPin, Star, Users, Award } from 'lucide-react';
import { properties } from '../data/properties';
import { communities } from '../data/communities';
import PropertyCard from '../components/PropertyCard';
import CommunityCard from '../components/CommunityCard';

const HomePage: React.FC = () => {
  const featuredProperties = properties.slice(0, 3);
  const featuredCommunities = communities.slice(0, 3);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-900 to-primary-700 text-white">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative container-max section-padding">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Discover Your Dream Home in
                <span className="text-primary-300"> Texas</span>
              </h1>
              <p className="text-xl mb-8 text-gray-200">
                Explore luxury homes and premier communities across the Lone Star State. 
                From modern townhomes to sprawling estates, find the perfect place to call home.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/properties" className="btn-primary text-center">
                  View Properties
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <Link to="/contact" className="btn-secondary text-center">
                  Contact Us
                </Link>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop"
                alt="Luxury Home"
                className="rounded-lg shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white text-gray-900 p-4 rounded-lg shadow-lg">
                <div className="text-2xl font-bold text-primary-600">$849,000</div>
                <div className="text-sm text-gray-600">Starting from</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="bg-white py-12">
        <div className="container-max px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">500+</div>
              <div className="text-gray-600">Homes Built</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">15</div>
              <div className="text-gray-600">Communities</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">98%</div>
              <div className="text-gray-600">Customer Satisfaction</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">25+</div>
              <div className="text-gray-600">Years Experience</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="section-padding bg-gray-50">
        <div className="container-max">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Properties
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our latest luxury homes available for quick move-in. 
              Each property features premium finishes and exceptional locations.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
          
          <div className="text-center">
            <Link to="/properties" className="btn-primary">
              View All Properties
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Premium Real Estate
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're committed to delivering exceptional homes and outstanding service 
              to every client we serve.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Home className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Quality Construction</h3>
              <p className="text-gray-600">
                Every home is built with premium materials and expert craftsmanship, 
                ensuring lasting quality and value.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Prime Locations</h3>
              <p className="text-gray-600">
                Our communities are strategically located near top schools, shopping, 
                and major highways for ultimate convenience.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Expert Service</h3>
              <p className="text-gray-600">
                Our experienced team provides personalized service throughout 
                your home buying journey.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Premium Amenities</h3>
              <p className="text-gray-600">
                Enjoy resort-style amenities including pools, fitness centers, 
                and community spaces in our developments.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Award-Winning</h3>
              <p className="text-gray-600">
                Recognized for excellence in home building and customer satisfaction 
                across Texas.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Home className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Quick Move-In</h3>
              <p className="text-gray-600">
                Many of our homes are move-in ready, allowing you to settle into 
                your new home quickly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Communities */}
      <section className="section-padding bg-gray-50">
        <div className="container-max">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Premier Communities
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore our carefully planned communities featuring luxury amenities, 
              excellent schools, and convenient locations.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredCommunities.map((community) => (
              <CommunityCard key={community.id} community={community} />
            ))}
          </div>
          
          <div className="text-center">
            <Link to="/communities" className="btn-primary">
              View All Communities
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 text-white section-padding">
        <div className="container-max text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Find Your Dream Home?
          </h2>
          <p className="text-xl mb-8 text-primary-100 max-w-2xl mx-auto">
            Contact our team today to schedule a tour or learn more about our 
            available properties and communities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-colors duration-200">
              Contact Us
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

export default HomePage; 