import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Property, PropertyImage } from '../types/database'

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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Property not found')
    } finally {
      setLoading(false)
    }
  }

  return { property, loading, error, refetch: fetchProperty }
}