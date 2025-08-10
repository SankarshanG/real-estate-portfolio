import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, Plus, Edit, Trash2, Eye, CheckCircle, ArrowLeft,
  Bed, Bath, Square, MapPin
} from 'lucide-react';
import DatabaseService from '../../services/database';
import { Property } from '../../types';

const PropertyList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('price');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [properties, setProperties] = useState<Property[]>([]);

  // Load properties on component mount
  useEffect(() => {
    const loadProperties = async () => {
      try {
        console.log('Loading properties for admin...');
        const allProperties = await DatabaseService.getAllPropertiesAdmin();
        console.log('Loaded properties:', allProperties);
        
        // Debug logging for images
        allProperties.forEach(property => {
          if (property.images && property.images.length > 0) {
            console.log(`PropertyList: Property ${property.id} has ${property.images.length} images:`, property.images);
          }
        });
        
        setProperties(allProperties);
      } catch (error) {
        console.error('Error loading properties:', error);
      }
    };

    loadProperties();
  }, []);

  const filteredProperties = useMemo(() => {
    let filtered = properties.filter((property: Property) => {
      const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           property.city.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || property.status === statusFilter;
      const matchesType = typeFilter === 'all' || property.type === typeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    });

    // Sort properties
    filtered.sort((a: Property, b: Property) => {
      let aValue: any = a[sortBy as keyof Property];
      let bValue: any = b[sortBy as keyof Property];
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [properties, searchTerm, statusFilter, typeFilter, sortBy, sortOrder]);

  const handleDelete = async (propertyId: string) => {
    const property = properties.find(p => p.id === propertyId);
    const propertyName = property ? property.title : 'this property';
    
    if (window.confirm(`Are you sure you want to delete "${propertyName}"? This action cannot be undone.`)) {
      const success = await DatabaseService.deleteProperty(propertyId);
      if (success) {
        alert(`Property "${propertyName}" has been deleted successfully!`);
        // Refresh properties list
        const updatedProperties = await DatabaseService.getAllPropertiesAdmin();
        setProperties(updatedProperties);
      } else {
        alert('Failed to delete property. Please try again.');
      }
    }
  };

  const handleMarkAsSold = async (propertyId: string) => {
    const property = properties.find(p => p.id === propertyId);
    const propertyName = property ? property.title : 'this property';
    
    if (window.confirm(`Are you sure you want to mark "${propertyName}" as sold?`)) {
      try {
        const success = await DatabaseService.updateProperty(propertyId, {
          status: 'sold',
          update_at: new Date().toISOString()
        });
        
        if (success) {
          alert(`Property "${propertyName}" has been marked as sold successfully!`);
          // Refresh properties list
          const updatedProperties = await DatabaseService.getAllPropertiesAdmin();
          setProperties(updatedProperties);
        } else {
          alert('Failed to mark property as sold. Please try again.');
        }
      } catch (error) {
        console.error('Error marking property as sold:', error);
        alert('Failed to mark property as sold. Please try again.');
      }
    }
  };

  const handleMarkAsAvailable = async (propertyId: string) => {
    const property = properties.find(p => p.id === propertyId);
    const propertyName = property ? property.title : 'this property';
    
    if (window.confirm(`Are you sure you want to mark "${propertyName}" as available?`)) {
      try {
        const success = await DatabaseService.updateProperty(propertyId, {
          status: 'available',
          update_at: new Date().toISOString()
        });
        
        if (success) {
          alert(`Property "${propertyName}" has been marked as available successfully!`);
          // Refresh properties list
          const updatedProperties = await DatabaseService.getAllPropertiesAdmin();
          setProperties(updatedProperties);
        } else {
          alert('Failed to mark property as available. Please try again.');
        }
      } catch (error) {
        console.error('Error marking property as available:', error);
        alert('Failed to mark property as available. Please try again.');
      }
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container-max px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to="/admin"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Dashboard</span>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Properties Management</h1>
                <p className="text-sm text-gray-600">Manage all property listings</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/admin/properties/new"
                className="btn-primary"
              >
                <Plus className="w-5 h-5" />
                <span>Add Property</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container-max px-4 py-8">
        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search properties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="sold">Sold</option>
              <option value="under-contract">Under Contract</option>
            </select>
            
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">All Types</option>
              <option value="single-family">Single Family</option>
              <option value="townhouse">Townhouse</option>
              <option value="condo">Condo</option>
            </select>
            
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field);
                setSortOrder(order as 'asc' | 'desc');
              }}
              className="input-field"
            >
              <option value="price-desc">Price: High to Low</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="squareFeet-desc">Size: Large to Small</option>
              <option value="squareFeet-asc">Size: Small to Large</option>
              <option value="bedrooms-desc">Bedrooms: High to Low</option>
              <option value="bedrooms-asc">Bedrooms: Low to High</option>
              <option value="title-asc">Name: A to Z</option>
              <option value="title-desc">Name: Z to A</option>
            </select>
          </div>
        </div>

        {/* Properties List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Action Legend */}
          <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <span className="font-medium text-gray-700">Actions:</span>
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4 text-primary-600" />
                  <span>View - See property details</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Edit className="w-4 h-4 text-blue-600" />
                  <span>Edit - Modify property information</span>
                </div>
                <div className="flex items-center space-x-1">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Mark Sold - Change status to sold</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Trash2 className="w-4 h-4 text-red-600" />
                  <span>Delete - Remove property</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Floor Plan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProperties.map((property) => (
                  <tr key={property.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-16 w-24">
                          {property.images && property.images.length > 0 ? (
                            <img
                              className="h-16 w-24 object-cover rounded-lg"
                              src={property.images[0]}
                              alt={property.title}
                              onError={(e) => {
                                // Fallback to placeholder if image fails to load
                                const target = e.target as HTMLImageElement;
                                target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTYiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA5NiA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9Ijk2IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNCAyMEgzMlYyOEgyNFYyMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTQ4IDIwSDU2VjI4SDQ4VjIwWiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMzYgMzJINDhWNDBIMzZWMzJaIiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik0xNiA0OEg4MFY1NkgxNlY0OFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';
                              }}
                            />
                          ) : (
                            <div className="h-16 w-24 bg-gray-200 rounded-lg flex items-center justify-center">
                              <div className="text-center">
                                <div className="text-gray-400 text-xs">🏠</div>
                                <div className="text-gray-400 text-xs">No Image</div>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {property.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {property.type || 'Property'}
                          </div>
                          {property.isQuickMoveIn && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Quick Move-In
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm text-gray-900">{property.address}</div>
                          <div className="text-sm text-gray-500">{property.city}, {property.state}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-4 text-sm text-gray-900">
                        <div className="flex items-center">
                          <Bed className="w-4 h-4 text-gray-400 mr-1" />
                          {property.bedrooms}
                        </div>
                        <div className="flex items-center">
                          <Bath className="w-4 h-4 text-gray-400 mr-1" />
                          {property.bathrooms}
                        </div>
                        <div className="flex items-center">
                          <Square className="w-4 h-4 text-gray-400 mr-1" />
                          {(property.squareFeet || property.sqft || 0).toLocaleString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {property.build_plan_url ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                              <span className="text-blue-600 font-semibold text-xs">FP</span>
                            </div>
                            <a
                              href={property.build_plan_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                            >
                              View
                            </a>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">None</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatPrice(property.price)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          property.status === 'available' 
                            ? 'bg-green-100 text-green-800'
                            : property.status === 'sold'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {property.status.replace('-', ' ')}
                        </span>
                        {property.status === 'sold' && (
                          <button
                            onClick={() => handleMarkAsAvailable(property.id)}
                            className="flex items-center space-x-1 text-blue-600 hover:text-blue-900 px-2 py-1 rounded hover:bg-blue-50 transition-colors text-xs"
                            title="Mark Property as Available"
                          >
                            <span>Make Available</span>
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <Link
                          to={`/properties/${property.id}`}
                          className="flex items-center space-x-1 text-primary-600 hover:text-primary-900 px-2 py-1 rounded hover:bg-primary-50 transition-colors"
                          title="View Property Details"
                        >
                          <Eye className="w-4 h-4" />
                          <span className="text-xs">View</span>
                        </Link>
                        <Link
                          to={`/admin/properties/edit/${property.id}`}
                          className="flex items-center space-x-1 text-blue-600 hover:text-blue-900 px-2 py-1 rounded hover:bg-blue-50 transition-colors"
                          title="Edit Property"
                        >
                          <Edit className="w-4 h-4" />
                          <span className="text-xs">Edit</span>
                        </Link>
                        {property.status !== 'sold' && (
                          <button
                            onClick={() => handleMarkAsSold(property.id)}
                            className="flex items-center space-x-1 text-green-600 hover:text-green-900 px-2 py-1 rounded hover:bg-green-50 transition-colors"
                            title="Mark Property as Sold"
                          >
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-xs">Mark Sold</span>
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(property.id)}
                          className="flex items-center space-x-1 text-red-600 hover:text-red-900 px-2 py-1 rounded hover:bg-red-50 transition-colors"
                          title="Delete Property"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span className="text-xs">Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mt-6 bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {filteredProperties.length} of {properties.length} properties
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-700">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                <span>Available: {properties.filter(p => p.status === 'available').length}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                <span>Sold: {properties.filter(p => p.status === 'sold').length}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                <span>Under Contract: {properties.filter(p => p.status === 'under-contract').length}</span>
              </div>
              <div className="border-l border-gray-300 pl-6">
                Total Value: {formatPrice(filteredProperties.reduce((sum: number, p: Property) => sum + p.price, 0))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyList; 