export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  bedrooms: number;
  sqft?: number;
  squareFeet?: number;
  bathrooms?: number;
  stories?: number;
  address: string;
  city: string;
  state: string;
  zip_code?: string;
  zipCode?: string;
  lat?: number;
  lng?: number;
  status: string;
  type?: string;
  community?: string;
  build_plan_url?: string;
  published?: boolean;
  update_at?: string;
  // Additional fields used in PropertyDetailPage
  garageSpaces?: number;
  features?: string[];
  mlsNumber?: string;
  floorPlan?: string;
  yearBuilt?: number;
  lotSize?: number;
  images?: string[];
  isQuickMoveIn?: boolean;
}

export interface Image {
  id: string;
  property_id: string;
  image_url: string;
  caption: string;
  order: number;
  created_at: string;
}

export interface Lead {
  id: string;
  property_id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  created_at: string;
}

export interface Sale {
  id: string;
  label: string;
  discount_pct: number;
  starts_at: string;
  ends_at: string;
  active: boolean;
  created_at: string;
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

export interface Settings {
  id: string;
  key: string;
  value: string;
  description?: string;
  created_at: string;
  updated_at: string;
} 