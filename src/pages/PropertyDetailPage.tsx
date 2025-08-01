import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { 
  ArrowLeft, Bed, Bath, Square, Calendar, MapPin, 
  ChevronLeft, ChevronRight, Download, Phone, Mail,
  Car, Home as HomeIcon
} from 'lucide-react'
import { useProperty } from '../hooks/useProperties'
import ContactForm from '../components/ContactForm'

const PropertyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { property, loading, error } = useProperty(id!)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Property Not Found</h1>
          <p className="text-slate-600 mb-6">The property you're looking for doesn't exist.</p>
          <Link
            to="/homes"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 inline-flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
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
  const fallbackImage = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&h=800&fit=crop'

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2 text-sm text-slate-600">
            <Link to="/" className="hover:text-blue-600">Home</Link>
            <span>/</span>
            <Link to="/homes" className="hover:text-blue-600">Homes</Link>
            <span>/</span>
            <span className="text-slate-900">{property.title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8">
              <div className="relative h-96 md:h-[500px]">
                <img
                  src={currentImage?.image_url || fallbackImage}
                  alt={currentImage?.alt_text || property.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Navigation Arrows */}
                {property.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition-colors duration-200"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition-colors duration-200"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>

                    {/* Image Counter */}
                    <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                      {currentImageIndex + 1} / {property.images.length}
                    </div>
                  </>
                )}

                {/* Status Badge */}
                {property.status === 'sold' && (
                  <div className="absolute top-4 left-4 bg-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    SOLD
                  </div>
                )}
                
                {property.status === 'pending' && (
                  <div className="absolute top-4 left-4 bg-yellow-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    PENDING
                  </div>
                )}
              </div>

              {/* Thumbnail Navigation */}
              {property.images.length > 1 && (
                <div className="p-4 bg-slate-50">
                  <div className="flex space-x-2 overflow-x-auto">
                    {property.images.map((image, index) => (
                      <button
                        key={image.id}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors duration-200 ${
                          index === currentImageIndex ? 'border-blue-600' : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <img
                          src={image.image_url}
                          alt={image.alt_text || `${property.title} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Property Details */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-8">
                <div className="flex-1">
                  <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
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
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {formatPrice(property.price)}
                  </div>
                  {property.floor_plan_url && (
                    <a
                      href={property.floor_plan_url}
                      download
                      className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Floor Plan</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Key Features Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <Bed className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-slate-900">{property.bedrooms}</div>
                  <div className="text-sm text-slate-600">Bedrooms</div>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <Bath className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-slate-900">{property.bathrooms}</div>
                  <div className="text-sm text-slate-600">Bathrooms</div>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <Square className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-slate-900">{property.square_feet.toLocaleString()}</div>
                  <div className="text-sm text-slate-600">Square Feet</div>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-slate-900">{property.year_built || 'New'}</div>
                  <div className="text-sm text-slate-600">Year Built</div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Description</h3>
                <p className="text-slate-600 leading-relaxed text-lg">
                  {property.description}
                </p>
              </div>

              {/* Features */}
              {property.features && property.features.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">Features & Amenities</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {property.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <span className="text-slate-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Property Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">Property Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-slate-200">
                      <span className="text-slate-600">Property Type:</span>
                      <span className="font-medium text-slate-900">Single Family Home</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-200">
                      <span className="text-slate-600">Year Built:</span>
                      <span className="font-medium text-slate-900">{property.year_built || 'New Construction'}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-200">
                      <span className="text-slate-600">Lot Size:</span>
                      <span className="font-medium text-slate-900">{property.lot_size || 'N/A'} acres</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-200">
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

                {/* Map Placeholder */}
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">Location</h3>
                  <div className="bg-slate-100 rounded-lg h-64 flex items-center justify-center">
                    <div className="text-center text-slate-500">
                      <MapPin className="w-12 h-12 mx-auto mb-2" />
                      <p>Interactive map coming soon</p>
                      <p className="text-sm mt-1">
                        {property.address}, {property.city}, {property.state}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Contact Form */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6 sticky top-24">
              <h3 className="text-xl font-semibold text-slate-900 mb-6">
                Interested in this property?
              </h3>
              <ContactForm propertyId={property.id} />
            </div>

            {/* Quick Contact */}
            <div className="bg-blue-600 text-white rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Need immediate assistance?</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5" />
                  <span>(555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5" />
                  <span>info@realestate.com</span>
                </div>
              </div>
              <button className="w-full bg-white text-blue-600 font-semibold py-3 px-4 rounded-lg mt-4 hover:bg-slate-100 transition-colors duration-200">
                Call Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PropertyDetailPage