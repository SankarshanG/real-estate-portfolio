import { Community } from '../types';

export const communities: Community[] = [
  {
    id: '1',
    name: 'M3 Ranch 80s',
    city: 'Mansfield',
    state: 'TX',
    description: 'Luxury estate community featuring large lots, custom homes, and premium amenities. Perfect for families seeking privacy and space.',
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop'
    ],
    amenities: [
      'Community Pool & Spa',
      'Tennis Courts',
      'Walking Trails',
      'Clubhouse',
      'Gated Entry',
      'Landscaping Maintenance'
    ],
    schools: [
      { name: 'Mansfield Elementary', type: 'elementary', rating: 9, distance: 0.8 },
      { name: 'Mansfield Middle School', type: 'middle', rating: 8, distance: 1.2 },
      { name: 'Mansfield High School', type: 'high', rating: 9, distance: 1.5 }
    ],
    location: { latitude: 32.5632, longitude: -97.1417 },
    priceRange: { min: 800000, max: 1200000 },
    homeTypes: ['Single-Family'],
    totalHomes: 80,
    availableHomes: 12
  },
  {
    id: '2',
    name: 'Reunion 50s',
    city: 'Rhome',
    state: 'TX',
    description: 'Modern townhome community with contemporary design and convenient amenities. Ideal for professionals and small families.',
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop'
    ],
    amenities: [
      'Fitness Center',
      'Community Pool',
      'Dog Park',
      'Business Center',
      'Package Lockers',
      'Covered Parking'
    ],
    schools: [
      { name: 'Rhome Elementary', type: 'elementary', rating: 8, distance: 0.5 },
      { name: 'Rhome Middle School', type: 'middle', rating: 7, distance: 0.8 },
      { name: 'Northwest High School', type: 'high', rating: 8, distance: 1.0 }
    ],
    location: { latitude: 33.0534, longitude: -97.4717 },
    priceRange: { min: 500000, max: 700000 },
    homeTypes: ['Townhouse'],
    totalHomes: 50,
    availableHomes: 8
  },
  {
    id: '3',
    name: 'Mosaic 60s',
    city: 'Celina',
    state: 'TX',
    description: 'Premium estate community featuring luxury homes with custom finishes and resort-style amenities.',
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop'
    ],
    amenities: [
      'Resort-Style Pool',
      'Golf Course Access',
      'Wine Cellar',
      'Home Theater',
      'Private Parks',
      'Concierge Service'
    ],
    schools: [
      { name: 'Celina Elementary', type: 'elementary', rating: 10, distance: 0.3 },
      { name: 'Celina Middle School', type: 'middle', rating: 9, distance: 0.6 },
      { name: 'Celina High School', type: 'high', rating: 10, distance: 0.9 }
    ],
    location: { latitude: 33.3243, longitude: -96.7844 },
    priceRange: { min: 850000, max: 1500000 },
    homeTypes: ['Single-Family'],
    totalHomes: 60,
    availableHomes: 15
  },
  {
    id: '4',
    name: 'Reunion 60s',
    city: 'Rhome',
    state: 'TX',
    description: 'Family-friendly community with ranch-style homes and excellent schools. Perfect for families seeking comfort and convenience.',
    images: [
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop'
    ],
    amenities: [
      'Community Pool',
      'Playground',
      'Walking Trails',
      'Picnic Areas',
      'Basketball Court',
      'Community Garden'
    ],
    schools: [
      { name: 'Rhome Elementary', type: 'elementary', rating: 8, distance: 0.4 },
      { name: 'Rhome Middle School', type: 'middle', rating: 7, distance: 0.7 },
      { name: 'Northwest High School', type: 'high', rating: 8, distance: 0.9 }
    ],
    location: { latitude: 33.0534, longitude: -97.4717 },
    priceRange: { min: 500000, max: 650000 },
    homeTypes: ['Single-Family'],
    totalHomes: 60,
    availableHomes: 10
  },
  {
    id: '5',
    name: 'Ventana',
    city: 'Fort Worth',
    state: 'TX',
    description: 'Modern community in Fort Worth featuring energy-efficient homes and smart technology integration.',
    images: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop'
    ],
    amenities: [
      'Smart Home Features',
      'Community Pool',
      'Fitness Center',
      'Walking Trails',
      'EV Charging Stations',
      'Community Events'
    ],
    schools: [
      { name: 'Fort Worth Elementary', type: 'elementary', rating: 7, distance: 0.6 },
      { name: 'Fort Worth Middle School', type: 'middle', rating: 8, distance: 0.9 },
      { name: 'Fort Worth High School', type: 'high', rating: 8, distance: 1.2 }
    ],
    location: { latitude: 32.7555, longitude: -97.3308 },
    priceRange: { min: 450000, max: 600000 },
    homeTypes: ['Single-Family'],
    totalHomes: 45,
    availableHomes: 6
  }
]; 