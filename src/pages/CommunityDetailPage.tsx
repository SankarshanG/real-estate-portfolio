import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, Home, Users, Star, ArrowLeft, ChevronLeft, ChevronRight,
  Phone, Mail, Calendar, Award
} from 'lucide-react';
import { communities } from '../data/communities';
import { properties } from '../data/properties';
import { ContactForm } from '../types';

const CommunityDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [contactForm, setContactForm] = useState<ContactForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
    communityId: id,
  });

  const community = communities.find(c => c.id === id);
  const communityProperties = community ? properties.filter(p => p.community === community.name) : [];

  if (!community) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Community Not Found</h1>
          <p className="text-gray-600 mb-6">The community you're looking for doesn't exist.</p>
          <Link to="/communities" className="btn-primary">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Communities
          </Link>
        </div>
      </div>
    );
  }

  const formatPriceRange = (min: number, max: number) => {
    const formatPrice = (price: number) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(price);
    };
    return `${formatPrice(min)} - ${formatPrice(max)}`;
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === community.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? community.images.length - 1 : prev - 1
    );
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact form submitted:', contactForm);
    alert('Thank you for your interest! We will contact you soon.');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-max px-4 py-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-primary-600">Home</Link>
            <span>/</span>
            <Link to="/communities" className="hover:text-primary-600">Communities</Link>
            <span>/</span>
            <span className="text-gray-900">{community.name}</span>
          </div>
        </div>
      </div>

      <div className="container-max px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="relative mb-8">
              <div className="relative h-96 md:h-[500px] rounded-lg overflow-hidden">
                <img
                  src={community.images[currentImageIndex]}
                  alt={community.name}
                  className="w-full h-full object-cover"
                />
                
                {/* Navigation Arrows */}
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                {/* Image Counter */}
                <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {community.images.length}
                </div>
              </div>

              {/* Thumbnail Navigation */}
              <div className="flex space-x-2 mt-4 overflow-x-auto">
                {community.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      index === currentImageIndex ? 'border-primary-600' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${community.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Community Details */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{community.name}</h1>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{community.city}, {community.state}</span>
                  </div>
                </div>
                <div className="mt-4 md:mt-0 text-right">
                  <div className="text-2xl font-bold text-primary-600">
                    {formatPriceRange(community.priceRange.min, community.priceRange.max)}
                  </div>
                  <div className="text-sm text-gray-600">Price Range</div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">About This Community</h3>
                <p className="text-gray-600 leading-relaxed">{community.description}</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Home className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{community.totalHomes}</div>
                  <div className="text-sm text-gray-600">Total Homes</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Users className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{community.availableHomes}</div>
                  <div className="text-sm text-gray-600">Available</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Star className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">
                    {community.schools.length > 0 
                      ? Math.round(community.schools.reduce((sum, school) => sum + school.rating, 0) / community.schools.length)
                      : 'N/A'
                    }
                  </div>
                  <div className="text-sm text-gray-600">School Rating</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Award className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{community.amenities.length}</div>
                  <div className="text-sm text-gray-600">Amenities</div>
                </div>
              </div>

              {/* Amenities */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Community Amenities</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {community.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
                      <span className="text-gray-600">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Schools */}
              {community.schools.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Nearby Schools</h3>
                  <div className="space-y-3">
                    {community.schools.map((school, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium">{school.name}</div>
                          <div className="text-sm text-gray-600 capitalize">{school.type} School</div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-500 mr-1" />
                            <span className="font-medium">{school.rating}/10</span>
                          </div>
                          <div className="text-sm text-gray-600">{school.distance} miles</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Available Properties */}
            {communityProperties.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-semibold mb-4">Available Properties in {community.name}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {communityProperties.slice(0, 4).map((property) => (
                    <Link
                      key={property.id}
                      to={`/properties/${property.id}`}
                      className="block p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all"
                    >
                      <div className="flex items-center space-x-4">
                        <img
                          src={property.images && property.images.length > 0 ? property.images[0] : '/placeholder-property.jpg'}
                          alt={property.title}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{property.title}</h4>
                          <div className="text-sm text-gray-600">
                            {property.bedrooms} beds, {property.bathrooms || 0} baths, {(property.squareFeet || property.sqft || 0).toLocaleString()} sq ft
                          </div>
                          <div className="text-lg font-bold text-primary-600">
                            ${property.price.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                {communityProperties.length > 4 && (
                  <div className="text-center mt-4">
                    <Link to="/properties" className="btn-primary">
                      View All Properties
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6 sticky top-24">
              <h3 className="text-xl font-semibold mb-4">Interested in this community?</h3>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="First Name"
                    value={contactForm.firstName}
                    onChange={(e) => setContactForm(prev => ({ ...prev, firstName: e.target.value }))}
                    className="input-field"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={contactForm.lastName}
                    onChange={(e) => setContactForm(prev => ({ ...prev, lastName: e.target.value }))}
                    className="input-field"
                    required
                  />
                </div>
                <input
                  type="email"
                  placeholder="Email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                  className="input-field"
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  value={contactForm.phone}
                  onChange={(e) => setContactForm(prev => ({ ...prev, phone: e.target.value }))}
                  className="input-field"
                  required
                />
                <textarea
                  placeholder="Message (optional)"
                  value={contactForm.message}
                  onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                  className="input-field h-24 resize-none"
                />
                <button type="submit" className="w-full btn-primary">
                  Contact Us
                </button>
              </form>
            </div>

            {/* Quick Contact */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Contact</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-primary-600 mr-3" />
                  <span className="text-gray-600">(972) 410-5701</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-primary-600 mr-3" />
                  <span className="text-gray-600">info@premiumrealestate.com</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-primary-600 mr-3" />
                  <span className="text-gray-600">Schedule a Tour</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityDetailPage; 