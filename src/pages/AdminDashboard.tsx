import React, { useState, useEffect } from 'react'
import { 
  Plus, Edit, Trash2, Upload, DollarSign, Home, 
  Users, TrendingUp, X, Save, Eye, EyeOff
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { Property, PropertyImage, Sale, Lead } from '../types/database'

const AdminDashboard: React.FC = () => {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [properties, setProperties] = useState<Property[]>([])
  const [sales, setSales] = useState<Sale[]>([])
  const [leads, setLeads] = useState<Lead[]>([])
  const [showPropertyForm, setShowPropertyForm] = useState(false)
  const [editingProperty, setEditingProperty] = useState<Property | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [propertyToDelete, setPropertyToDelete] = useState<string | null>(null)

  // Auth state
  useEffect(() => {
    checkUser()
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Fetch data
  useEffect(() => {
    if (user) {
      fetchProperties()
      fetchSales()
      fetchLeads()
    }
  }, [user])

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    setUser(session?.user ?? null)
    setLoading(false)
  }

  const signInWithEmail = async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({ email })
    if (error) {
      alert('Error sending magic link: ' + error.message)
    } else {
      alert('Check your email for the magic link!')
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const fetchProperties = async () => {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (data) setProperties(data)
  }

  const fetchSales = async () => {
    const { data, error } = await supabase
      .from('sales')
      .select('*')
      .order('sale_date', { ascending: false })
    
    if (data) setSales(data)
  }

  const fetchLeads = async () => {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (data) setLeads(data)
  }

  const handleDeleteProperty = async () => {
    if (!propertyToDelete) return

    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', propertyToDelete)

    if (!error) {
      fetchProperties()
      setShowDeleteModal(false)
      setPropertyToDelete(null)
    }
  }

  const markAsSold = async (propertyId: string, salePrice: number) => {
    // Update property status
    await supabase
      .from('properties')
      .update({ status: 'sold' })
      .eq('id', propertyId)

    // Add sale record
    await supabase
      .from('sales')
      .insert([{
        property_id: propertyId,
        sale_price: salePrice,
        sale_date: new Date().toISOString(),
        agent_name: user?.email
      }])

    fetchProperties()
    fetchSales()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return <LoginForm onSignIn={signInWithEmail} />
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
              <p className="text-slate-600">Welcome back, {user.email}</p>
            </div>
            <button
              onClick={signOut}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg transition-colors duration-200"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center">
              <Home className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold text-slate-900">{properties.length}</div>
                <div className="text-slate-600">Total Properties</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center">
              <DollarSign className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold text-slate-900">{sales.length}</div>
                <div className="text-slate-600">Total Sales</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-purple-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold text-slate-900">{leads.length}</div>
                <div className="text-slate-600">Total Leads</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-orange-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold text-slate-900">
                  {properties.filter(p => p.status === 'available').length}
                </div>
                <div className="text-slate-600">Available</div>
              </div>
            </div>
          </div>
        </div>

        {/* Properties Management */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-8">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Properties</h2>
              <button
                onClick={() => setShowPropertyForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Property
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Property
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {properties.map((property) => (
                  <tr key={property.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-slate-900">{property.title}</div>
                        <div className="text-sm text-slate-500">{property.city}, {property.state}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900">
                        ${property.price.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        property.status === 'available' ? 'bg-green-100 text-green-800' :
                        property.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {property.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => {
                          setEditingProperty(property)
                          setShowPropertyForm(true)
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setPropertyToDelete(property.id)
                          setShowDeleteModal(true)
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      {property.status === 'available' && (
                        <button
                          onClick={() => {
                            const salePrice = prompt('Enter sale price:')
                            if (salePrice) {
                              markAsSold(property.id, parseInt(salePrice))
                            }
                          }}
                          className="text-green-600 hover:text-green-900"
                        >
                          Mark Sold
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Leads */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-900">Recent Leads</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Property Interest
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Source
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {leads.slice(0, 10).map((lead) => (
                  <tr key={lead.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-slate-900">
                          {lead.first_name} {lead.last_name}
                        </div>
                        <div className="text-sm text-slate-500">{lead.email}</div>
                        {lead.phone && (
                          <div className="text-sm text-slate-500">{lead.phone}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900">
                        {lead.property_id ? 
                          properties.find(p => p.id === lead.property_id)?.title || 'Property not found' :
                          'General inquiry'
                        }
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900">
                        {new Date(lead.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {lead.source}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Property Form Modal */}
      {showPropertyForm && (
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Confirm Delete</h3>
            <p className="text-slate-600 mb-6">
              Are you sure you want to delete this property? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setPropertyToDelete(null)
                }}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProperty}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
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

// Login Form Component
const LoginForm: React.FC<{ onSignIn: (email: string) => void }> = ({ onSignIn }) => {
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      onSignIn(email)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        <div className="text-center mb-8">
          <Home className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Admin Login</h1>
          <p className="text-slate-600">Enter your email to receive a magic link</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
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
              placeholder="admin@example.com"
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
          >
            Send Magic Link
          </button>
        </form>
      </div>
    </div>
  )
}

// Property Form Modal Component
const PropertyFormModal: React.FC<{
  property: Property | null
  onClose: () => void
  onSave: () => void
}> = ({ property, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: property?.title || '',
    address: property?.address || '',
    city: property?.city || '',
    state: property?.state || 'TX',
    zip_code: property?.zip_code || '',
    price: property?.price || 0,
    bedrooms: property?.bedrooms || 1,
    bathrooms: property?.bathrooms || 1,
    square_feet: property?.square_feet || 1000,
    lot_size: property?.lot_size || 0,
    year_built: property?.year_built || new Date().getFullYear(),
    description: property?.description || '',
    features: property?.features?.join(', ') || '',
    status: property?.status || 'available',
    is_featured: property?.is_featured || false,
    floor_plan_url: property?.floor_plan_url || ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const propertyData = {
      ...formData,
      features: formData.features.split(',').map(f => f.trim()).filter(f => f),
      price: Number(formData.price),
      bedrooms: Number(formData.bedrooms),
      bathrooms: Number(formData.bathrooms),
      square_feet: Number(formData.square_feet),
      lot_size: formData.lot_size ? Number(formData.lot_size) : null,
      year_built: formData.year_built ? Number(formData.year_built) : null
    }

    if (property) {
      // Update existing property
      const { error } = await supabase
        .from('properties')
        .update(propertyData)
        .eq('id', property.id)
      
      if (!error) onSave()
    } else {
      // Create new property
      const { error } = await supabase
        .from('properties')
        .insert([propertyData])
      
      if (!error) onSave()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">
              {property ? 'Edit Property' : 'Add New Property'}
            </h3>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Price</label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Address</label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">City</label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">State</label>
              <input
                type="text"
                required
                value={formData.state}
                onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">ZIP Code</label>
              <input
                type="text"
                required
                value={formData.zip_code}
                onChange={(e) => setFormData(prev => ({ ...prev, zip_code: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Bedrooms</label>
              <input
                type="number"
                required
                min="1"
                value={formData.bedrooms}
                onChange={(e) => setFormData(prev => ({ ...prev, bedrooms: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Bathrooms</label>
              <input
                type="number"
                required
                min="1"
                step="0.5"
                value={formData.bathrooms}
                onChange={(e) => setFormData(prev => ({ ...prev, bathrooms: parseFloat(e.target.value) }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Square Feet</label>
              <input
                type="number"
                required
                min="1"
                value={formData.square_feet}
                onChange={(e) => setFormData(prev => ({ ...prev, square_feet: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Year Built</label>
              <input
                type="number"
                min="1900"
                max={new Date().getFullYear()}
                value={formData.year_built}
                onChange={(e) => setFormData(prev => ({ ...prev, year_built: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
            <textarea
              rows={4}
              required
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              placeholder="Garage, Pool, Garden, Security System"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="available">Available</option>
                <option value="pending">Pending</option>
                <option value="sold">Sold</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2 pt-8">
              <input
                type="checkbox"
                id="is_featured"
                checked={formData.is_featured}
                onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="is_featured" className="text-sm font-medium text-slate-700">
                Featured Property
              </label>
            </div>
          </div>

          <div className="flex space-x-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
            >
              <Save className="w-4 h-4 mr-2" />
              {property ? 'Update' : 'Create'} Property
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdminDashboard