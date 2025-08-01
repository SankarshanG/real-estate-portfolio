import React from 'react';
import { Link } from 'react-router-dom';
import { Bed, Bath, Square, MapPin, ArrowRight } from 'lucide-react';
import { Property } from '../types';

interface PropertyCardProps {
  property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
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

  return (
    <div className="card group hover:shadow-xl transition-shadow duration-300">
      {/* Image */}
      <div className="relative overflow-hidden">
        <img
          src={property.images[0]}
          alt={property.title}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {property.isQuickMoveIn && (
          <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            Quick Move-In
          </div>
        )}
        <div className="absolute top-4 right-4 bg-white text-gray-900 px-3 py-1 rounded-full text-sm font-medium">
          {property.status === 'available' ? 'Available' : property.status}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Price */}
        <div className="text-2xl font-bold text-primary-600 mb-2">
          {formatPrice(property.price)}
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
          {property.title}
        </h3>

        {/* Address */}
        <div className="flex items-center text-gray-600 mb-4">
          <MapPin className="w-4 h-4 mr-2" />
          <span className="text-sm">
            {formatAddress(property.address, property.city, property.state)}
          </span>
        </div>

        {/* Property Details */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-gray-600">
              <Bed className="w-4 h-4 mr-1" />
              <span className="text-sm">{property.bedrooms} Beds</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Bath className="w-4 h-4 mr-1" />
              <span className="text-sm">{property.bathrooms} Baths</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Square className="w-4 h-4 mr-1" />
              <span className="text-sm">{property.squareFeet.toLocaleString()} Sq Ft</span>
            </div>
          </div>
        </div>

        {/* Community */}
        <div className="text-sm text-gray-600 mb-4">
          <span className="font-medium">Community:</span> {property.community}
        </div>

        {/* Features */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {property.features.slice(0, 3).map((feature, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
              >
                {feature}
              </span>
            ))}
            {property.features.length > 3 && (
              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                +{property.features.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* CTA Button */}
        <Link
          to={`/properties/${property.id}`}
          className="w-full btn-primary flex items-center justify-center group-hover:bg-primary-700 transition-colors"
        >
          View Details
          <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
      </div>
    </div>
  );
};

export default PropertyCard; 