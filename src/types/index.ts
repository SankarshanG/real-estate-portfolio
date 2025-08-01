export interface Property {
  id: string;
  title: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  stories: number;
  status: 'available' | 'sold' | 'under-contract';
  type: 'single-family' | 'townhouse' | 'condo';
  community: string;
  floorPlan: string;
  mlsNumber: string;
  images: string[];
  description: string;
  features: string[];
  lotSize?: number;
  yearBuilt?: number;
  garageSpaces?: number;
  isQuickMoveIn: boolean;
}

export interface Community {
  id: string;
  name: string;
  city: string;
  state: string;
  description: string;
  images: string[];
  amenities: string[];
  schools: School[];
  location: {
    latitude: number;
    longitude: number;
  };
  priceRange: {
    min: number;
    max: number;
  };
  homeTypes: string[];
  totalHomes: number;
  availableHomes: number;
}

export interface School {
  name: string;
  type: 'elementary' | 'middle' | 'high';
  rating: number;
  distance: number;
}

export interface FloorPlan {
  id: string;
  name: string;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  stories: number;
  price: number;
  images: string[];
  description: string;
  features: string[];
  community: string;
}

export interface FilterOptions {
  priceRange: [number, number];
  bedrooms: number[];
  bathrooms: number[];
  squareFeet: [number, number];
  communities: string[];
  homeTypes: string[];
  status: string[];
  quickMoveIn: boolean;
}

export interface ContactForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  propertyId?: string;
  communityId?: string;
} 