import React, { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { ArrowLeft, ArrowRight, LayoutGrid, Image, Settings, Plus, Home } from 'lucide-react';

interface AdminWrapperProps {
  children: ReactNode;
}

const AdminShell: React.FC<{ children: ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  const sectionLabel = (() => {
    if (location.pathname === '/admin') return 'Dashboard';
    if (location.pathname.startsWith('/admin/properties/new')) return 'Add Property';
    if (location.pathname.startsWith('/admin/properties/edit')) return 'Edit Property';
    if (location.pathname.startsWith('/admin/properties')) return 'Properties';
    if (location.pathname.startsWith('/admin/images')) return 'Images';
    if (location.pathname.startsWith('/admin/settings')) return 'Settings';
    return 'Admin';
  })();

  return (
    <div className="w-full">
      {/* Admin sub-navigation */}
      <div className="bg-white/95 backdrop-blur sticky top-0 z-30 border-b">
        <div className="container-max px-4 py-2">
          <div className="flex items-center justify-between">
            {/* Back/Forward and crumb */}
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50"
                title="Go Back"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => navigate(1)}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50"
                title="Go Forward"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
              <div className="text-sm text-gray-600 hidden sm:block">
                <span className="text-gray-500">Admin</span>
                <span className="mx-1">/</span>
                <span className="text-gray-900 font-medium">{sectionLabel}</span>
              </div>
            </div>

            {/* Quick links */}
            <nav className="flex items-center gap-1">
              <Link
                to="/admin"
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm border ${isActive('/admin') ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}
                title="Dashboard"
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
              <Link
                to="/admin/properties"
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm border ${isActive('/admin/properties') && !location.pathname.includes('/new') && !location.pathname.includes('/edit') ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}
                title="Properties"
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Properties</span>
              </Link>
              <Link
                to="/admin/properties/new"
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm border ${location.pathname.includes('/admin/properties/new') ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}
                title="Add Property"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add</span>
              </Link>
              <Link
                to="/admin/images"
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm border ${isActive('/admin/images') ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}
                title="Images"
              >
                <Image className="w-4 h-4" />
                <span className="hidden sm:inline">Images</span>
              </Link>
              <Link
                to="/admin/settings"
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm border ${isActive('/admin/settings') ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}
                title="Settings"
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Settings</span>
              </Link>
            </nav>
          </div>
        </div>
      </div>

      {/* Admin page content */}
      {children}
    </div>
  );
};

const AdminWrapper: React.FC<AdminWrapperProps> = ({ children }) => {
  return (
    <AuthProvider>
      <AdminShell>
        {children}
      </AdminShell>
    </AuthProvider>
  );
};

export default AdminWrapper;
