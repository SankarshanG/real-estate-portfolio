import React, { useState, useMemo } from 'react';
import { Grid, List, Filter, Search, MapPin, Bed, Bath, Square } from 'lucide-react';
import { useProperties, PropertyFilters } from '../hooks/useProperties';
import PropertyCard from '../components/PropertyCard';

const PropertiesPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('price-low');
  const [filters, setFilters] = useState<PropertyFilters>({});

  const { properties, loading, error } = useProperties(filters);

  // Get unique cities for filter options
  const cities = [...new Set(properties.map(p => p.city))];

  // Filter and sort properties
  const filteredProperties = useMemo(() => {
    let filtered = properties.filter(property => {
      // Search term
      if (searchTerm && !property.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !property.address.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !property.city.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      return true;
    });

    // Sort properties
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'sqft-low':
        filtered.sort((a, b) => a.square_feet - b.square_feet);
        break;
      case 'sqft-high':
        filtered.sort((a, b) => b.square_feet - a.square_feet);
        break;
      case 'beds':
        filtered.sort((a, b) => b.bedrooms - a.bedrooms);
        break;
      case 'baths':
        filtered.sort((a, b) => b.bathrooms - a.bathrooms);
        break;
      default:
        break;
    }

    return filtered;
  }, [properties, searchTerm, sortBy]);

  const clearFilters = () => {
    setFilters({});
    setSearchTerm('');
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Properties</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Available Properties
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Discover our collection of luxury homes available for quick move-in. 
              Find the perfect property that matches your lifestyle and preferences.
            </p>
          </div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="bg-white border-b border-gray-200 sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search properties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* View Mode and Sort */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-600'}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-600'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="sqft-low">Square Feet: Low to High</option>
                <option value="sqft-high">Square Feet: High to Low</option>
                <option value="beds">Most Bedrooms</option>
                <option value="baths">Most Bathrooms</option>
              </select>
            </div>
          </div>

          {/* Filter Toggles */}
          <div className="mt-4 flex flex-wrap gap-2">
            {cities.map(city => (
              <button
                key={city}
                onClick={() => {
                  const newCity = filters.city === city ? undefined : city;
                  setFilters(prev => ({ ...prev, city: newCity }));
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filters.city === city
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {city}
              </button>
            ))}

            <button
              onClick={clearFilters}
              className="px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Results Count */}
          <div className="mb-8">
            <p className="text-gray-600">
              Showing {filteredProperties.length} of {properties.length} properties
            </p>
          </div>

          {/* Properties */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-pulse">
                  <div className="h-64 bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-6"></div>
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="h-12 bg-gray-200 rounded"></div>
                      <div className="h-12 bg-gray-200 rounded"></div>
                      <div className="h-12 bg-gray-200 rounded"></div>
                    </div>
                    <div className="h-12 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProperties.length > 0 ? (
            <div className={
              viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
                : 'space-y-6'
            }>
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-gray-400 mb-4">
                <Search className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No properties found
              </h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search criteria or filters to find more properties.
              </p>
              <button
                onClick={clearFilters}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default PropertiesPage;