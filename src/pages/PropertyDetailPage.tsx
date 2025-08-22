import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Bed, Bath, Square, MapPin, Car, 
  ArrowLeft, ChevronLeft, ChevronRight,
  Download, Home, Star
} from 'lucide-react';
import { DatabaseService } from '../services/database';
import { Property, ContactForm } from '../types';
import SEO from '../components/SEO';

const PropertyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation() as { state?: { fromAdmin?: boolean } };
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [contactForm, setContactForm] = useState<ContactForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
    propertyId: id,
  });

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;
      
      try {
        console.log('Fetching property details for ID:', id);
        const propertyData = await DatabaseService.getPropertyById(id);
        console.log('Fetched property data:', propertyData);
        if (propertyData) {
          console.log('Property images:', propertyData.images);
        }
        setProperty(propertyData);
      } catch (error) {
        console.error('Error fetching property:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading property...</p>
        </div>
      </div>
    );
  }

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
    if (!property.images || property.images.length === 0) return;
    setCurrentImageIndex((prev) => 
      prev === property.images!.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    if (!property.images || property.images.length === 0) return;
    setCurrentImageIndex((prev) => 
      prev === 0 ? property.images!.length - 1 : prev - 1
    );
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const lead = await DatabaseService.createLead({
        property_id: id!,
        name: `${contactForm.firstName} ${contactForm.lastName}`,
        email: contactForm.email,
        phone: contactForm.phone,
        message: contactForm.message,
      });

      if (lead) {
        alert('Thank you for your interest! We will contact you soon.');
        setContactForm({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          message: '',
          propertyId: id,
        });
      } else {
        alert('There was an error submitting your request. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      alert('There was an error submitting your request. Please try again.');
    }
  };

  const handleDownloadFloorPlan = () => {
    if (property.build_plan_url) {
      try {
        // Function to get file extension from MIME type or URL
        const getFileExtension = (url: string): string => {
          if (url.startsWith('data:')) {
            // Extract MIME type from data URL
            const mimeMatch = url.match(/data:([^;]+);/);
            if (mimeMatch) {
              const mimeType = mimeMatch[1];
              switch (mimeType) {
                case 'application/pdf':
                  return '.pdf';
                case 'application/msword':
                  return '.doc';
                case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                  return '.docx';
                case 'image/jpeg':
                case 'image/jpg':
                  return '.jpg';
                default:
                  return '.pdf'; // fallback
              }
            }
          } else {
            // Extract extension from URL
            const urlMatch = url.match(/\.([a-zA-Z0-9]+)(\?|$)/);
            if (urlMatch) {
              return `.${urlMatch[1]}`;
            }
          }
          return '.pdf'; // fallback
        };

        const fileExtension = getFileExtension(property.build_plan_url);
        const fileName = `floorplan-${property.title.replace(/\s+/g, '-').toLowerCase()}${fileExtension}`;

        // Check if it's a base64 data URL
        if (property.build_plan_url.startsWith('data:')) {
          // Handle base64 floor plan
          const link = document.createElement('a');
          link.href = property.build_plan_url;
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          // Handle URL floor plan
          const link = document.createElement('a');
          link.href = property.build_plan_url;
          link.target = '_blank';
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      } catch (error) {
        console.error('Error downloading floor plan:', error);
        // Fallback to opening in new tab
        if (property.build_plan_url.startsWith('data:')) {
          // For base64, create a blob and download
          const link = document.createElement('a');
          link.href = property.build_plan_url;
          const fileExtension = property.build_plan_url.includes('image/jpeg') ? '.jpg' : '.pdf';
          link.download = `floorplan-${property.title.replace(/\s+/g, '-').toLowerCase()}${fileExtension}`;
          link.click();
        } else {
          // For URLs, open in new tab
          window.open(property.build_plan_url, '_blank');
        }
      }
    } else {
      alert('Floor plan not available for this property.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sold':
        return 'bg-red-600 text-white';
      case 'under_contract':
        return 'bg-yellow-600 text-white';
      default:
        return 'bg-green-600 text-white';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'sold':
        return 'Sold';
      case 'under_contract':
        return 'Under Contract';
      default:
        return 'Available';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {property && (
                  <SEO
            title={`${property.title} - ${property.city}, ${property.state} | Premium Real Estate Properties`}
            description={`${property.bedrooms || 0} bedroom, ${property.bathrooms || 0} bathroom luxury home for sale in ${property.city}, ${property.state}. ${property.sqft?.toLocaleString() || 0} sq ft. ${property.description}`}
            keywords={`${property.city} real estate, ${property.city} luxury homes, ${property.bedrooms} bedroom homes ${property.city}, premium properties ${property.city}, Texas real estate, ${property.city} properties`}
            url={`https://your-domain.com/properties/${property.id}`}
            type="product"
            property={{
              title: property.title,
              price: property.price,
              location: `${property.city}, ${property.state}`,
              bedrooms: property.bedrooms,
              bathrooms: property.bathrooms,
              sqft: property.sqft
            }}
          />
      )}
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-max px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Link to="/" className="hover:text-primary-600">Home</Link>
              <span>/</span>
              <Link to="/properties" className="hover:text-primary-600">Properties</Link>
              <span>/</span>
              <span className="text-gray-900">{property.title}</span>
            </div>
            {location.state?.fromAdmin ? (
              <button
                onClick={() => navigate('/admin/properties')}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Back to Admin
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="container-max px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Summary panel + hero image */}
            <div className="grid lg:grid-cols-3 gap-6 mb-8">
              {/* Summary panel (left) */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-sm text-gray-600">Price</div>
                    <div className="text-2xl font-bold text-gray-900">{formatPrice(property.price || 0)}</div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(property.status || 'available')}`}>
                    {getStatusText(property.status || 'available')}
                  </span>
                </div>
                {/* Stats moved below the gallery for more space */}
                <div className="mt-4 space-y-2 text-sm">
                  {property.floorPlan && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Floor Plan</span>
                      <span className="font-medium">{property.floorPlan}</span>
                    </div>
                  )}
                  {property.build_plan_url && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Plan PDF</span>
                      <a href={property.build_plan_url} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">Download</a>
                    </div>
                  )}
                  {property.garageSpaces !== undefined && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Garage</span>
                      <span className="font-medium">{property.garageSpaces}-Car</span>
                    </div>
                  )}
                  {property.mlsNumber && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">MLS#</span>
                      <span className="font-medium">{property.mlsNumber}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Hero carousel (right, spans 2) */}
              <div className="lg:col-span-2">
                <div className="relative h-96 md:h-[500px] lg:h-[600px] rounded-lg overflow-hidden bg-gray-200">
                  {property.images && property.images.length > 0 ? (
                    <>
                      {(() => {
                        const original = property.images[currentImageIndex];
                        const isUploads = original && original.includes('/uploads/');
                        const webp = isUploads ? original.replace(/\.[^.]+$/, '.webp') : '';
                        return (
                          <picture>
                            {isUploads ? (
                              <source srcSet={webp} type="image/webp" />
                            ) : null}
                            <img
                              src={original}
                              alt={`${property.title} - ${currentImageIndex + 1}`}
                              className="w-full h-full object-cover"
                              loading="eager"
                              decoding="async"
                              fetchPriority="high"
                              sizes="100vw"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const placeholder = target.parentElement?.querySelector('.image-placeholder');
                                if (placeholder) {
                                  placeholder.classList.remove('hidden');
                                }
                              }}
                            />
                          </picture>
                        );
                      })()}

                      {/* Fallback placeholder */}
                      <div className="image-placeholder hidden w-full h-full flex items-center justify-center">
                        <div className="text-center text-gray-500">
                          <div className="text-6xl mb-4">🏠</div>
                          <div className="text-lg font-medium">Image Not Available</div>
                          <div className="text-sm">This image could not be loaded</div>
                        </div>
                      </div>

                      {/* Navigation Arrows */}
                      {property.images.length > 1 && (
                        <>
                          <button
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                            aria-label="Previous image"
                          >
                            <ChevronLeft className="w-6 h-6" />
                          </button>
                          <button
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                            aria-label="Next image"
                          >
                            <ChevronRight className="w-6 h-6" />
                          </button>
                        </>
                      )}

                      {/* Image Counter */}
                      <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                        {currentImageIndex + 1} / {property.images.length}
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <div className="text-6xl mb-4">🏠</div>
                        <div className="text-lg font-medium">No Images Available</div>
                        <div className="text-sm">Property images coming soon</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Thumbnail Navigation */}
                {property.images && property.images.length > 1 && (
                  <div className="flex space-x-2 mt-4 overflow-x-auto pb-2">
                    {property.images.map((image: string, index: number) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-105 ${
                          index === currentImageIndex 
                            ? 'border-primary-600 ring-2 ring-primary-200' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        aria-label={`View image ${index + 1}`}
                      >
                        {(() => {
                          const original = image;
                          const isUploads = original && original.includes('/uploads/');
                          const webp = isUploads ? original.replace(/\.[^.]+$/, '.webp') : '';
                          return (
                            <picture>
                              {isUploads ? (
                                <source srcSet={webp} type="image/webp" />
                              ) : null}
                              <img
                                src={original}
                                alt={`${property.title} ${index + 1}`}
                                className="w-full h-full object-cover"
                                loading="lazy"
                                decoding="async"
                                sizes="(min-width:1024px) 15vw, (min-width:768px) 20vw, 33vw"
                              />
                            </picture>
                          );
                        })()}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Property Details */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{property.address}, {property.city}, {property.state} {property.zip_code}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary-600 mb-1">
                    {formatPrice(property.price || 0)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {property.status === 'sold' ? 'Sold Price' : 'List Price'}
                  </div>
                </div>
              </div>

              {/* Spacious stats row under the header */}
              <div className="mt-2 mb-8 rounded-xl border border-gray-200 overflow-hidden">
                <div className="grid grid-cols-2 md:grid-cols-4 bg-white">
                  <div className="p-6 md:p-8 text-center border-b md:border-b-0 md:border-r border-gray-200">
                    <div className="text-4xl font-bold text-gray-900">{property.stories || 1}</div>
                    <div className="mt-2 text-xs tracking-widest uppercase text-gray-500">Stories</div>
                  </div>
                  <div className="p-6 md:p-8 text-center border-b md:border-b-0 md:border-r border-gray-200">
                    <div className="text-4xl font-bold text-gray-900">{(property.sqft || property.squareFeet || 0).toLocaleString()}</div>
                    <div className="mt-2 text-xs tracking-widest uppercase text-gray-500">Sqft</div>
                  </div>
                  <div className="p-6 md:p-8 text-center border-b md:border-b-0 md:border-r border-gray-200">
                    <div className="text-4xl font-bold text-gray-900">{property.bedrooms || 0}</div>
                    <div className="mt-2 text-xs tracking-widest uppercase text-gray-500">Beds</div>
                  </div>
                  <div className="p-6 md:p-8 text-center">
                    <div className="text-4xl font-bold text-gray-900">{property.bathrooms || 0}</div>
                    <div className="mt-2 text-xs tracking-widest uppercase text-gray-500">Baths</div>
                  </div>
                </div>
              </div>

              {/* Property Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Bed className="w-6 h-6 mx-auto mb-2 text-primary-600" />
                  <div className="text-lg font-semibold">{property.bedrooms || 0}</div>
                  <div className="text-sm text-gray-600">Bedrooms</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Bath className="w-6 h-6 mx-auto mb-2 text-primary-600" />
                  <div className="text-lg font-semibold">{property.bathrooms || 0}</div>
                  <div className="text-sm text-gray-600">Bathrooms</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Square className="w-6 h-6 mx-auto mb-2 text-primary-600" />
                  <div className="text-lg font-semibold">{property.sqft?.toLocaleString() || 0}</div>
                  <div className="text-sm text-gray-600">Sq Ft</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Car className="w-6 h-6 mx-auto mb-2 text-primary-600" />
                  <div className="text-lg font-semibold">{property.garageSpaces || 0}</div>
                  <div className="text-sm text-gray-600">Garage</div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-700 leading-relaxed">{property.description}</p>
              </div>

              {/* Features */}
              {property.features && property.features.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {property.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-gray-700">
                        <Star className="w-4 h-4 mr-2 text-primary-600" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Property Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Property Details</h3>
                  <div className="space-y-2">
                    {property.yearBuilt && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Year Built:</span>
                        <span className="font-medium">{property.yearBuilt}</span>
                      </div>
                    )}
                    {property.lotSize && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Lot Size:</span>
                        <span className="font-medium">{property.lotSize}</span>
                      </div>
                    )}
                    {property.mlsNumber && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">MLS #:</span>
                        <span className="font-medium">{property.mlsNumber}</span>
                      </div>
                    )}
                    {/* Quick Move-In removed */}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Floor Plan</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <Home className="w-5 h-5 mr-2 text-primary-600" />
                        <span className="font-medium">Floor Plan</span>
                      </div>
                      <button
                        onClick={handleDownloadFloorPlan}
                        className="flex items-center bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </button>
                    </div>
                    <p className="text-sm text-gray-600">
                      Download the detailed floor plan to see the complete layout and dimensions.
                    </p>
                  </div>
                </div>
              </div>

              {/* Map */}
              {property.lat && property.lng && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Location</h3>
                  <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                      <p className="text-gray-600">Interactive map coming soon</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {property.address}, {property.city}, {property.state}
                      </p>
                    </div>
                  </div>
                </div>
              )}


            </div>
          </div>

          {/* Sidebar: Request Info (no agent names) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Request Info</h3>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input
                      type="text"
                      value={contactForm.firstName}
                      onChange={(e) => setContactForm({...contactForm, firstName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      value={contactForm.lastName}
                      onChange={(e) => setContactForm({...contactForm, lastName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={contactForm.phone}
                    onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    value={contactForm.message}
                    onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Tell us about your interest in this property..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors font-medium"
                >
                  Send Inquiry
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailPage; 