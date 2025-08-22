import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Gallery from '../components/Gallery';
import { Property } from '../types';
import SEO from '../components/SEO';
import { DatabaseService } from '../services/database';

const GalleryPage: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const isConnected = await DatabaseService.testConnection();
        if (isConnected) {
          const propertiesData = await DatabaseService.getAllProperties();
          setProperties(propertiesData);
        } else {
          console.warn('Database not connected, using empty properties');
          setProperties([]);
        }
      } catch (error) {
        console.error('Error fetching properties:', error);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

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
      <SEO
        title="Property Gallery | Real Estate Portfolio"
        description="Browse our curated collection of premium properties in a beautiful gallery view. Discover luxury homes, condos, and estates across Texas."
        keywords="property gallery, real estate photos, luxury homes, Texas properties, property listings"
        url="https://your-domain.com/gallery"
        type="website"
      />

      {/* Header */}
      <div className="bg-white border-b">
        <div className="container-max px-4 py-8 md:py-10">
          <div className="text-sm text-gray-500 mb-2">
            <Link to="/" className="hover:text-gray-700">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-700">Gallery</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Property Gallery</h1>
          <p className="mt-2 text-gray-600 max-w-3xl">
            Explore a curated selection of our latest listings in a clean, professional gallery view.
          </p>
        </div>
      </div>

      {/* Gallery Component */}
      <div className="container-max px-4 py-8">
        <Gallery items={galleryItems} />
      </div>
    </div>
  );
};

export default GalleryPage; 