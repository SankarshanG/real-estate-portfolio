export interface Property {
  id: string
  title: string
  address: string
  city: string
  state: string
  zip_code: string
  price: number
  bedrooms: number
  bathrooms: number
  square_feet: number
  lot_size?: number
  year_built?: number
  description: string
  features: string[]
  status: 'available' | 'sold' | 'pending'
  is_featured: boolean
  floor_plan_url?: string
  created_at: string
  updated_at: string
}

export interface PropertyImage {
  id: string
  property_id: string
  image_url: string
  alt_text?: string
  display_order: number
  created_at: string
}

export interface Sale {
  id: string
  property_id: string
  sale_price: number
  sale_date: string
  buyer_name?: string
  agent_name?: string
  created_at: string
}

export interface Lead {
  id: string
  property_id?: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  message?: string
  source: string
  created_at: string
}