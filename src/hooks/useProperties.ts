import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Property, PropertyImage } from '../types/database'

// Mock data for when Supabase is not available
const mockProperties: PropertyWithImages[] = [
  {
    id: '1',
    title: 'Luxury Modern Home in Frisco',
    address: '123 Highland Drive',
    city: 'Frisco',
    state: 'TX',
    zip_code: '75034',
    price: 650000,
    bedrooms: 4,
    bathrooms: 3.5,
    square_feet: 3200,
    lot_size: 8500,
    year_built: 2023,
    description: 'Beautiful modern home featuring an open floor plan, gourmet kitchen with granite countertops, spacious master suite, and covered patio perfect for entertaining.',
    features: ['Garage', 'Pool', 'Garden', 'Security System', 'Hardwood Floors'],
    status: 'available',
    is_featured: true,
    floor_plan_url: null,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    images: [
      {
        id: '1',
        property_id: '1',
        image_url: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
        alt_text: 'Front exterior view',
        display_order: 1,
        created_at: '2024-01-15T10:00:00Z'
      },
      {
        id: '2',
        property_id: '1',
        image_url: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
        alt_text: 'Living room',
        display_order: 2,
        created_at: '2024-01-15T10:00:00Z'
      }
    ]
  },
  {
    id: '2',
    title: 'Charming Family Home in Plano',
    address: '456 Oak Street',
    city: 'Plano',
    state: 'TX',
    zip_code: '75075',
    price: 485000,
    bedrooms: 3,
    bathrooms: 2.5,
    square_feet: 2400,
    lot_size: 7200,
    year_built: 2022,
    description: 'Charming family home with updated kitchen, cozy fireplace, and large backyard. Perfect for families looking for comfort and convenience.',
    features: ['Garage', 'Fireplace', 'Updated Kitchen', 'Large Backyard'],
    status: 'available',
    is_featured: true,
    floor_plan_url: null,
    created_at: '2024-01-14T10:00:00Z',
    updated_at: '2024-01-14T10:00:00Z',
    images: [
      {
        id: '3',
        property_id: '2',
        image_url: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
        alt_text: 'Front exterior view',
        display_order: 1,
        created_at: '2024-01-14T10:00:00Z'
      }
    ]
  },
  {
    id: '3',
    title: 'Executive Estate in Allen',
    address: '789 Executive Boulevard',
    city: 'Allen',
    state: 'TX',
    zip_code: '75013',
    price: 850000,
    bedrooms: 5,
    bathrooms: 4.5,
    square_feet: 4200,
    lot_size: 12000,
    year_built: 2023,
    description: 'Stunning executive estate featuring luxury finishes throughout, chef\'s kitchen, home office, game room, and resort-style backyard with pool and spa.',
    features: ['Pool', 'Spa', 'Home Office', 'Game Room', 'Chef Kitchen', 'Luxury Finishes'],
    status: 'available',
    is_featured: true,
    floor_plan_url: null,
    created_at: '2024-01-13T10:00:00Z',
    updated_at: '2024-01-13T10:00:00Z',
    images: [
      {
        id: '4',
        property_id: '3',
        image_url: 'https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
        alt_text: 'Front exterior view',
        display_order: 1,
        created_at: '2024-01-13T10:00:00Z'
      }
    ]
  },
  {
    id: '4',
    title: 'Cozy Townhome in McKinney',
    address: '321 Maple Lane',
    city: 'McKinney',
    state: 'TX',
    zip_code: '75070',
    price: 375000,
    bedrooms: 3,
    bathrooms: 2.5,
    square_feet: 1800,
    lot_size: 4500,
    year_built: 2021,
    description: 'Move-in ready townhome with modern amenities, open concept living, and convenient location near shopping and schools.',
    features: ['Open Concept', 'Modern Amenities', 'Near Schools', 'Move-in Ready'],
    status: 'pending',
    is_featured: false,
    floor_plan_url: null,
    created_at: '2024-01-12T10:00:00Z',
    updated_at: '2024-01-12T10:00:00Z',
    images: [
      {
        id: '5',
        property_id: '4',
        image_url: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
        alt_text: 'Front exterior view',
        display_order: 1,
        created_at: '2024-01-12T10:00:00Z'
      }
    ]
  },
  {
    id: '5',
    title: 'Custom Built Home in Richardson',
    address: '654 Custom Court',
    city: 'Richardson',
    state: 'TX',
    zip_code: '75081',
    price: 725000,
    bedrooms: 4,
    bathrooms: 3.5,
    square_feet: 3600,
    lot_size: 9500,
    year_built: 2023,
    description: 'Custom built home with premium upgrades, gourmet kitchen, study, media room, and beautifully landscaped yard.',
    features: ['Custom Built', 'Premium Upgrades', 'Study', 'Media Room', 'Landscaped Yard'],
    status: 'sold',
    is_featured: false,
    floor_plan_url: null,
    created_at: '2024-01-11T10:00:00Z',
    updated_at: '2024-01-11T10:00:00Z',
    images: [
      {
        id: '6',
        property_id: '5',
        image_url: 'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
        alt_text: 'Front exterior view',
        display_order: 1,
        created_at: '2024-01-11T10:00:00Z'
      }
    ]
  },
  {
    id: '6',
    title: 'Elegant Home in Lewisville',
    address: '987 Elegant Way',
    city: 'Lewisville',
    state: 'TX',
    zip_code: '75056',
    price: 550000,
    bedrooms: 4,
    bathrooms: 3,
    square_feet: 2800,
    lot_size: 8000,
    year_built: 2022,
    description: 'Elegant home with formal dining, spacious living areas, master suite with walk-in closet, and covered patio.',
    features: ['Formal Dining', 'Master Suite', 'Walk-in Closet', 'Covered Patio'],
    status: 'available',
    is_featured: true,
    floor_plan_url: null,
    created_at: '2024-01-10T10:00:00Z',
    updated_at: '2024-01-10T10:00:00Z',
    images: [
      {
        id: '7',
        property_id: '6',
        image_url: 'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
        alt_text: 'Front exterior view',
        display_order: 1,
        created_at: '2024-01-10T10:00:00Z'
      }
    ]
  }
]

export interface PropertyWithImages extends Property {
  images: PropertyImage[]
}

export interface PropertyFilters {
  city?: string
  minBeds?: number
  maxBeds?: number
  minBaths?: number
  maxBaths?: number
  minPrice?: number
  maxPrice?: number
  minSqft?: number
  maxSqft?: number
}

export function useProperties(filters?: PropertyFilters) {
  const [properties, setProperties] = useState<PropertyWithImages[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProperties()
  }, [filters])

  const fetchProperties = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Try to fetch from Supabase first
      try {
        let query = supabase
          .from('properties')
          .select(`
            *,
            images:property_images(*)
          `)
          .order('created_at', { ascending: false })

        if (filters?.city) {
          query = query.ilike('city', `%${filters.city}%`)
        }
        if (filters?.minBeds) {
          query = query.gte('bedrooms', filters.minBeds)
        }
        if (filters?.maxBeds) {
          query = query.lte('bedrooms', filters.maxBeds)
        }
        if (filters?.minBaths) {
          query = query.gte('bathrooms', filters.minBaths)
        }
        if (filters?.maxBaths) {
          query = query.lte('bathrooms', filters.maxBaths)
        }
        if (filters?.minPrice) {
          query = query.gte('price', filters.minPrice)
        }
        if (filters?.maxPrice) {
          query = query.lte('price', filters.maxPrice)
        }
        if (filters?.minSqft) {
          query = query.gte('square_feet', filters.minSqft)
        }
        if (filters?.maxSqft) {
          query = query.lte('square_feet', filters.maxSqft)
        }

        const { data, error } = await query

        if (error) throw error

        const propertiesWithImages = data?.map(property => ({
          ...property,
          images: property.images?.sort((a: PropertyImage, b: PropertyImage) => 
            a.display_order - b.display_order
          ) || []
        })) || []

        setProperties(propertiesWithImages)
      } catch (supabaseError) {
        // If Supabase fails, use mock data with filters applied
        console.warn('Supabase connection failed, using mock data:', supabaseError)
        
        let filteredMockData = [...mockProperties]
        
        if (filters?.city) {
          filteredMockData = filteredMockData.filter(property =>
            property.city.toLowerCase().includes(filters.city!.toLowerCase())
          )
        }
        if (filters?.minBeds) {
          filteredMockData = filteredMockData.filter(property =>
            property.bedrooms >= filters.minBeds!
          )
        }
        if (filters?.maxBeds) {
          filteredMockData = filteredMockData.filter(property =>
            property.bedrooms <= filters.maxBeds!
          )
        }
        if (filters?.minBaths) {
          filteredMockData = filteredMockData.filter(property =>
            property.bathrooms >= filters.minBaths!
          )
        }
        if (filters?.maxBaths) {
          filteredMockData = filteredMockData.filter(property =>
            property.bathrooms <= filters.maxBaths!
          )
        }
        if (filters?.minPrice) {
          filteredMockData = filteredMockData.filter(property =>
            property.price >= filters.minPrice!
          )
        }
        if (filters?.maxPrice) {
          filteredMockData = filteredMockData.filter(property =>
            property.price <= filters.maxPrice!
          )
        }
        if (filters?.minSqft) {
          filteredMockData = filteredMockData.filter(property =>
            property.square_feet >= filters.minSqft!
          )
        }
        if (filters?.maxSqft) {
          filteredMockData = filteredMockData.filter(property =>
            property.square_feet <= filters.maxSqft!
          )
        }
        
        setProperties(filteredMockData)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return { properties, loading, error, refetch: fetchProperties }
}

export function useProperty(id: string) {
  const [property, setProperty] = useState<PropertyWithImages | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id) {
      fetchProperty()
    }
  }, [id])

  const fetchProperty = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Try to fetch from Supabase first
      try {
        const { data, error } = await supabase
          .from('properties')
          .select(`
            *,
            images:property_images(*)
          `)
          .eq('id', id)
          .single()

        if (error) throw error

        if (data) {
          const propertyWithImages = {
            ...data,
            images: data.images?.sort((a: PropertyImage, b: PropertyImage) => 
              a.display_order - b.display_order
            ) || []
          }
          setProperty(propertyWithImages)
        }
      } catch (supabaseError) {
        // If Supabase fails, use mock data
        console.warn('Supabase connection failed, using mock data:', supabaseError)
        
        const mockProperty = mockProperties.find(p => p.id === id)
        if (mockProperty) {
          setProperty(mockProperty)
        } else {
          throw new Error('Property not found')
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Property not found')
    } finally {
      setLoading(false)
    }
  }

  return { property, loading, error, refetch: fetchProperty }
}