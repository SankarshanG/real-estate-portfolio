import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { DatabaseService } from '../services/database';
import PropertyCard from '../components/PropertyCard';
import { Property } from '../types';

const PropertiesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  // Individual filter states
  const [cityFilter, setCityFilter] = useState('');
  const [bedroomsFilter, setBedroomsFilter] = useState<number | ''>('');
  const [bathroomsFilter, setBathroomsFilter] = useState<number | ''>('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);
  const [squareFeetRange, setSquareFeetRange] = useState<[number, number]>([0, 10000]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        console.log('PropertiesPage: Fetching properties...');
        // Use the regular getAllProperties function for public users
        const propertiesData = await DatabaseService.getAllProperties();
        console.log('PropertiesPage: Raw fetched properties:', propertiesData);
        
        // Ensure we have valid properties
        const validProperties = propertiesData.filter(prop => prop && prop.id);
        console.log('PropertiesPage: Valid properties count:', validProperties.length);
        
        setProperties(validProperties);
      } catch (error) {
        console.error('PropertiesPage: Error fetching properties:', error);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);



  // Filter and sort properties
  const filteredProperties = useMemo(() => {
    console.log('PropertiesPage: Filtering properties. Total properties:', properties.length);
    console.log('PropertiesPage: Properties data:', properties);
    
    let filtered = properties.filter(property => {
      console.log('PropertiesPage: Checking property:', property.title);
      console.log('PropertiesPage: Full property data:', property);
      
      // Search term (title, address, city)
      if (searchTerm && !property.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !property.address.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !property.city.toLowerCase().includes(searchTerm.toLowerCase())) {
        console.log('PropertiesPage: Property filtered out by search term');
        return false;
      }

      // City filter
      if (cityFilter && property.city.toLowerCase() !== cityFilter.toLowerCase()) {
        console.log('PropertiesPage: Property filtered out by city. City:', property.city, 'Filter:', cityFilter);
        return false;
      }

      // Bedrooms filter
      if (bedroomsFilter !== '' && property.bedrooms !== bedroomsFilter) {
        console.log('PropertiesPage: Property filtered out by bedrooms. Bedrooms:', property.bedrooms, 'Filter:', bedroomsFilter);
        return false;
      }

      // Bathrooms filter
      if (bathroomsFilter !== '' && property.bathrooms !== bathroomsFilter) {
        console.log('PropertiesPage: Property filtered out by bathrooms. Bathrooms:', property.bathrooms, 'Filter:', bathroomsFilter);
        return false;
      }

      // Price range filter
      const propertyPrice = property.price || 0;
      console.log('PropertiesPage: Property price:', propertyPrice, 'Type:', typeof propertyPrice);
      if (propertyPrice < priceRange[0] || propertyPrice > priceRange[1]) {
        console.log('PropertiesPage: Property filtered out by price range. Price:', propertyPrice, 'Range:', priceRange);
        return false;
      }

      // Square footage filter
      const squareFeet = property.squareFeet || property.sqft || 0;
      if (squareFeet < squareFeetRange[0] || squareFeet > squareFeetRange[1]) {
        console.log('PropertiesPage: Property filtered out by square feet. SqFt:', squareFeet, 'Range:', squareFeetRange);
        return false;
      }

      console.log('PropertiesPage: Property passed all filters:', property.title);
      return true;
    });

    console.log('PropertiesPage: After filtering, properties count:', filtered.length);

    return filtered;
  }, [searchTerm, cityFilter, bedroomsFilter, bathroomsFilter, priceRange, squareFeetRange, properties]);

  const clearFilters = () => {
    setSearchTerm('');
    setCityFilter('');
    setBedroomsFilter('');
    setBathroomsFilter('');
    setPriceRange([0, 10000000]);
    setSquareFeetRange([0, 10000]);
    setShowFilters(false);
  };



  // Get unique cities for dropdown
  const cities = Array.from(new Set(properties.map(p => p.city).filter(Boolean)));
  const bedroomOptions = [1, 2, 3, 4, 5, 6, 7, 8];
  const bathroomOptions = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Loading Properties...</h2>
          <p className="text-gray-600">Please wait while we fetch the available properties.</p>
        </div>
      </div>
    );
  }

  // If no properties from database, show a message
  if (properties.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container-max px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Properties Available</h2>
            <p className="text-gray-600 mb-6">There are currently no properties available for viewing.</p>
            <div className="bg-white rounded-lg shadow-sm p-6 max-w-md mx-auto">
              <p className="text-sm text-gray-500">
                This could be because:
              </p>
              <ul className="text-sm text-gray-500 mt-2 text-left">
                <li>• No properties have been added yet</li>
                <li>• Properties are not published</li>
                <li>• Database connection issues</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container-max px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Premium Properties</h1>
            <p className="text-lg text-gray-600 mb-8">Discover luxury homes and investment properties across Texas</p>
          </div>

          {/* Search and Filter Bar */}
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              {/* Search */}
              <div className="flex-1 w-full lg:w-auto">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search properties..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Filter className="w-5 h-5" />
                <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white border-b border-gray-200">
          <div className="container-max px-4 py-8">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* City Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">City</label>
                  <select
                    value={cityFilter}
                    onChange={(e) => setCityFilter(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">All Cities</option>
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                {/* Bedrooms Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Bedrooms</label>
                  <select
                    value={bedroomsFilter}
                    onChange={(e) => setBedroomsFilter(e.target.value ? Number(e.target.value) : '')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Any Bedrooms</option>
                    {bedroomOptions.map(beds => (
                      <option key={beds} value={beds}>{beds}+ Bedrooms</option>
                    ))}
                  </select>
                </div>

                {/* Bathrooms Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Bathrooms</label>
                  <select
                    value={bathroomsFilter}
                    onChange={(e) => setBathroomsFilter(e.target.value ? Number(e.target.value) : '')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Any Bathrooms</option>
                    {bathroomOptions.map(baths => (
                      <option key={baths} value={baths}>{baths}+ Bathrooms</option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Price Range</label>
                  <div className="flex space-x-3">
                    <div className="flex-1">
                      <input
                        type="number"
                        placeholder="Min Price"
                        value={priceRange[0] === 0 ? '' : priceRange[0]}
                        onChange={(e) => {
                          const value = e.target.value === '' ? 0 : Number(e.target.value);
                          setPriceRange([value, priceRange[1]]);
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    <span className="text-gray-500 self-center px-2">to</span>
                    <div className="flex-1">
                      <input
                        type="number"
                        placeholder="Max Price"
                        value={priceRange[1] === 10000000 ? '' : priceRange[1]}
                        onChange={(e) => {
                          const value = e.target.value === '' ? 10000000 : Number(e.target.value);
                          setPriceRange([priceRange[0], value]);
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Square Footage Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Square Footage</label>
                  <div className="flex space-x-3">
                    <div className="flex-1">
                      <input
                        type="number"
                        placeholder="Min Sq Ft"
                        value={squareFeetRange[0] === 0 ? '' : squareFeetRange[0]}
                        onChange={(e) => {
                          const value = e.target.value === '' ? 0 : Number(e.target.value);
                          setSquareFeetRange([value, squareFeetRange[1]]);
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    <span className="text-gray-500 self-center px-2">to</span>
                    <div className="flex-1">
                      <input
                        type="number"
                        placeholder="Max Sq Ft"
                        value={squareFeetRange[1] === 10000 ? '' : squareFeetRange[1]}
                        onChange={(e) => {
                          const value = e.target.value === '' ? 10000 : Number(e.target.value);
                          setSquareFeetRange([squareFeetRange[0], value]);
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Clear Filters */}
                <div className="flex items-end">
                  <button
                    onClick={clearFilters}
                    className="flex items-center space-x-2 px-6 py-3 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    <span>Clear All</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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