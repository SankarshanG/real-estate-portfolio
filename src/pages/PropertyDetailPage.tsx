import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Bed, Bath, Square, MapPin, Car, Calendar, 
  Phone, Mail, ArrowLeft, ChevronLeft, ChevronRight,
  Star, Users, Home
} from 'lucide-react';
import { properties } from '../data/properties';
import { communities } from '../data/communities';
import { ContactForm } from '../types';

const PropertyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [contactForm, setContactForm] = useState<ContactForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
    propertyId: id,
  });

  const property = properties.find(p => p.id === id);
  const community = property ? communities.find(c => c.name === property.community) : null;

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h1>
          <p className="text-gray-600 mb-6">The property you're looking for doesn't exist.</p>
          <Link to="/properties" className="btn-primary">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Properties
          </Link>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
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
            <Link to="/properties" className="hover:text-primary-600">Properties</Link>
            <span>/</span>
            <span className="text-gray-900">{property.title}</span>
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
                  src={property.images[currentImageIndex]}
                  alt={property.title}
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
                  {currentImageIndex + 1} / {property.images.length}
                </div>
              </div>

              {/* Thumbnail Navigation */}
              <div className="flex space-x-2 mt-4 overflow-x-auto">
                {property.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      index === currentImageIndex ? 'border-primary-600' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${property.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Property Details */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{property.address}, {property.city}, {property.state} {property.zipCode}</span>
                  </div>
                </div>
                <div className="mt-4 md:mt-0">
                  <div className="text-3xl font-bold text-primary-600">{formatPrice(property.price)}</div>
                  {property.isQuickMoveIn && (
                    <div className="text-green-600 text-sm font-medium">Quick Move-In Available</div>
                  )}
                </div>
              </div>

              {/* Key Features */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center">
                  <Bed className="w-5 h-5 text-primary-600 mr-2" />
                  <div>
                    <div className="font-semibold">{property.bedrooms}</div>
                    <div className="text-sm text-gray-600">Bedrooms</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <Bath className="w-5 h-5 text-primary-600 mr-2" />
                  <div>
                    <div className="font-semibold">{property.bathrooms}</div>
                    <div className="text-sm text-gray-600">Bathrooms</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <Square className="w-5 h-5 text-primary-600 mr-2" />
                  <div>
                    <div className="font-semibold">{property.squareFeet.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Square Feet</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <Car className="w-5 h-5 text-primary-600 mr-2" />
                  <div>
                    <div className="font-semibold">{property.garageSpaces || 0}</div>
                    <div className="text-sm text-gray-600">Garage</div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Description</h3>
                <p className="text-gray-600 leading-relaxed">{property.description}</p>
              </div>

              {/* Features */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {property.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
                      <span className="text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Property Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Property Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">MLS Number:</span>
                      <span className="font-medium">{property.mlsNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Floor Plan:</span>
                      <span className="font-medium">{property.floorPlan}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Year Built:</span>
                      <span className="font-medium">{property.yearBuilt || '2024'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Lot Size:</span>
                      <span className="font-medium">{property.lotSize} acres</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className="font-medium capitalize">{property.status}</span>
                    </div>
                  </div>
                </div>

                {community && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Community Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Community:</span>
                        <span className="font-medium">{community.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Location:</span>
                        <span className="font-medium">{community.city}, {community.state}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Homes:</span>
                        <span className="font-medium">{community.totalHomes}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Available:</span>
                        <span className="font-medium">{community.availableHomes}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6 sticky top-24">
              <h3 className="text-xl font-semibold mb-4">Interested in this property?</h3>
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailPage; 