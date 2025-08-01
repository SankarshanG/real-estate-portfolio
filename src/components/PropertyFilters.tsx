import React from 'react'
import { Search, Filter } from 'lucide-react'
import { PropertyFilters as Filters } from '../hooks/useProperties'

interface PropertyFiltersProps {
  filters: Filters
  onFiltersChange: (filters: Filters) => void
  cities: string[]
}

const PropertyFilters: React.FC<PropertyFiltersProps> = ({ 
  filters, 
  onFiltersChange, 
  cities 
}) => {
  const updateFilter = (key: keyof Filters, value: any) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const clearFilters = () => {
    onFiltersChange({})
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
      <div className="flex items-center space-x-2 mb-6">
        <Filter className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-slate-900">Filter Properties</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* City */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            City
          </label>
          <select
            value={filters.city || ''}
            onChange={(e) => updateFilter('city', e.target.value || undefined)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Cities</option>
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        {/* Bedrooms */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Bedrooms
          </label>
          <div className="flex space-x-2">
            <select
              value={filters.minBeds || ''}
              onChange={(e) => updateFilter('minBeds', e.target.value ? parseInt(e.target.value) : undefined)}
              className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Min</option>
              {[1, 2, 3, 4, 5, 6].map(num => (
                <option key={num} value={num}>{num}+</option>
              ))}
            </select>
            <select
              value={filters.maxBeds || ''}
              onChange={(e) => updateFilter('maxBeds', e.target.value ? parseInt(e.target.value) : undefined)}
              className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Max</option>
              {[1, 2, 3, 4, 5, 6].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Bathrooms */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Bathrooms
          </label>
          <div className="flex space-x-2">
            <select
              value={filters.minBaths || ''}
              onChange={(e) => updateFilter('minBaths', e.target.value ? parseInt(e.target.value) : undefined)}
              className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Min</option>
              {[1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map(num => (
                <option key={num} value={num}>{num}+</option>
              ))}
            </select>
            <select
              value={filters.maxBaths || ''}
              onChange={(e) => updateFilter('maxBaths', e.target.value ? parseInt(e.target.value) : undefined)}
              className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Max</option>
              {[1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Price Range
          </label>
          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="Min Price"
              value={filters.minPrice || ''}
              onChange={(e) => updateFilter('minPrice', e.target.value ? parseInt(e.target.value) : undefined)}
              className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              type="number"
              placeholder="Max Price"
              value={filters.maxPrice || ''}
              onChange={(e) => updateFilter('maxPrice', e.target.value ? parseInt(e.target.value) : undefined)}
              className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Square Feet */}
        <div className="md:col-span-2 lg:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Square Feet
          </label>
          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="Min Sq Ft"
              value={filters.minSqft || ''}
              onChange={(e) => updateFilter('minSqft', e.target.value ? parseInt(e.target.value) : undefined)}
              className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              type="number"
              placeholder="Max Sq Ft"
              value={filters.maxSqft || ''}
              onChange={(e) => updateFilter('maxSqft', e.target.value ? parseInt(e.target.value) : undefined)}
              className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Clear Filters */}
        <div className="md:col-span-2 lg:col-span-2 flex items-end">
          <button
            onClick={clearFilters}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Clear All Filters
          </button>
        </div>
      </div>
    </div>
  )
}

export default PropertyFilters