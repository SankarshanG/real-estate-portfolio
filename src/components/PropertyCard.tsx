import React from 'react';
import { Link } from 'react-router-dom';
import { Bed, Bath, Square, MapPin, Car } from 'lucide-react';
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
    }).format(price || 0);
  };

  // Debug logging for images
  React.useEffect(() => {
    if (property.images && property.images.length > 0) {
      console.log(`PropertyCard: Property ${property.id} has ${property.images.length} images:`, property.images);
    }
  }, [property.images, property.id]);

  // Ensure we have safe defaults for all properties
  const safeProperty = {
    id: property.id || '',
    title: property.title || 'Untitled Property',
    price: property.price || 0,
    bedrooms: property.bedrooms || 0,
    bathrooms: property.bathrooms || 0,
    sqft: property.sqft || 0,
    squareFeet: property.squareFeet || property.sqft || 0,
    address: property.address || 'Address not available',
    city: property.city || 'City not available',
    state: property.state || 'State not available',
    status: property.status || 'available',
    images: property.images || [],
    features: property.features || [],
    garageSpaces: property.garageSpaces || 0,
    isQuickMoveIn: property.isQuickMoveIn || false,
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden group hover:shadow-lg transition-shadow duration-300">
      {/* Image */}
      <div className="relative overflow-hidden">
        {safeProperty.images && safeProperty.images.length > 0 ? (
          <img
            src={safeProperty.images[0]}
            alt={safeProperty.title}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}
        {/* Fallback placeholder - always present but hidden when image loads successfully */}
        <div className={`w-full h-64 bg-gray-200 flex items-center justify-center ${safeProperty.images && safeProperty.images.length > 0 ? 'hidden' : ''}`}>
          <div className="text-center">
            <div className="text-gray-400 mb-2">
              <Square className="w-12 h-12 mx-auto" />
            </div>
            <span className="text-gray-500 text-sm">No image available</span>
          </div>
        </div>
        
        {/* Quick Move-In Badge */}
        {safeProperty.isQuickMoveIn && (
          <div className="absolute top-4 left-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            Quick Move-In
          </div>
        )}
        
        {/* SOLD Overlay */}
        {safeProperty.status === 'sold' && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <div className="bg-red-600 text-white px-6 py-3 rounded-lg transform -rotate-12">
              <span className="text-2xl font-bold">SOLD</span>
            </div>
          </div>
        )}
        
        {/* Price Badge */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
          <span className="text-lg font-bold text-primary-600">{formatPrice(safeProperty.price)}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title and Address */}
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
            {safeProperty.title}
          </h3>
          <div className="flex items-center text-gray-600">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="text-sm">{safeProperty.address}, {safeProperty.city}, {safeProperty.state}</span>
          </div>
        </div>

        {/* Key Features */}
        <div className="mb-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center text-gray-600">
              <Bed className="w-4 h-4 mr-1" />
              <span className="text-sm">{safeProperty.bedrooms} Beds</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Bath className="w-4 h-4 mr-1" />
              <span className="text-sm">{safeProperty.bathrooms} Baths</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Square className="w-4 h-4 mr-1" />
              <span className="text-sm">{safeProperty.squareFeet.toLocaleString()} Sq Ft</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Car className="w-4 h-4 mr-1" />
              <span className="text-sm">{safeProperty.garageSpaces} Garage</span>
            </div>
          </div>
        </div>

        {/* Features */}
        {safeProperty.features && safeProperty.features.length > 0 && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {safeProperty.features.slice(0, 3).map((feature, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                >
                  {feature}
                </span>
              ))}
              {safeProperty.features.length > 3 && (
                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                  +{safeProperty.features.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Action Button */}
        <Link
          to={`/properties/${safeProperty.id}`}
          className="block w-full bg-primary-600 text-white text-center py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center justify-center"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default PropertyCard; 