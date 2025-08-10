import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Tag } from 'lucide-react';

interface GalleryItem {
  id: string;
  title: string;
  price: number;
  address: string;
  city: string;
  state: string;
  image: string;
  isSold: boolean;
  soldPrice?: number;
}

interface GalleryProps {
  items?: GalleryItem[];
}

const Gallery: React.FC<GalleryProps> = ({ items }) => {
  // Example gallery items with sample images
  const exampleItems: GalleryItem[] = [
    {
      id: '1',
      title: 'Modern Downtown Condo',
      price: 450000,
      address: '123 Main Street',
      city: 'Downtown',
      state: 'CA',
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
      isSold: false
    },
    {
      id: '2',
      title: 'Luxury Waterfront Villa',
      price: 1200000,
      address: '456 Ocean Drive',
      city: 'Malibu',
      state: 'CA',
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop',
      isSold: true,
      soldPrice: 1150000
    },
    {
      id: '3',
      title: 'Family Suburban Home',
      price: 750000,
      address: '789 Oak Avenue',
      city: 'Beverly Hills',
      state: 'CA',
      image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop',
      isSold: false
    },
    {
      id: '4',
      title: 'Historic Townhouse',
      price: 850000,
      address: '321 Heritage Lane',
      city: 'Pasadena',
      state: 'CA',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop',
      isSold: true,
      soldPrice: 820000
    },
    {
      id: '5',
      title: 'Contemporary Penthouse',
      price: 2100000,
      address: '654 Skyline Blvd',
      city: 'Los Angeles',
      state: 'CA',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
      isSold: false
    },
    {
      id: '6',
      title: 'Coastal Beach House',
      price: 1800000,
      address: '987 Shore Drive',
      city: 'Santa Monica',
      state: 'CA',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
      isSold: true,
      soldPrice: 1750000
    }
  ];

  const displayItems = items || exampleItems;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="bg-gray-50 py-16">
      <div className="container-max px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Properties</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our curated selection of premium properties, from modern condos to luxury estates
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayItems.map((item) => (
            <div key={item.id} className="group">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300">
                {/* Image Container */}
                <div className="relative overflow-hidden">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <div className="text-4xl mb-2">🏠</div>
                        <div className="text-sm">No Image Available</div>
                      </div>
                    </div>
                  )}
                  
                  {/* SOLD Overlay */}
                  {item.isSold && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <div className="text-center text-white">
                        <div className="text-4xl font-bold mb-2">SOLD</div>
                        <div className="text-lg opacity-90">
                          {item.soldPrice && formatPrice(item.soldPrice)}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Price Badge */}
                  {!item.isSold && (
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-full shadow-sm">
                      <span className="text-lg font-bold text-primary-600">
                        {formatPrice(item.price)}
                      </span>
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 left-4">
                    {item.isSold ? (
                      <div className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Sold
                      </div>
                    ) : (
                      <div className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Available
                      </div>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                    {item.title}
                  </h3>
                  
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">
                      {item.address}, {item.city}, {item.state}
                    </span>
                  </div>

                  {/* Price Info */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-600">
                      <Tag className="w-4 h-4 mr-1" />
                      <span className="text-sm font-medium">
                        {item.isSold ? 'Sold Price' : 'List Price'}
                      </span>
                    </div>
                    <span className={`text-lg font-bold ${item.isSold ? 'text-red-600' : 'text-primary-600'}`}>
                      {formatPrice(item.isSold ? (item.soldPrice || item.price) : item.price)}
                    </span>
                  </div>

                  {/* View Details Button */}
                  <div className="mt-4">
                    <Link
                      to={`/properties/${item.id}`}
                      className="inline-block w-full text-center bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors duration-200"
                    >
                      {item.isSold ? 'View Details' : 'View Details'}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            to="/properties"
            className="inline-block bg-white text-primary-600 border-2 border-primary-600 py-3 px-8 rounded-lg hover:bg-primary-600 hover:text-white transition-colors duration-200 font-medium"
          >
            View All Properties
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Gallery; 