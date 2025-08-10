import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Save, Settings as SettingsIcon } from 'lucide-react';
import DatabaseService from '../../services/database';

const Settings: React.FC = () => {
  const [soldPropertyVisibility, setSoldPropertyVisibility] = useState<'hide' | 'show'>('show');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const visibility = await DatabaseService.getSoldPropertyVisibility();
        setSoldPropertyVisibility(visibility);
      } catch (error) {
        console.error('Error loading settings:', error);
        setMessage({ type: 'error', text: 'Failed to load settings' });
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);

    try {
      const success = await DatabaseService.updateSetting(
        'sold_property_visibility',
        soldPropertyVisibility,
        'Controls whether sold properties are hidden or shown with SOLD tag'
      );

      if (success) {
        setMessage({ type: 'success', text: 'Settings saved successfully!' });
      } else {
        setMessage({ type: 'error', text: 'Failed to save settings' });
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage({ type: 'error', text: 'Failed to save settings' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

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
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <SettingsIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                <p className="text-sm text-gray-600">Manage application settings</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-max px-4 py-8">
        {/* Settings Form */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Property Display Settings</h2>

            {/* Sold Property Visibility */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sold Property Visibility
              </label>
              <p className="text-sm text-gray-600 mb-4">
                Control how sold properties are displayed on the public website.
              </p>
              
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="soldPropertyVisibility"
                    value="show"
                    checked={soldPropertyVisibility === 'show'}
                    onChange={(e) => setSoldPropertyVisibility(e.target.value as 'hide' | 'show')}
                    className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                  />
                  <div>
                    <span className="font-medium text-gray-900">Show with "SOLD" tag</span>
                    <p className="text-sm text-gray-600">
                      Sold properties remain visible on the website with a red "SOLD" overlay
                    </p>
                  </div>
                </label>
                
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="soldPropertyVisibility"
                    value="hide"
                    checked={soldPropertyVisibility === 'hide'}
                    onChange={(e) => setSoldPropertyVisibility(e.target.value as 'hide' | 'show')}
                    className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                  />
                  <div>
                    <span className="font-medium text-gray-900">Hide completely</span>
                    <p className="text-sm text-gray-600">
                      Sold properties are completely hidden from public listings
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Message */}
            {message && (
              <div className={`mb-4 p-4 rounded-lg ${
                message.type === 'success' 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {message.text}
              </div>
            )}

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center space-x-2 bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
