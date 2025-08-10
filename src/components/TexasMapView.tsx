import React, { useState, useCallback } from 'react';
import { Navigation, ZoomIn, ZoomOut } from 'lucide-react';
import { Property } from '../types';

interface TexasMapViewProps {
  title?: string;
  description?: string;
  properties: Property[];
  onPropertyClick?: (property: Property) => void;
  showLegend?: boolean;
  showControls?: boolean;
}

// Simple Texas map coordinates (approximate outline)
const TEXAS_COORDINATES = [
  { x: 50, y: 20 },   // Top-left
  { x: 90, y: 15 },   // Top-right
  { x: 95, y: 40 },   // Right edge
  { x: 85, y: 80 },   // Bottom-right
  { x: 60, y: 85 },   // Bottom
  { x: 40, y: 70 },   // Bottom-left
  { x: 35, y: 50 },   // Left edge
  { x: 50, y: 20 }    // Back to start
];

// Major Texas cities with approximate positions
const TEXAS_CITIES = [
  { name: 'Houston', x: 75, y: 70, population: '2.3M' },
  { name: 'San Antonio', x: 60, y: 65, population: '1.5M' },
  { name: 'Dallas', x: 70, y: 35, population: '1.3M' },
  { name: 'Austin', x: 65, y: 55, population: '978K' },
  { name: 'Fort Worth', x: 68, y: 32, population: '918K' },
  { name: 'El Paso', x: 15, y: 45, population: '679K' },
  { name: 'Arlington', x: 69, y: 33, population: '398K' },
  { name: 'Corpus Christi', x: 75, y: 80, population: '326K' },
  { name: 'Plano', x: 71, y: 34, population: '285K' },
  { name: 'Lubbock', x: 45, y: 25, population: '258K' }
];

const TexasMapView: React.FC<TexasMapViewProps> = ({
  title = "Texas Real Estate Portfolio",
  description = "Interactive map showing our properties across Texas",
  properties = [],
  onPropertyClick,
  showLegend = true,
  showControls = true
}) => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [hoveredProperty, setHoveredProperty] = useState<Property | null>(null);
  const [highlightedStatus, setHighlightedStatus] = useState<'available' | 'sold' | 'reserved' | null>(null);
  const [highlightedType, setHighlightedType] = useState<'residential' | 'commercial' | 'land' | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  const handlePropertyClick = useCallback((property: Property) => {
    setSelectedProperty(property);
    onPropertyClick?.(property);
  }, [onPropertyClick]);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev * 1.2, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev / 1.2, 0.5));
  };

  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const getPropertyColor = (status: string, type?: string) => {
    if (type === 'commercial') {
      return '#8B5CF6'; // Purple
    } else if (type === 'land') {
      return '#F59E0B'; // Orange
    } else {
      switch (status) {
        case 'sold': return '#EF4444'; // Red
        case 'reserved': return '#F59E0B'; // Yellow
        default: return '#10B981'; // Green
      }
    }
  };

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getTypeText = (type?: string) => {
    if (!type) return 'Residential';
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  // Convert lat/lng to SVG coordinates (simplified)
  const latLngToSvg = (lat: number, lng: number) => {
    // Texas roughly spans from 26°N to 37°N and 93°W to 107°W
    const x = ((lng + 107) / 14) * 100; // Convert to 0-100 range
    const y = ((37 - lat) / 11) * 100;  // Convert to 0-100 range
    return { x: x * zoom + pan.x, y: y * zoom + pan.y };
  };

  const filteredProperties = properties.filter(property => {
    if (highlightedStatus && property.status !== highlightedStatus) return false;
    if (highlightedType && property.type !== highlightedType) return false;
    return true;
  });

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            <p className="text-gray-600 mt-1">{description}</p>
          </div>
          {showControls && (
            <div className="flex items-center space-x-2">
              <button
                onClick={handleZoomIn}
                className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={handleZoomOut}
                className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={handleResetView}
                className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                title="Reset View"
              >
                <Navigation className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Map Container */}
      <div className="relative bg-gray-50 p-4">
        <div className="relative overflow-hidden bg-white rounded-lg shadow-inner" style={{ height: '600px' }}>
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 100 100"
            className="w-full h-full"
            style={{
              transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
              transformOrigin: 'center'
            }}
          >
            {/* Texas outline */}
            <path
              d={`M ${TEXAS_COORDINATES.map((coord, i) => 
                `${i === 0 ? 'M' : 'L'} ${coord.x} ${coord.y}`
              ).join(' ')} Z`}
              fill="#E5E7EB"
              stroke="#6B7280"
              strokeWidth="0.5"
            />

            {/* Major cities */}
            {TEXAS_CITIES.map((city, index) => (
              <g key={city.name}>
                <circle
                  cx={city.x}
                  cy={city.y}
                  r="1.5"
                  fill="#3B82F6"
                  stroke="#1E40AF"
                  strokeWidth="0.3"
                />
                <text
                  x={city.x + 2}
                  y={city.y}
                  fontSize="2.5"
                  fill="#1F2937"
                  fontWeight="500"
                >
                  {city.name}
                </text>
                <text
                  x={city.x + 2}
                  y={city.y + 1.5}
                  fontSize="1.8"
                  fill="#6B7280"
                >
                  {city.population}
                </text>
              </g>
            ))}

            {/* Property markers */}
            {filteredProperties.map((property, index) => {
              if (!property.lat || !property.lng) return null;
              const pos = latLngToSvg(property.lat, property.lng);
              const isHovered = hoveredProperty?.id === property.id;
              const isSelected = selectedProperty?.id === property.id;
              
              return (
                <g key={property.id}>
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={isHovered || isSelected ? "2.5" : "2"}
                    fill={getPropertyColor(property.status, property.type)}
                    stroke="#FFFFFF"
                    strokeWidth={isHovered || isSelected ? "0.8" : "0.5"}
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={() => setHoveredProperty(property)}
                    onMouseLeave={() => setHoveredProperty(null)}
                    onClick={() => handlePropertyClick(property)}
                  />
                  
                  {/* Property label on hover/select */}
                  {(isHovered || isSelected) && (
                    <g>
                      <rect
                        x={pos.x + 3}
                        y={pos.y - 8}
                        width="40"
                        height="16"
                        fill="#1F2937"
                        rx="2"
                      />
                      <text
                        x={pos.x + 5}
                        y={pos.y + 2}
                        fontSize="2"
                        fill="#FFFFFF"
                        fontWeight="500"
                      >
                        ${property.price.toLocaleString()}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Property info panel */}
          {selectedProperty && (
            <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg border border-gray-200 max-w-sm">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">{selectedProperty.title}</h3>
                <button
                  onClick={() => setSelectedProperty(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              <div className="space-y-2 text-sm">
                <p className="text-gray-600"><strong>Address:</strong> {selectedProperty.address}</p>
                <p className="text-gray-600"><strong>City:</strong> {selectedProperty.city}</p>
                <p className="text-gray-600"><strong>Price:</strong> ${selectedProperty.price.toLocaleString()}</p>
                <p className="text-gray-600"><strong>Status:</strong>
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                    selectedProperty.status === 'sold' ? 'bg-red-100 text-red-800' :
                    selectedProperty.status === 'reserved' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {getStatusText(selectedProperty.status)}
                  </span>
                </p>
                <p className="text-gray-600"><strong>Type:</strong> {getTypeText(selectedProperty.type)}</p>
                {selectedProperty.sqft && <p className="text-gray-600"><strong>Sq Ft:</strong> {selectedProperty.sqft.toLocaleString()}</p>}
                {selectedProperty.bedrooms && <p className="text-gray-600"><strong>Bedrooms:</strong> {selectedProperty.bedrooms}</p>}
                {selectedProperty.bathrooms && <p className="text-gray-600"><strong>Bathrooms:</strong> {selectedProperty.bathrooms}</p>}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      {showLegend && (
        <div className="p-6 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Status Legend */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Property Status</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Available</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Reserved</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Sold</span>
                </div>
              </div>
            </div>

            {/* Type Legend */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Property Type</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Residential</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Commercial</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Land</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Filters */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Filter Properties</h4>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setHighlightedStatus(null)}
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  highlightedStatus === null ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
                }`}
              >
                All Statuses
              </button>
              <button
                onClick={() => setHighlightedStatus('available')}
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  highlightedStatus === 'available' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                }`}
              >
                Available
              </button>
              <button
                onClick={() => setHighlightedStatus('reserved')}
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  highlightedStatus === 'reserved' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-600'
                }`}
              >
                Reserved
              </button>
              <button
                onClick={() => setHighlightedStatus('sold')}
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  highlightedStatus === 'sold' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-600'
                }`}
              >
                Sold
              </button>
            </div>
            
            {/* Type Filters */}
            <div className="mt-4">
              <h5 className="text-sm font-semibold text-gray-900 mb-2">Filter by Type</h5>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setHighlightedType(null)}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    highlightedType === null ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  All Types
                </button>
                <button
                  onClick={() => setHighlightedType('residential')}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    highlightedType === 'residential' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  Residential
                </button>
                <button
                  onClick={() => setHighlightedType('commercial')}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    highlightedType === 'commercial' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  Commercial
                </button>
                <button
                  onClick={() => setHighlightedType('land')}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    highlightedType === 'land' ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  Land
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TexasMapView; 