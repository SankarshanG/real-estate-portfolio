import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { properties } from '../data/properties';
import { communities } from '../data/communities';
import PropertyCard from '../components/PropertyCard';
import CommunityCard from '../components/CommunityCard';
import Gallery from '../components/Gallery';
import BlogSection from '../components/BlogSection';
import SEO from '../components/SEO';

const HomePage: React.FC = () => {
  const featuredProperties = properties.slice(0, 3);
  const featuredCommunities = communities.slice(0, 3);

  return (
    <div>
              <SEO
          title="Premium Real Estate Properties | Luxury Homes & Investment Properties"
          description="Discover luxury homes and investment properties across Texas. Find your dream home with Premium Real Estate Properties."
          keywords="Texas real estate, luxury homes, premium properties, investment properties, Texas homes for sale, luxury communities"
          url="https://your-domain.com/"
          type="website"
        />
      {/* Hero Section */}
      <section className="relative h-screen">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1920&h=1080&fit=crop"
            alt="Luxury Home"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black opacity-30"></div>
        </div>
        
        {/* Content Overlay */}
        <div className="relative h-full flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-4">
              Premium Real Estate
            </h1>
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-8">
              Properties
            </h2>
            <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto">
              Discover luxury homes and investment properties across Texas
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/properties" className="bg-primary-600 text-white px-8 py-3 rounded font-medium hover:bg-primary-700 transition-colors flex items-center justify-center">
                <span>View Properties</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link to="/contact" className="bg-white text-gray-800 px-8 py-3 rounded font-medium hover:bg-gray-100 transition-colors flex items-center justify-center">
                <span>Contact Us</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="bg-white border-b border-gray-200">
        <div className="container-max px-4">
          <div className="flex space-x-1">
            <Link to="/properties" className="px-6 py-4 text-gray-600 hover:text-gray-900 font-medium border-b-2 border-transparent hover:border-gray-300 transition-colors">
              Properties
            </Link>
            <Link to="/gallery" className="px-6 py-4 text-gray-600 hover:text-gray-900 font-medium border-b-2 border-transparent hover:border-gray-300 transition-colors">
              Gallery
            </Link>
            <Link to="/floor-plans" className="px-6 py-4 text-gray-900 font-medium border-b-2 border-primary-600 bg-primary-50">
              Floor Plans
            </Link>
            <Link to="/communities" className="px-6 py-4 text-gray-600 hover:text-gray-900 font-medium border-b-2 border-transparent hover:border-gray-300 transition-colors">
              Communities
            </Link>
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

      {/* Property Gallery */}
      <Gallery />

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

      {/* Blog Section */}
      <BlogSection />

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