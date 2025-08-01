import React, { useState, useMemo } from 'react';
import { Search, MapPin } from 'lucide-react';
import { communities } from '../data/communities';
import CommunityCard from '../components/CommunityCard';

const CommunitiesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const cities = [...new Set(communities.map(c => c.city))];

  const filteredCommunities = useMemo(() => {
    return communities.filter(community => {
      const matchesSearch = !searchTerm || 
        community.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        community.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        community.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCity = !selectedCity || community.city === selectedCity;
      
      return matchesSearch && matchesCity;
    });
  }, [searchTerm, selectedCity]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCity('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-900 to-primary-700 text-white py-16">
        <div className="container-max px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Our Communities
            </h1>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              Discover our carefully planned communities across Texas, each offering 
              unique amenities, excellent schools, and the perfect setting for your dream home.
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b border-gray-200 sticky top-20 z-40">
        <div className="container-max px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search communities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* City Filter */}
            <div className="flex items-center space-x-4">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">All Cities</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>

              <button
                onClick={clearFilters}
                className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Communities Grid */}
      <section className="section-padding">
        <div className="container-max">
          {/* Results Count */}
          <div className="mb-8">
            <p className="text-gray-600">
              Showing {filteredCommunities.length} of {communities.length} communities
            </p>
          </div>

          {/* Communities */}
          {filteredCommunities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCommunities.map((community) => (
                <CommunityCard key={community.id} community={community} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-gray-400 mb-4">
                <MapPin className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No communities found
              </h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search criteria to find more communities.
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

export default CommunitiesPage; 