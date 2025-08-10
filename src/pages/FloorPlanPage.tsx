import React, { useState } from 'react';

import TexasMapView from '../components/TexasMapView';
import { sampleTexasProperties } from '../data/texasProperties';
import { Property } from '../types';

import SEO from '../components/SEO';

const FloorPlanPage: React.FC = () => {
  const [selectedView, setSelectedView] = useState<'texas' | 'communities'>('texas');


  const handlePropertyClick = (property: Property) => {
    console.log('Property clicked:', property);
  };

  const getViewData = () => {
    if (selectedView === 'texas') {
      return {
        title: "Texas Real Estate Portfolio - Interactive Map",
        description: "Explore our properties across Texas with our interactive map showing available, reserved, and sold properties",
        properties: sampleTexasProperties
      };
    } else {
      return {
        title: "Community Properties - Luxury Heights",
        description: "Interactive view of our luxury community properties with premium amenities",
        properties: sampleTexasProperties.filter(p => p.type === 'residential')
      };
    }
  };

  const viewData = getViewData();

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title="Interactive Property Maps | Premium Real Estate Properties"
        description="Explore interactive property maps showing available, sold, and reserved properties across Texas. Find your perfect property with our detailed maps."
        keywords="interactive property maps, Texas real estate, property availability, sold properties, property maps, real estate maps"
        url="https://your-domain.com/floor-plans"
        type="website"
      />

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container-max px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Interactive Property Maps</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our interactive property maps to see available, sold, and reserved properties across Texas
            </p>
          </div>
        </div>
      </div>

      <div className="container-max px-4 py-8">
        {/* View Selector */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Select View</h2>
              <p className="text-gray-600">Choose a view to explore our properties</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedView('texas')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedView === 'texas'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Texas Portfolio
              </button>
              <button
                onClick={() => setSelectedView('communities')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedView === 'communities'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Community Properties
              </button>
            </div>
          </div>
        </div>

        {/* Interactive Property Map */}
        <TexasMapView
          title={viewData.title}
          description={viewData.description}
          properties={viewData.properties}
          onPropertyClick={handlePropertyClick}
          showLegend={true}
        />

        {/* Property Statistics */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Portfolio Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {sampleTexasProperties.filter(p => p.status === 'available').length}
              </div>
              <div className="text-sm text-green-800 font-medium">Available Properties</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-3xl font-bold text-yellow-600 mb-2">
                {sampleTexasProperties.filter(p => p.status === 'reserved').length}
              </div>
              <div className="text-sm text-yellow-800 font-medium">Reserved Properties</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-3xl font-bold text-red-600 mb-2">
                {sampleTexasProperties.filter(p => p.status === 'sold').length}
              </div>
              <div className="text-sm text-red-800 font-medium">Sold Properties</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloorPlanPage; 