import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Home, Users, ArrowRight, Star } from 'lucide-react';
import { Community } from '../types';

interface CommunityCardProps {
  community: Community;
}

const CommunityCard: React.FC<CommunityCardProps> = ({ community }) => {
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

  const getAverageSchoolRating = () => {
    if (community.schools.length === 0) return 0;
    const total = community.schools.reduce((sum, school) => sum + school.rating, 0);
    return Math.round(total / community.schools.length);
  };

  return (
    <div className="card group hover:shadow-xl transition-shadow duration-300">
      {/* Image */}
      <div className="relative overflow-hidden">
        <img
          src={community.images[0]}
          alt={community.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4 bg-white text-gray-900 px-3 py-1 rounded-full text-sm font-medium">
          {community.availableHomes} Available
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title and Location */}
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
            {community.name}
          </h3>
          <div className="flex items-center text-gray-600">
            <MapPin className="w-4 h-4 mr-2" />
            <span className="text-sm">{community.city}, {community.state}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {community.description}
        </p>

        {/* Price Range */}
        <div className="mb-4">
          <div className="text-lg font-bold text-primary-600">
            {formatPriceRange(community.priceRange.min, community.priceRange.max)}
          </div>
          <div className="text-sm text-gray-600">Price Range</div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center">
            <Home className="w-4 h-4 text-primary-600 mr-2" />
            <div>
              <div className="text-sm font-medium text-gray-900">{community.totalHomes}</div>
              <div className="text-xs text-gray-600">Total Homes</div>
            </div>
          </div>
          <div className="flex items-center">
            <Users className="w-4 h-4 text-primary-600 mr-2" />
            <div>
              <div className="text-sm font-medium text-gray-900">{community.availableHomes}</div>
              <div className="text-xs text-gray-600">Available</div>
            </div>
          </div>
        </div>

        {/* School Rating */}
        {community.schools.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-500 mr-2" />
              <span className="text-sm text-gray-600">
                School Rating: {getAverageSchoolRating()}/10
              </span>
            </div>
          </div>
        )}

        {/* Amenities */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {community.amenities.slice(0, 3).map((amenity, index) => (
              <span
                key={index}
                className="bg-primary-50 text-primary-700 px-2 py-1 rounded text-xs"
              >
                {amenity}
              </span>
            ))}
            {community.amenities.length > 3 && (
              <span className="bg-primary-50 text-primary-700 px-2 py-1 rounded text-xs">
                +{community.amenities.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* CTA Button */}
        <Link
          to={`/communities/${community.id}`}
          className="w-full btn-primary flex items-center justify-center group-hover:bg-primary-700 transition-colors"
        >
          View Community
          <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
      </div>
    </div>
  );
};

export default CommunityCard; 