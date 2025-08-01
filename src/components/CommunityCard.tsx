import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, Home, Users, ArrowRight, Star, 
  Heart, Camera, ChevronLeft, ChevronRight,
  GraduationCap, TreePine
} from 'lucide-react';
import { Community } from '../types';

interface CommunityCardProps {
  community: Community;
}

const CommunityCard: React.FC<CommunityCardProps> = ({ community }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % community.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + community.images.length) % community.images.length);
  };

  return (
    <div className="card group">
      {/* Image Gallery */}
      <div className="relative overflow-hidden">
        <div className="relative h-56">
          <img
            src={community.images[currentImageIndex]}
            alt={community.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          
          {/* Image Navigation */}
          {community.images.length > 1 && (
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
                <span>{currentImageIndex + 1}/{community.images.length}</span>
              </div>
            </>
          )}

          {/* Available Homes Badge */}
          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-slate-900 px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
            {community.availableHomes} Available
          </div>

          {/* Like Button */}
          <button
            onClick={() => setIsLiked(!isLiked)}
            className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100"
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'text-red-500 fill-current' : 'text-gray-600'}`} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title and Location */}
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-slate-900 mb-2 group-hover:text-amber-700 transition-colors duration-300 font-serif">
            {community.name}
          </h3>
          <div className="flex items-center text-slate-600">
            <MapPin className="w-4 h-4 mr-2 text-amber-600" />
            <span className="text-sm">{community.city}, {community.state}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-slate-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {community.description}
        </p>

        {/* Price Range */}
        <div className="mb-4">
          <div className="text-2xl font-bold text-amber-600 mb-1">
            {formatPriceRange(community.priceRange.min, community.priceRange.max)}
          </div>
          <div className="text-sm text-slate-500">Starting Price Range</div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <Home className="w-5 h-5 text-amber-600 mx-auto mb-1" />
            <div className="text-lg font-bold text-slate-900">{community.totalHomes}</div>
            <div className="text-xs text-slate-500">Total Homes</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <Users className="w-5 h-5 text-amber-600 mx-auto mb-1" />
            <div className="text-lg font-bold text-slate-900">{community.availableHomes}</div>
            <div className="text-xs text-slate-500">Available</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <GraduationCap className="w-5 h-5 text-amber-600 mx-auto mb-1" />
            <div className="text-lg font-bold text-slate-900">
              {community.schools.length > 0 ? `${getAverageSchoolRating()}/10` : 'N/A'}
            </div>
            <div className="text-xs text-slate-500">School Rating</div>
          </div>
        </div>

        {/* Key Amenities */}
        <div className="mb-6">
          <h4 className="font-semibold text-slate-900 mb-3 flex items-center">
            <TreePine className="w-4 h-4 mr-2 text-amber-600" />
            Key Amenities
          </h4>
          <div className="flex flex-wrap gap-2">
            {community.amenities.slice(0, 4).map((amenity, index) => (
              <span
                key={index}
                className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-medium"
              >
                {amenity}
              </span>
            ))}
            {community.amenities.length > 4 && (
              <span className="bg-gray-100 text-slate-600 px-3 py-1 rounded-full text-xs font-medium">
                +{community.amenities.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex space-x-3">
          <Link
            to={`/communities/${community.id}`}
            className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center group"
          >
            Explore Community
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
          <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 px-4 rounded-lg transition-all duration-300">
            Schedule Visit
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommunityCard;