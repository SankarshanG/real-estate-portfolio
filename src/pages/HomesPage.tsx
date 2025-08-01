import React, { useState, useMemo } from 'react'
import { Search, Grid, List } from 'lucide-react'
import { useProperties, PropertyFilters } from '../hooks/useProperties'
import PropertyCard from '../components/PropertyCard'
import PropertyFilters from '../components/PropertyFilters'

const HomesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<PropertyFilters>({})
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  
  const { properties, loading, error } = useProperties(filters)

  // Filter properties by search term
  const filteredProperties = useMemo(() => {
    if (!searchTerm) return properties
    
    return properties.filter(property =>
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.city.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [properties, searchTerm])

  // Get unique cities for filter dropdown
  const cities = useMemo(() => {
    const uniqueCities = [...new Set(properties.map(p => p.city))]
    return uniqueCities.sort()
  }, [properties])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Error Loading Properties</h2>
          <p className="text-slate-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Available Homes</h1>
              <p className="text-slate-600">
                {loading ? 'Loading...' : `${filteredProperties.length} properties found`}
              </p>
            </div>
            
            {/* Search Bar */}
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by title, address, or city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <PropertyFilters
          filters={filters}
          onFiltersChange={setFilters}
          cities={cities}
        />

        {/* View Mode Toggle */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-slate-700">View:</span>
            <div className="flex bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors duration-200 ${
                  viewMode === 'grid'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors duration-200 ${
                  viewMode === 'list'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="text-sm text-slate-600">
            Showing {filteredProperties.length} of {properties.length} properties
          </div>
        </div>

        {/* Properties Grid/List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-pulse">
                <div className="h-64 bg-slate-200"></div>
                <div className="p-6">
                  <div className="h-6 bg-slate-200 rounded mb-4"></div>
                  <div className="h-4 bg-slate-200 rounded mb-6"></div>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="h-12 bg-slate-200 rounded"></div>
                    <div className="h-12 bg-slate-200 rounded"></div>
                    <div className="h-12 bg-slate-200 rounded"></div>
                  </div>
                  <div className="h-12 bg-slate-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-slate-400 mb-4">
              <Home className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No Properties Found</h3>
            <p className="text-slate-600 mb-6">
              Try adjusting your search criteria or filters to find more properties.
            </p>
            <button
              onClick={() => {
                setSearchTerm('')
                setFilters({})
              }}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
              : 'space-y-6'
          }>
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default HomesPage