import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Home, Plus, Edit, Image, 
  DollarSign, TrendingUp, LogOut, Settings
} from 'lucide-react';
import DatabaseService from '../services/database';
import { communities } from '../data/communities';
import { useAuth } from '../contexts/AuthContext';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [stats, setStats] = useState({
    totalProperties: 0,
    availableProperties: 0,
    underContractProperties: 0,
    soldProperties: 0,
    totalCommunities: communities.length,
    totalValue: 0,
  });

  const [isCreatingSamples, setIsCreatingSamples] = useState(false);

  // Load statistics
  useEffect(() => {
    const loadStats = async () => {
      try {
        const allProperties = await DatabaseService.getAllProperties();
        const totalProperties = allProperties.length;
        const availableProperties = allProperties.filter(p => p.status === 'available').length;
        const underContractProperties = allProperties.filter(p => p.status === 'under-contract').length;
        const soldProperties = allProperties.filter(p => p.status === 'sold').length;
        const totalValue = allProperties.reduce((sum, p) => sum + p.price, 0);
        
        setStats({
          totalProperties,
          availableProperties,
          underContractProperties,
          soldProperties,
          totalCommunities: communities.length,
          totalValue,
        });
      } catch (error) {
        console.error('Error loading stats:', error);
      }
    };

    loadStats();
  }, []);

  const createSampleData = async () => {
    setIsCreatingSamples(true);
    try {
      await DatabaseService.createSampleProperties();
      await DatabaseService.createSampleSales();
      alert('Sample properties and sales created successfully!');
      // Reload stats
      const allProperties = await DatabaseService.getAllProperties();
      const totalProperties = allProperties.length;
      const availableProperties = allProperties.filter(p => p.status === 'available').length;
      const underContractProperties = allProperties.filter(p => p.status === 'under-contract').length;
      const soldProperties = allProperties.filter(p => p.status === 'sold').length;
      const totalValue = allProperties.reduce((sum, p) => sum + p.price, 0);
      
      setStats({
        totalProperties,
        availableProperties,
        underContractProperties,
        soldProperties,
        totalCommunities: communities.length,
        totalValue,
      });
    } catch (error) {
      console.error('Error creating sample data:', error);
      alert('Error creating sample data. Please try again.');
    } finally {
      setIsCreatingSamples(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container-max px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">Premium Real Estate Management</p>
              </div>
            </div>
            <button 
              onClick={() => {
                logout();
                navigate('/admin/login');
              }}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container-max px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Properties</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalProperties}</p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <Home className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Available</p>
                <p className="text-3xl font-bold text-green-600">{stats.availableProperties}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Under Contract</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.underContractProperties}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Edit className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Sold</p>
                <p className="text-3xl font-bold text-red-600">{stats.soldProperties}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/admin/properties/new"
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
            >
              <Plus className="w-6 h-6 text-primary-600" />
              <div>
                <p className="font-medium text-gray-900">Add Property</p>
                <p className="text-sm text-gray-600">Create new listing</p>
              </div>
            </Link>

            <Link
              to="/admin/properties"
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
            >
              <Edit className="w-6 h-6 text-primary-600" />
              <div>
                <p className="font-medium text-gray-900">Manage Properties</p>
                <p className="text-sm text-gray-600">View and edit listings</p>
              </div>
            </Link>

            <Link
              to="/admin/images"
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
            >
              <Image className="w-6 h-6 text-primary-600" />
              <div>
                <p className="font-medium text-gray-900">Manage Images</p>
                <p className="text-sm text-gray-600">Upload and organize</p>
              </div>
            </Link>

            <Link
              to="/admin/settings"
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
            >
              <Settings className="w-6 h-6 text-primary-600" />
              <div>
                <p className="font-medium text-gray-900">Settings</p>
                <p className="text-sm text-gray-600">Configure display options</p>
              </div>
            </Link>

            <button
              onClick={createSampleData}
              disabled={isCreatingSamples}
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-6 h-6 text-primary-600" />
              <div>
                <p className="font-medium text-gray-900">
                  {isCreatingSamples ? 'Creating...' : 'Sample Data'}
                </p>
                <p className="text-sm text-gray-600">
                  {isCreatingSamples ? 'Please wait...' : 'Add sample properties & sales'}
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Plus className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">New property added</p>
                <p className="text-xs text-gray-600">Luxury Family Home in Mansfield - 2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Edit className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Property updated</p>
                <p className="text-xs text-gray-600">Modern Townhome in Rhome - 4 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-red-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Property sold</p>
                <p className="text-xs text-gray-600">Luxury Estate in Fort Worth - 1 day ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 