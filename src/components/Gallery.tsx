import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Tag, Search, X } from 'lucide-react';

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
  showControls?: boolean;
}

const Gallery: React.FC<GalleryProps> = ({ items, showControls = true }) => {
  // Example gallery items with sample images (fallback)
  const exampleItems: GalleryItem[] = [
    {
      id: '1',
      title: 'Modern Downtown Condo',
      price: 450000,
      address: '123 Main Street',
      city: 'Downtown',
      state: 'CA',
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&h=800&q=80',
      isSold: false
    },
    {
      id: '2',
      title: 'Luxury Waterfront Villa',
      price: 1200000,
      address: '456 Ocean Drive',
      city: 'Malibu',
      state: 'CA',
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&h=800&q=80',
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
      image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&h=800&q=80',
      isSold: false
    },
    {
      id: '4',
      title: 'Historic Townhouse',
      price: 850000,
      address: '321 Heritage Lane',
      city: 'Pasadena',
      state: 'CA',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&h=800&q=80',
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
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&h=800&q=80',
      isSold: false
    },
    {
      id: '6',
      title: 'Coastal Beach House',
      price: 1800000,
      address: '987 Shore Drive',
      city: 'Santa Monica',
      state: 'CA',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&h=800&q=80',
      isSold: true,
      soldPrice: 1750000
    }
  ];

  const displayItems = items && items.length > 0 ? items : exampleItems;

  const uniqueCities = useMemo(() => {
    const set = new Set<string>();
    displayItems.forEach(i => {
      if (i.city) set.add(i.city);
    });
    return Array.from(set).sort();
  }, [displayItems]);

  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'sold'>('all');
  const [sortBy, setSortBy] = useState<'relevance' | 'priceAsc' | 'priceDesc' | 'titleAsc'>('relevance');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const filteredItems = useMemo(() => {
    let list = [...displayItems];

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(i =>
        i.title.toLowerCase().includes(q) ||
        i.address.toLowerCase().includes(q) ||
        i.city.toLowerCase().includes(q)
      );
    }

    if (cityFilter !== 'all') {
      list = list.filter(i => i.city.toLowerCase() === cityFilter.toLowerCase());
    }

    if (statusFilter !== 'all') {
      list = list.filter(i => (statusFilter === 'sold' ? i.isSold : !i.isSold));
    }

    switch (sortBy) {
      case 'priceAsc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'priceDesc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'titleAsc':
        list.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }

    return list;
  }, [displayItems, searchTerm, cityFilter, statusFilter, sortBy]);

  const [quickViewId, setQuickViewId] = useState<string | null>(null);
  const quickViewItem = quickViewId ? filteredItems.find(i => i.id === quickViewId) || null : null;

  return (
    <div className="bg-gray-50 py-16">
      <div className="container-max px-4">
        {showControls && (
          <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by title, address, city..."
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="rounded-lg border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Cities</option>
              {uniqueCities.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <div className="flex gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="flex-1 rounded-lg border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="sold">Sold</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="flex-1 rounded-lg border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="relevance">Sort: Relevance</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
                <option value="titleAsc">Title: A–Z</option>
              </select>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-600">{filteredItems.length} results</p>
          {searchTerm || cityFilter !== 'all' || statusFilter !== 'all' || sortBy !== 'relevance' ? (
            <button
              className="text-sm text-gray-600 hover:text-gray-900"
              onClick={() => { setSearchTerm(''); setCityFilter('all'); setStatusFilter('all'); setSortBy('relevance'); }}
            >
              Reset filters
            </button>
          ) : null}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div key={item.id} className="group">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300">
                {/* Image Container */}
                <div className="relative overflow-hidden">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
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

                  {/* Dark gradient at bottom for readability */}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 to-transparent" />

                  {/* Quick View */}
                  <button
                    onClick={() => setQuickViewId(item.id)}
                    className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm font-medium hover:bg-white transition"
                  >
                    Quick View
                  </button>

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

      {/* Quick View Modal */}
      {quickViewItem && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h3 className="text-lg font-semibold">{quickViewItem.title}</h3>
              <button onClick={() => setQuickViewId(null)} className="p-1 rounded hover:bg-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid md:grid-cols-2">
              <div className="relative bg-gray-100">
                {quickViewItem.image ? (
                  <img src={quickViewItem.image} alt={quickViewItem.title} className="w-full h-72 object-cover" />
                ) : (
                  <div className="w-full h-72 flex items-center justify-center text-gray-400">No Image</div>
                )}
              </div>
              <div className="p-4">
                <div className="text-primary-600 text-2xl font-bold mb-2">{formatPrice(quickViewItem.price)}</div>
                <div className="flex items-center text-gray-600 mb-4">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="text-sm">{quickViewItem.address}, {quickViewItem.city}, {quickViewItem.state}</span>
                </div>
                <div className="flex gap-2">
                  <Link
                    to={`/properties/${quickViewItem.id}`}
                    className="inline-flex-1 text-center bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors duration-200"
                    onClick={() => setQuickViewId(null)}
                  >
                    View Details
                  </Link>
                  <button
                    className="bg-white text-primary-600 border-2 border-primary-600 py-2 px-4 rounded-lg hover:bg-primary-50"
                    onClick={() => setQuickViewId(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery; 