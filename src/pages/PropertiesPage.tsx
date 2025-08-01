import React, { useState, useMemo } from 'react';
import { Grid, List, Filter, Search, MapPin, Bed, Bath, Square } from 'lucide-react';
import { properties } from '../data/properties';
import PropertyCard from '../components/PropertyCard';
import { Property, FilterOptions } from '../types';

const PropertiesPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('price-low');
  const [filters, setFilters] = useState<FilterOptions>({
    priceRange: [0, 2000000],
    bedrooms: [],
    bathrooms: [],
    squareFeet: [0, 10000],
    communities: [],
    homeTypes: [],
    status: [],
    quickMoveIn: false,
  });

  // Get unique values for filter options
  const communities = [...new Set(properties.map(p => p.community))];
  const homeTypes = [...new Set(properties.map(p => p.type))];
  const statuses = [...new Set(properties.map(p => p.status))];

  // Filter and sort properties
  const filteredProperties = useMemo(() => {
    let filtered = properties.filter(property => {
      // Search term
      if (searchTerm && !property.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !property.address.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !property.city.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // Price range
      if (property.price < filters.priceRange[0] || property.price > filters.priceRange[1]) {
        return false;
      }

      // Bedrooms
      if (filters.bedrooms.length > 0 && !filters.bedrooms.includes(property.bedrooms)) {
        return false;
      }

      // Bathrooms
      if (filters.bathrooms.length > 0 && !filters.bathrooms.includes(property.bathrooms)) {
        return false;
      }

      // Square feet
      if (property.squareFeet < filters.squareFeet[0] || property.squareFeet > filters.squareFeet[1]) {
        return false;
      }

      // Communities
      if (filters.communities.length > 0 && !filters.communities.includes(property.community)) {
        return false;
      }

      // Home types
      if (filters.homeTypes.length > 0 && !filters.homeTypes.includes(property.type)) {
        return false;
      }

      // Status
      if (filters.status.length > 0 && !filters.status.includes(property.status)) {
        return false;
      }

      // Quick move-in
      if (filters.quickMoveIn && !property.isQuickMoveIn) {
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
        filtered.sort((a, b) => a.squareFeet - b.squareFeet);
        break;
      case 'sqft-high':
        filtered.sort((a, b) => b.squareFeet - a.squareFeet);
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
  }, [searchTerm, filters, sortBy]);

  const clearFilters = () => {
    setFilters({
      priceRange: [0, 2000000],
      bedrooms: [],
      bathrooms: [],
      squareFeet: [0, 10000],
      communities: [],
      homeTypes: [],
      status: [],
      quickMoveIn: false,
    });
    setSearchTerm('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-900 to-primary-700 text-white py-16">
        <div className="container-max px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Available Properties
            </h1>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              Discover our collection of luxury homes available for quick move-in. 
              Find the perfect property that matches your lifestyle and preferences.
            </p>
          </div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="bg-white border-b border-gray-200 sticky top-20 z-40">
        <div className="container-max px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search properties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
            <button
              onClick={() => setFilters(prev => ({ ...prev, quickMoveIn: !prev.quickMoveIn }))}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filters.quickMoveIn 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Quick Move-In
            </button>
            
            {communities.map(community => (
              <button
                key={community}
                onClick={() => {
                  const newCommunities = filters.communities.includes(community)
                    ? filters.communities.filter(c => c !== community)
                    : [...filters.communities, community];
                  setFilters(prev => ({ ...prev, communities: newCommunities }));
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filters.communities.includes(community)
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {community}
              </button>
            ))}

            {homeTypes.map(type => (
              <button
                key={type}
                onClick={() => {
                  const newTypes = filters.homeTypes.includes(type)
                    ? filters.homeTypes.filter(t => t !== type)
                    : [...filters.homeTypes, type];
                  setFilters(prev => ({ ...prev, homeTypes: newTypes }));
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filters.homeTypes.includes(type)
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type.replace('-', ' ')}
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
      <section className="section-padding">
        <div className="container-max">
          {/* Results Count */}
          <div className="mb-8">
            <p className="text-gray-600">
              Showing {filteredProperties.length} of {properties.length} properties
            </p>
          </div>

          {/* Properties */}
          {filteredProperties.length > 0 ? (
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
                className="btn-primary"
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