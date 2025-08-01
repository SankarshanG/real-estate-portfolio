import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bed, Bath, Square, MapPin, ArrowRight, Heart, ChevronLeft, ChevronRight,
  Camera, Calendar, Star, Zap
} from 'lucide-react';
import { Property } from '../types';

interface PropertyCardProps {
  property: Property;
  featured?: boolean;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, featured = false }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatAddress = (address: string, city: string, state: string) => {
    return `${address}, ${city}, ${state}`;
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  return (
    <div className={`card-property group ${featured ? 'lg:col-span-2' : ''}`}>
      {/* Image Gallery */}
      <div className="relative overflow-hidden">
        <div className="relative h-64 md:h-72">
          <img
            src={property.images[currentImageIndex]}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          
          {/* Image Navigation */}
          {property.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              
              {/* Image Counter */}
              <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded-full text-xs flex items-center space-x-1">
                <Camera className="w-3 h-3" />
                <span>{currentImageIndex + 1}/{property.images.length}</span>
              </div>
            </>
          )}

          {/* Badges */}
          {property.isQuickMoveIn && (
            <div className="property-badge">
              <Zap className="w-3 h-3 mr-1" />
              Quick Move-In
            </div>
          )}
          
          <div className="price-badge">
            {formatPrice(property.price)}
          </div>

          {/* Like Button */}
          <button
            onClick={() => setIsLiked(!isLiked)}
            className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100"
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'text-red-500 fill-current' : 'text-gray-600'}`} />
          </button>

          {/* Status Badge */}
          <div className="absolute bottom-3 left-3 bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            {property.status === 'available' ? 'Available' : property.status}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title and Location */}
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-slate-900 mb-2 group-hover:text-amber-700 transition-colors duration-300 font-serif">
            {property.title}
          </h3>
          <div className="flex items-center text-slate-600">
            <MapPin className="w-4 h-4 mr-2 text-amber-600" />
            <span className="text-sm">
              {formatAddress(property.address, property.city, property.state)}
            </span>
          </div>
        </div>

        {/* Property Details */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="property-feature">
            <Bed className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-medium">{property.bedrooms}</span>
            <span className="text-xs text-slate-500">Beds</span>
          </div>
          <div className="property-feature">
            <Bath className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-medium">{property.bathrooms}</span>
            <span className="text-xs text-slate-500">Baths</span>
          </div>
          <div className="property-feature">
            <Square className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-medium">{property.squareFeet.toLocaleString()}</span>
            <span className="text-xs text-slate-500">Sq Ft</span>
          </div>
        </div>

        {/* Community and Year */}
        <div className="flex items-center justify-between mb-4 text-sm">
          <div>
            <span className="text-slate-500">Community:</span>
            <span className="font-medium text-slate-700 ml-1">{property.community}</span>
          </div>
          {property.yearBuilt && (
            <div className="flex items-center text-slate-500">
              <Calendar className="w-4 h-4 mr-1" />
              <span>{property.yearBuilt}</span>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {property.features.slice(0, 3).map((feature, index) => (
              <span
                key={index}
                className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-medium"
              >
                {feature}
              </span>
            ))}
            {property.features.length > 3 && (
              <span className="bg-gray-100 text-slate-600 px-3 py-1 rounded-full text-xs font-medium">
                +{property.features.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex space-x-3">
          <Link
            to={`/properties/${property.id}`}
            className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center group"
          >
            View Details
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
          <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 px-4 rounded-lg transition-all duration-300">
            Schedule Tour
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;