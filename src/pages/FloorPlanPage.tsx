import React, { useState, useEffect } from 'react';
import { Upload, Image, Trash2, Eye, Grid, List, Map } from 'lucide-react';
import TexasMapView from '../components/TexasMapView';
import { Property } from '../types';

import SEO from '../components/SEO';
import { DatabaseService } from '../services/database';

interface SampleImage {
  id: string;
  name: string;
  url: string;
  category: 'property' | 'community' | 'amenity';
  uploadedAt: Date;
  size: string;
}

const FloorPlanPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'map' | 'images'>('map');
  const [imageViewMode, setImageViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [texasProperties, setTexasProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  // Sample data for demonstration
  const sampleImages: SampleImage[] = [
    {
      id: '1',
      name: 'Luxury Home Exterior',
      url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop',
      category: 'property',
      uploadedAt: new Date('2024-01-15'),
      size: '2.4 MB'
    },
    {
      id: '2',
      name: 'Modern Kitchen',
      url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
      category: 'property',
      uploadedAt: new Date('2024-01-14'),
      size: '1.8 MB'
    },
    {
      id: '3',
      name: 'Community Pool',
      url: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400&h=300&fit=crop',
      category: 'amenity',
      uploadedAt: new Date('2024-01-13'),
      size: '3.1 MB'
    },
    {
      id: '4',
      name: 'Garden View',
      url: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400&h=300&fit=crop',
      category: 'property',
      uploadedAt: new Date('2024-01-12'),
      size: '2.7 MB'
    },
    {
      id: '5',
      name: 'Community Center',
      url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop',
      category: 'community',
      uploadedAt: new Date('2024-01-11'),
      size: '2.9 MB'
    },
    {
      id: '6',
      name: 'Master Bedroom',
      url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop',
      category: 'property',
      uploadedAt: new Date('2024-01-10'),
      size: '2.1 MB'
    }
  ];

  const filteredImages = selectedCategory === 'all' 
    ? sampleImages 
    : sampleImages.filter(img => img.category === selectedCategory);

  useEffect(() => {
    const fetchTexasProperties = async () => {
      try {
        const isConnected = await DatabaseService.testConnection();
        if (isConnected) {
          const properties = await DatabaseService.getAllProperties();
          // Filter for Texas properties (you can adjust this filter as needed)
          const texasProps = properties.filter(p => p.state === 'TX');
          setTexasProperties(texasProps);
        } else {
          console.warn('Database not connected, using empty properties');
          setTexasProperties([]);
        }
      } catch (error) {
        console.error('Error fetching Texas properties:', error);
        setTexasProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTexasProperties();
  }, []);

  const handlePropertyClick = (property: Property) => {
    console.log('Property clicked:', property);
  };

  const handleImageUpload = () => {
    // This would integrate with your actual image upload functionality
    alert('Image upload functionality would be implemented here');
  };

  const handleImageDelete = (imageId: string) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      // This would integrate with your actual delete functionality
      alert(`Image ${imageId} would be deleted here`);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Texas properties...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title="Interactive Property Maps & Image Management | Real Estate Portfolio"
        description="Explore interactive property maps showing available, sold, and reserved properties across Texas, plus manage your property images and portfolio."
        keywords="interactive property maps, Texas real estate, property availability, sold properties, property maps, real estate maps, image management"
        url="https://your-domain.com/floor-plans"
        type="website"
      />

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container-max px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Interactive Property Maps</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our interactive property maps and manage your portfolio images
            </p>
          </div>
        </div>
      </div>

      <div className="container-max px-4 py-8">
        {/* View Selector */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Select View</h2>
              <p className="text-gray-600">Choose between interactive maps or image management</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewMode === 'map'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <Map className="w-4 h-4" />
                Interactive Map
              </button>
              <button
                onClick={() => setViewMode('images')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewMode === 'images'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <Image className="w-4 h-4" />
                Image Management
              </button>
            </div>
          </div>
        </div>

        {/* Interactive Property Map View */}
        {viewMode === 'map' && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
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
              properties={texasProperties}
              onPropertyClick={handlePropertyClick}
              showLegend={true}
            />

            {/* Map Summary */}
            <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {texasProperties.filter((p: Property) => p.status === 'available').length}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">Available Properties</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-yellow-600 mb-2">
                    {texasProperties.filter((p: Property) => p.status === 'reserved').length}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">Reserved Properties</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-red-600 mb-2">
                    {texasProperties.filter((p: Property) => p.status === 'sold').length}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">Sold Properties</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {texasProperties.length}
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
        )}

        {/* Image Management View */}
        {viewMode === 'images' && (
          <>
            {/* Controls */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleImageUpload}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    Upload Images
                  </button>
                  
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="all">All Categories</option>
                    <option value="property">Property</option>
                    <option value="community">Community</option>
                    <option value="amenity">Amenity</option>
                  </select>
                </div>

                                 <div className="flex items-center gap-2">
                   <button
                     onClick={() => setImageViewMode('grid')}
                     className={`p-2 rounded-lg transition-colors ${
                       imageViewMode === 'grid' 
                         ? 'bg-primary-100 text-primary-600' 
                         : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                     }`}
                   >
                     <Grid className="w-4 h-4" />
                   </button>
                   <button
                     onClick={() => setImageViewMode('list')}
                     className={`p-2 rounded-lg transition-colors ${
                       imageViewMode === 'list' 
                         ? 'bg-primary-100 text-primary-600' 
                         : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                     }`}
                   >
                     <List className="w-4 h-4" />
                   </button>
                 </div>
              </div>
            </div>

            {/* Image Grid/List */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  {selectedCategory === 'all' ? 'All Images' : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Images`}
                </h3>
                <span className="text-sm text-gray-600">{filteredImages.length} images</span>
              </div>

                             {imageViewMode === 'grid' ? (
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                   {filteredImages.map((image) => (
                     <div key={image.id} className="group relative bg-gray-100 rounded-lg overflow-hidden">
                       <div className="aspect-w-4 aspect-h-3">
                         <img
                           src={image.url}
                           alt={image.name}
                           className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                         />
                       </div>
                       
                       <div className="p-4">
                         <h4 className="font-medium text-gray-900 mb-1 truncate">{image.name}</h4>
                         <div className="flex items-center justify-between text-sm text-gray-600">
                           <span className="capitalize">{image.category}</span>
                           <span>{image.size}</span>
                         </div>
                         <p className="text-xs text-gray-500 mt-1">{formatDate(image.uploadedAt)}</p>
                       </div>

                       <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <div className="flex gap-1">
                           <button className="p-1 bg-white rounded shadow-sm hover:bg-gray-50">
                             <Eye className="w-3 h-3 text-gray-600" />
                           </button>
                           <button 
                             onClick={() => handleImageDelete(image.id)}
                             className="p-1 bg-white rounded shadow-sm hover:bg-gray-50 hover:text-red-600"
                           >
                             <Trash2 className="w-3 h-3" />
                           </button>
                         </div>
                       </div>
                     </div>
                   ))}
                 </div>
               ) : (
                 <div className="space-y-3">
                   {filteredImages.map((image) => (
                     <div key={image.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                       <img
                         src={image.url}
                         alt={image.name}
                         className="w-16 h-16 object-cover rounded"
                       />
                       
                       <div className="flex-1 min-w-0">
                         <h4 className="font-medium text-gray-900 truncate">{image.name}</h4>
                         <div className="flex items-center gap-4 text-sm text-gray-600">
                           <span className="capitalize">{image.category}</span>
                           <span>{image.size}</span>
                           <span>{formatDate(image.uploadedAt)}</span>
                         </div>
                       </div>

                       <div className="flex items-center gap-2">
                         <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-white rounded">
                           <Eye className="w-4 h-4" />
                         </button>
                         <button 
                           onClick={() => handleImageDelete(image.id)}
                           className="p-2 text-gray-600 hover:text-red-600 hover:bg-white rounded"
                         >
                           <Trash2 className="w-4 h-4" />
                         </button>
                       </div>
                     </div>
                   ))}
                 </div>
               )}
            </div>

            {/* Sample Data Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
              <div className="flex items-start gap-3">
                <Image className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="text-lg font-semibold text-blue-900 mb-2">Sample Data</h4>
                  <p className="text-blue-800 mb-3">
                    This page currently displays sample image data for demonstration purposes. 
                    In a production environment, this would integrate with your actual image management system.
                  </p>
                  <div className="text-sm text-blue-700 space-y-1">
                    <p>• Upload new images using the upload button</p>
                    <p>• Filter images by category (Property, Community, Amenity)</p>
                    <p>• Switch between grid and list view modes</p>
                    <p>• View image details and manage your portfolio</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FloorPlanPage; 