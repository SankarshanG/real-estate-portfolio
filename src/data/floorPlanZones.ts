export interface Zone {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  status: 'available' | 'sold' | 'reserved';
  price?: string;
  sqft?: number;
  bedrooms?: number;
  bathrooms?: number;
}

export const sampleFloorPlanZones: Zone[] = [
  // Premium Front Row Lots (Water View)
  {
    id: 'lot-1',
    x: 8,
    y: 8,
    width: 18,
    height: 22,
    label: 'Premium Lot 1',
    status: 'sold',
    price: '1,250,000',
    sqft: 4200,
    bedrooms: 5,
    bathrooms: 5.5
  },
  {
    id: 'lot-2',
    x: 30,
    y: 8,
    width: 18,
    height: 22,
    label: 'Premium Lot 2',
    status: 'available',
    price: '1,275,000',
    sqft: 4300,
    bedrooms: 5,
    bathrooms: 6
  },
  {
    id: 'lot-3',
    x: 52,
    y: 8,
    width: 18,
    height: 22,
    label: 'Premium Lot 3',
    status: 'reserved',
    price: '1,260,000',
    sqft: 4250,
    bedrooms: 5,
    bathrooms: 5.5
  },
  {
    id: 'lot-4',
    x: 74,
    y: 8,
    width: 18,
    height: 22,
    label: 'Premium Lot 4',
    status: 'available',
    price: '1,280,000',
    sqft: 4350,
    bedrooms: 5,
    bathrooms: 6
  },

  // Second Row - Standard Premium Lots
  {
    id: 'lot-5',
    x: 8,
    y: 35,
    width: 18,
    height: 20,
    label: 'Standard Lot 5',
    status: 'sold',
    price: '980,000',
    sqft: 3500,
    bedrooms: 4,
    bathrooms: 4.5
  },
  {
    id: 'lot-6',
    x: 30,
    y: 35,
    width: 18,
    height: 20,
    label: 'Standard Lot 6',
    status: 'available',
    price: '995,000',
    sqft: 3550,
    bedrooms: 4,
    bathrooms: 4.5
  },
  {
    id: 'lot-7',
    x: 52,
    y: 35,
    width: 18,
    height: 20,
    label: 'Standard Lot 7',
    status: 'available',
    price: '990,000',
    sqft: 3520,
    bedrooms: 4,
    bathrooms: 4.5
  },
  {
    id: 'lot-8',
    x: 74,
    y: 35,
    width: 18,
    height: 20,
    label: 'Standard Lot 8',
    status: 'reserved',
    price: '985,000',
    sqft: 3500,
    bedrooms: 4,
    bathrooms: 4.5
  },

  // Third Row - Value Lots
  {
    id: 'lot-9',
    x: 8,
    y: 60,
    width: 18,
    height: 18,
    label: 'Value Lot 9',
    status: 'available',
    price: '875,000',
    sqft: 3200,
    bedrooms: 4,
    bathrooms: 4
  },
  {
    id: 'lot-10',
    x: 30,
    y: 60,
    width: 18,
    height: 18,
    label: 'Value Lot 10',
    status: 'sold',
    price: '890,000',
    sqft: 3250,
    bedrooms: 4,
    bathrooms: 4
  },
  {
    id: 'lot-11',
    x: 52,
    y: 60,
    width: 18,
    height: 18,
    label: 'Value Lot 11',
    status: 'available',
    price: '880,000',
    sqft: 3220,
    bedrooms: 4,
    bathrooms: 4
  },
  {
    id: 'lot-12',
    x: 74,
    y: 60,
    width: 18,
    height: 18,
    label: 'Value Lot 12',
    status: 'available',
    price: '885,000',
    sqft: 3240,
    bedrooms: 4,
    bathrooms: 4
  },

  // Corner Lots (Premium)
  {
    id: 'corner-lot-a',
    x: 2,
    y: 2,
    width: 22,
    height: 25,
    label: 'Corner Lot A',
    status: 'sold',
    price: '1,450,000',
    sqft: 4800,
    bedrooms: 6,
    bathrooms: 6.5
  },
  {
    id: 'corner-lot-b',
    x: 76,
    y: 2,
    width: 22,
    height: 25,
    label: 'Corner Lot B',
    status: 'available',
    price: '1,475,000',
    sqft: 4900,
    bedrooms: 6,
    bathrooms: 6.5
  },

  // Community Amenities
  {
    id: 'clubhouse',
    x: 35,
    y: 45,
    width: 30,
    height: 15,
    label: 'Clubhouse',
    status: 'available',
    price: 'N/A',
    sqft: 8000,
    bedrooms: 0,
    bathrooms: 0
  },
  {
    id: 'pool-area',
    x: 40,
    y: 80,
    width: 20,
    height: 12,
    label: 'Pool Area',
    status: 'available',
    price: 'N/A',
    sqft: 0,
    bedrooms: 0,
    bathrooms: 0
  }
];

// Alternative floor plan for a different community
export const communityFloorPlanZones: Zone[] = [
  {
    id: 'community-lot-1',
    x: 10,
    y: 15,
    width: 20,
    height: 25,
    label: 'Premium Lot A',
    status: 'sold',
    price: '1,250,000',
    sqft: 4200,
    bedrooms: 5,
    bathrooms: 6
  },
  {
    id: 'community-lot-2',
    x: 35,
    y: 15,
    width: 20,
    height: 25,
    label: 'Premium Lot B',
    status: 'available',
    price: '1,275,000',
    sqft: 4300,
    bedrooms: 5,
    bathrooms: 6
  },
  {
    id: 'community-lot-3',
    x: 60,
    y: 15,
    width: 20,
    height: 25,
    label: 'Premium Lot C',
    status: 'reserved',
    price: '1,260,000',
    sqft: 4250,
    bedrooms: 5,
    bathrooms: 6
  },
  {
    id: 'community-lot-4',
    x: 10,
    y: 45,
    width: 20,
    height: 25,
    label: 'Standard Lot D',
    status: 'available',
    price: '950,000',
    sqft: 3200,
    bedrooms: 4,
    bathrooms: 4.5
  },
  {
    id: 'community-lot-5',
    x: 35,
    y: 45,
    width: 20,
    height: 25,
    label: 'Standard Lot E',
    status: 'sold',
    price: '965,000',
    sqft: 3250,
    bedrooms: 4,
    bathrooms: 4.5
  },
  {
    id: 'community-lot-6',
    x: 60,
    y: 45,
    width: 20,
    height: 25,
    label: 'Standard Lot F',
    status: 'available',
    price: '955,000',
    sqft: 3220,
    bedrooms: 4,
    bathrooms: 4.5
  }
]; 