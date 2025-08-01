import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Bed, Bath, Square, MapPin, ChevronLeft, ChevronRight, 
  Camera, Heart, Download
} from 'lucide-react'
import { PropertyWithImages } from '../hooks/useProperties'

interface PropertyCardProps {
  property: PropertyWithImages
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLiked, setIsLiked] = useState(false)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const nextImage = () => {
    if (property.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % property.images.length)
    }
  }

  const prevImage = () => {
    if (property.images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length)
    }
  }

  const currentImage = property.images[currentImageIndex]
  const fallbackImage = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop'

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300 group">
      {/* Image Section */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={currentImage?.image_url || fallbackImage}
          alt={currentImage?.alt_text || property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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

        {/* Status Badge */}
        {property.status === 'sold' && (
          <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
            SOLD
          </div>
        )}
        
        {property.status === 'pending' && (
          <div className="absolute top-4 left-4 bg-yellow-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
            PENDING
          </div>
        )}

        {/* Price Badge */}
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-slate-900 px-3 py-2 rounded-full font-bold shadow-lg">
          {formatPrice(property.price)}
        </div>

        {/* Like Button */}
        <button
          onClick={() => setIsLiked(!isLiked)}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100"
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'text-red-500 fill-current' : 'text-slate-600'}`} />
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title and Location */}
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
            {property.title}
          </h3>
          <div className="flex items-center text-slate-600">
            <MapPin className="w-4 h-4 mr-2 text-blue-600" />
            <span className="text-sm">
              {property.address}, {property.city}, {property.state} {property.zip_code}
            </span>
          </div>
        </div>

        {/* Property Details */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="flex items-center space-x-2 text-slate-600 bg-slate-50 px-3 py-2 rounded-lg">
            <Bed className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium">{property.bedrooms}</span>
            <span className="text-xs text-slate-500">Beds</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-600 bg-slate-50 px-3 py-2 rounded-lg">
            <Bath className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium">{property.bathrooms}</span>
            <span className="text-xs text-slate-500">Baths</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-600 bg-slate-50 px-3 py-2 rounded-lg">
            <Square className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium">{property.square_feet.toLocaleString()}</span>
            <span className="text-xs text-slate-500">Sq Ft</span>
          </div>
        </div>

        {/* Features */}
        {property.features && property.features.length > 0 && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {property.features.slice(0, 3).map((feature, index) => (
                <span
                  key={index}
                  className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium"
                >
                  {feature}
                </span>
              ))}
              {property.features.length > 3 && (
                <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-medium">
                  +{property.features.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* CTA Buttons */}
        <div className="flex space-x-3">
          <Link
            to={`/homes/${property.id}`}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 text-center"
          >
            View Details
          </Link>
          {property.floor_plan_url && (
            <a
              href={property.floor_plan_url}
              download
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center"
            >
              <Download className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default PropertyCard