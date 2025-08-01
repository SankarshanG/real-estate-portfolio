import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { 
  ArrowLeft, Bed, Bath, Square, Calendar, MapPin, 
  ChevronLeft, ChevronRight, Download, Share2, Heart,
  Car, Wifi, Dumbbell, Waves, TreePine, Shield
} from 'lucide-react'
import { useProperty } from '../hooks/useProperties'
import ContactForm from '../components/ContactForm'

const PropertyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { property, loading, error } = useProperty(id!)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLiked, setIsLiked] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Property Not Found</h2>
          <p className="text-slate-600 mb-6">{error || 'The property you are looking for does not exist.'}</p>
          <Link
            to="/homes"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
          >
            Back to Properties
          </Link>
        </div>
      </div>
    )
  }

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
  const fallbackImage = 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop'

  const amenityIcons = {
    'Garage': Car,
    'WiFi': Wifi,
    'Gym': Dumbbell,
    'Pool': Waves,
    'Garden': TreePine,
    'Security': Shield,
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Back Button */}
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/homes"
            className="inline-flex items-center text-slate-600 hover:text-slate-900 transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Properties
          </Link>
        </div>
      </div>

      {/* Image Carousel */}
      <div className="relative h-96 lg:h-[500px] overflow-hidden">
        <img
          src={currentImage?.image_url || fallbackImage}
          alt={currentImage?.alt_text || property.title}
          className="w-full h-full object-cover"
        />
        
        {/* Image Navigation */}
        {property.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            
            {/* Image Counter */}
            <div className="absolute bottom-6 right-6 bg-black/70 text-white px-4 py-2 rounded-full text-sm">
              {currentImageIndex + 1} / {property.images.length}
            </div>
          </>
        )}

        {/* Status Badge */}
        {property.status === 'sold' && (
          <div className="absolute top-6 left-6 bg-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
            SOLD
          </div>
        )}
        
        {property.status === 'pending' && (
          <div className="absolute top-6 left-6 bg-yellow-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
            PENDING
          </div>
        )}

        {/* Action Buttons */}
        <div className="absolute top-6 right-6 flex space-x-3">
          <button
            onClick={() => setIsLiked(!isLiked)}
            className="bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-300"
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'text-red-500 fill-current' : 'text-slate-600'}`} />
          </button>
          <button className="bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-300">
            <Share2 className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Property Header */}
            <div className="mb-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-2">
                    {property.title}
                  </h1>
                  <div className="flex items-center text-slate-600 mb-4">
                    <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                    <span className="text-lg">
                      {property.address}, {property.city}, {property.state} {property.zip_code}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl lg:text-4xl font-bold text-blue-600 mb-1">
                    {formatPrice(property.price)}
                  </div>
                  <div className="text-slate-500">
                    ${Math.round(property.price / property.square_feet)}/sq ft
                  </div>
                </div>
              </div>

              {/* Key Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 bg-slate-50 rounded-xl">
                <div className="text-center">
                  <Bed className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-slate-900">{property.bedrooms}</div>
                  <div className="text-slate-600">Bedrooms</div>
                </div>
                <div className="text-center">
                  <Bath className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-slate-900">{property.bathrooms}</div>
                  <div className="text-slate-600">Bathrooms</div>
                </div>
                <div className="text-center">
                  <Square className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-slate-900">{property.square_feet.toLocaleString()}</div>
                  <div className="text-slate-600">Sq Ft</div>
                </div>
                <div className="text-center">
                  <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-slate-900">{property.year_built || 'N/A'}</div>
                  <div className="text-slate-600">Year Built</div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">About This Home</h2>
              <p className="text-slate-600 leading-relaxed text-lg">
                {property.description}
              </p>
            </div>

            {/* Features */}
            {property.features && property.features.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Features & Amenities</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {property.features.map((feature, index) => {
                    const IconComponent = amenityIcons[feature as keyof typeof amenityIcons] || TreePine
                    return (
                      <div key={index} className="flex items-center space-x-3 p-4 bg-slate-50 rounded-lg">
                        <IconComponent className="w-5 h-5 text-blue-600" />
                        <span className="text-slate-700 font-medium">{feature}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Floor Plan */}
            {property.floor_plan_url && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Floor Plan</h2>
                <div className="bg-slate-50 rounded-xl p-6 text-center">
                  <div className="mb-4">
                    <Download className="w-12 h-12 text-blue-600 mx-auto mb-2" />
                    <h3 className="text-lg font-semibold text-slate-900">Download Floor Plan</h3>
                    <p className="text-slate-600">View the detailed layout of this home</p>
                  </div>
                  <a
                    href={property.floor_plan_url}
                    download
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 inline-flex items-center"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </a>
                </div>
              </div>
            )}

            {/* Map Placeholder */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Location</h2>
              <div className="bg-slate-100 rounded-xl h-64 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                  <p className="text-slate-600">Interactive map coming soon</p>
                  <p className="text-sm text-slate-500 mt-1">
                    {property.address}, {property.city}, {property.state} {property.zip_code}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {/* Contact Form */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 mb-8">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Interested in this home?</h3>
                <ContactForm propertyId={property.id} />
              </div>

              {/* Property Details */}
              <div className="bg-slate-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Property Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Property ID:</span>
                    <span className="font-medium text-slate-900">{property.id.slice(0, 8)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Property Type:</span>
                    <span className="font-medium text-slate-900">Single Family</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Lot Size:</span>
                    <span className="font-medium text-slate-900">
                      {property.lot_size ? `${property.lot_size.toLocaleString()} sq ft` : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Year Built:</span>
                    <span className="font-medium text-slate-900">{property.year_built || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Status:</span>
                    <span className={`font-medium capitalize ${
                      property.status === 'available' ? 'text-green-600' :
                      property.status === 'pending' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {property.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PropertyDetailPage