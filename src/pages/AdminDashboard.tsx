import React, { useState, useEffect } from 'react'
import { 
  Plus, Edit, Trash2, Upload, Save, X, 
  Home as HomeIcon, Users, DollarSign, TrendingUp
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { Property, PropertyImage } from '../types/database'

const AdminDashboard: React.FC = () => {
  const [user, setUser] = useState<any>(null)
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [properties, setProperties] = useState<Property[]>([])
  const [showPropertyForm, setShowPropertyForm] = useState(false)
  const [editingProperty, setEditingProperty] = useState<Property | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [propertyToDelete, setPropertyToDelete] = useState<string | null>(null)

  useEffect(() => {
    checkUser()
    if (user) {
      fetchProperties()
    }
  }, [user])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
  }

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/admin-dashboard`
        }
      })

      if (error) throw error

      alert('Check your email for the login link!')
    } catch (error) {
      console.error('Error:', error)
      alert('Error sending magic link')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  const fetchProperties = async () => {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching properties:', error)
    } else {
      setProperties(data || [])
    }
  }

  const handleDeleteProperty = async (id: string) => {
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting property:', error)
      alert('Error deleting property')
    } else {
      fetchProperties()
      setShowDeleteModal(false)
      setPropertyToDelete(null)
    }
  }

  const openDeleteModal = (id: string) => {
    setPropertyToDelete(id)
    setShowDeleteModal(true)
  }

  const closeDeleteModal = () => {
    setShowDeleteModal(false)
    setPropertyToDelete(null)
  }

  const markAsSold = async (id: string) => {
    const { error } = await supabase
      .from('properties')
      .update({ status: 'sold' })
      .eq('id', id)

    if (error) {
      console.error('Error updating property:', error)
      alert('Error updating property')
    } else {
      fetchProperties()
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <HomeIcon className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Admin Dashboard</h1>
            <p className="text-slate-600">Sign in to manage your properties</p>
          </div>

          <form onSubmit={handleMagicLink} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="admin@realestate.com"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-blue-400 transition-colors duration-200"
            >
              {isLoading ? 'Sending...' : 'Send Magic Link'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
              <p className="text-slate-600">Manage your real estate portfolio</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-slate-600">Welcome, {user.email}</span>
              <button
                onClick={handleSignOut}
                className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-200 transition-colors duration-200"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Properties</p>
                <p className="text-3xl font-bold text-slate-900">{properties.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <HomeIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Available</p>
                <p className="text-3xl font-bold text-green-600">
                  {properties.filter(p => p.status === 'available').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Sold</p>
                <p className="text-3xl font-bold text-red-600">
                  {properties.filter(p => p.status === 'sold').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {properties.filter(p => p.status === 'pending').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Properties Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">Properties</h2>
              <button
                onClick={() => setShowPropertyForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Property</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left py-3 px-6 font-medium text-slate-700">Property</th>
                  <th className="text-left py-3 px-6 font-medium text-slate-700">Location</th>
                  <th className="text-left py-3 px-6 font-medium text-slate-700">Price</th>
                  <th className="text-left py-3 px-6 font-medium text-slate-700">Status</th>
                  <th className="text-left py-3 px-6 font-medium text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {properties.map((property) => (
                  <tr key={property.id} className="hover:bg-slate-50">
                    <td className="py-4 px-6">
                      <div>
                        <div className="font-medium text-slate-900">{property.title}</div>
                        <div className="text-sm text-slate-600">
                          {property.bedrooms} bed • {property.bathrooms} bath • {property.square_feet.toLocaleString()} sq ft
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-600">
                      {property.city}, {property.state}
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-900">
                      ${property.price.toLocaleString()}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        property.status === 'available' ? 'bg-green-100 text-green-800' :
                        property.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {property.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setEditingProperty(property)}
                          className="text-blue-600 hover:text-blue-700 p-1"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        {property.status === 'available' && (
                          <button
                            onClick={() => markAsSold(property.id)}
                            className="text-green-600 hover:text-green-700 p-1"
                            title="Mark as Sold"
                          >
                            <DollarSign className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => openDeleteModal(property.id)}
                          className="text-red-600 hover:text-red-700 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Property Form Modal */}
      {(showPropertyForm || editingProperty) && (
        <PropertyFormModal
          property={editingProperty}
          onClose={() => {
            setShowPropertyForm(false)
            setEditingProperty(null)
          }}
          onSave={() => {
            fetchProperties()
            setShowPropertyForm(false)
            setEditingProperty(null)
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Delete Property
            </h3>
            <p className="text-slate-600 mb-6">
              Are you sure you want to delete this property? This action cannot be undone.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={closeDeleteModal}
                className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => propertyToDelete && handleDeleteProperty(propertyToDelete)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Property Form Modal Component
interface PropertyFormModalProps {
  property?: Property | null
  onClose: () => void
  onSave: () => void
}

const PropertyFormModal: React.FC<PropertyFormModalProps> = ({ property, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: property?.title || '',
    address: property?.address || '',
    city: property?.city || '',
    state: property?.state || '',
    zip_code: property?.zip_code || '',
    price: property?.price || 0,
    bedrooms: property?.bedrooms || 0,
    bathrooms: property?.bathrooms || 0,
    square_feet: property?.square_feet || 0,
    lot_size: property?.lot_size || 0,
    year_built: property?.year_built || new Date().getFullYear(),
    description: property?.description || '',
    features: property?.features?.join(', ') || '',
    status: property?.status || 'available',
    is_featured: property?.is_featured || false,
    floor_plan_url: property?.floor_plan_url || ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const propertyData = {
        ...formData,
        features: formData.features.split(',').map(f => f.trim()).filter(f => f),
        lot_size: formData.lot_size || null,
        floor_plan_url: formData.floor_plan_url || null
      }

      if (property) {
        // Update existing property
        const { error } = await supabase
          .from('properties')
          .update(propertyData)
          .eq('id', property.id)

        if (error) throw error
      } else {
        // Create new property
        const { error } = await supabase
          .from('properties')
          .insert([propertyData])

        if (error) throw error
      }

      onSave()
    } catch (error) {
      console.error('Error saving property:', error)
      alert('Error saving property')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">
              {property ? 'Edit Property' : 'Add New Property'}
            </h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Property Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Price *
              </label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: parseInt(e.target.value) }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Address *
              </label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                City *
              </label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                State *
              </label>
              <input
                type="text"
                required
                value={formData.state}
                onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                ZIP Code *
              </label>
              <input
                type="text"
                required
                value={formData.zip_code}
                onChange={(e) => setFormData(prev => ({ ...prev, zip_code: e.target.value }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Bedrooms *
              </label>
              <input
                type="number"
                required
                value={formData.bedrooms}
                onChange={(e) => setFormData(prev => ({ ...prev, bedrooms: parseInt(e.target.value) }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Bathrooms *
              </label>
              <input
                type="number"
                step="0.5"
                required
                value={formData.bathrooms}
                onChange={(e) => setFormData(prev => ({ ...prev, bathrooms: parseFloat(e.target.value) }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Square Feet *
              </label>
              <input
                type="number"
                required
                value={formData.square_feet}
                onChange={(e) => setFormData(prev => ({ ...prev, square_feet: parseInt(e.target.value) }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Lot Size (acres)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.lot_size}
                onChange={(e) => setFormData(prev => ({ ...prev, lot_size: parseFloat(e.target.value) }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Year Built
              </label>
              <input
                type="number"
                value={formData.year_built}
                onChange={(e) => setFormData(prev => ({ ...prev, year_built: parseInt(e.target.value) }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Status *
              </label>
              <select
                required
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="available">Available</option>
                <option value="pending">Pending</option>
                <option value="sold">Sold</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Description *
            </label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Features (comma-separated)
            </label>
            <input
              type="text"
              value={formData.features}
              onChange={(e) => setFormData(prev => ({ ...prev, features: e.target.value }))}
              placeholder="Granite countertops, Hardwood floors, Walk-in closet"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Floor Plan URL
            </label>
            <input
              type="url"
              value={formData.floor_plan_url}
              onChange={(e) => setFormData(prev => ({ ...prev, floor_plan_url: e.target.value }))}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_featured"
              checked={formData.is_featured}
              onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
              className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="is_featured" className="ml-2 text-sm font-medium text-slate-700">
              Featured Property
            </label>
          </div>

          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-blue-400 transition-colors duration-200 flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving...' : 'Save Property'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdminDashboard