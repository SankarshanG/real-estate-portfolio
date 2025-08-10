import React, { useState, useEffect } from 'react';
import Gallery from '../components/Gallery';
import { Property } from '../types';
import { properties as propertiesData } from '../data/properties';
import TexasMapView from '../components/TexasMapView';
import { sampleTexasProperties } from '../data/texasProperties';

const GalleryPage: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setProperties(propertiesData);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handlePropertyClick = (property: Property) => {
    console.log('Texas property clicked:', property);
  };

  // Convert Property objects to GalleryItem format
  const galleryItems = properties.map(property => ({
    id: property.id,
    title: property.title,
    price: property.price || 0,
    address: property.address || '',
    city: property.city || '',
    state: property.state || '',
    image: property.images && property.images.length > 0 ? property.images[0] : '',
    isSold: property.status === 'sold',
    soldPrice: property.status === 'sold' ? property.price : undefined
  }));

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading properties...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container-max px-4 py-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Property Gallery</h1>
          <p className="text-xl text-blue-100 max-w-3xl">
            Discover our curated collection of premium properties across Texas. 
            From luxury estates to investment opportunities, find your perfect match.
          </p>
        </div>
      </div>

      {/* Interactive Texas Map Section */}
      <div className="container-max px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">🗺️ Texas Real Estate Portfolio - Interactive Map</h2>
            <p className="text-gray-600">
              Explore our interactive map showing properties across major Texas cities including Dallas, Austin, Houston, 
              San Antonio, Fort Worth, Corpus Christi, and El Paso. Click on any property marker to view detailed information.
            </p>
          </div>

          <TexasMapView
            title="Texas Real Estate Portfolio - Premium Properties"
            description="Interactive map showing our properties across Texas with detailed information, filtering, and search capabilities"
            properties={sampleTexasProperties}
            onPropertyClick={handlePropertyClick}
            showLegend={true}
          />

          {/* Map Summary */}
          <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {sampleTexasProperties.filter(p => p.status === 'available').length}
                </div>
                <div className="text-sm text-gray-600 font-medium">Available Properties</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-600 mb-2">
                  {sampleTexasProperties.filter(p => p.status === 'reserved').length}
                </div>
                <div className="text-sm text-gray-600 font-medium">Reserved Properties</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-red-600 mb-2">
                  {sampleTexasProperties.filter(p => p.status === 'sold').length}
                </div>
                <div className="text-sm text-gray-600 font-medium">Sold Properties</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {sampleTexasProperties.length}
                </div>
                <div className="text-sm text-gray-600 font-medium">Total Properties</div>
              </div>
            </div>
            <div className="mt-6 text-center">
              <p className="text-gray-600 mb-4">
                Our Texas portfolio spans from luxury residential estates to prime commercial investments and development land
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
                <span className="flex items-center">
                  <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                  Residential
                </span>
                <span className="flex items-center">
                  <span className="w-3 h-3 bg-purple-500 rounded-full mr-2"></span>
                  Commercial
                </span>
                <span className="flex items-center">
                  <span className="w-3 h-3 bg-orange-500 rounded-full mr-2"></span>
                  Land
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Component */}
      <div className="container-max px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Properties</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Browse through our handpicked selection of premium properties. Each listing showcases 
            exceptional quality, prime locations, and outstanding value.
          </p>
        </div>
        <Gallery items={galleryItems} />
      </div>
    </div>
  );
};

export default GalleryPage; 