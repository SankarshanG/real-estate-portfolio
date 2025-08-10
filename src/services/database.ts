import { Property, Image, Lead, Sale, Community } from '../types';
import { supabase, TABLES } from '../lib/supabase';

export const DatabaseService = {
  // Test connection
  testConnection: async (): Promise<boolean> => {
    if (!supabase) {
      console.warn('Supabase not configured.');
      return false;
    }

    try {
      console.log('Testing Supabase connection...');
      const { error } = await supabase
        .from(TABLES.PROPERTIES)
        .select('count')
        .limit(1);

      if (error) {
        console.error('Connection test failed:', error);
        return false;
      }

      console.log('Supabase connection successful');
      return true;
    } catch (error) {
      console.error('Connection test error:', error);
      return false;
    }
  },

  // Test function to get all properties without any filters
  testGetAllProperties: async (): Promise<Property[]> => {
    if (!supabase) {
      console.warn('Supabase not configured.');
      return [];
    }

    try {
      console.log('Testing: Fetching all properties without filters...');
      const { data, error } = await supabase
        .from(TABLES.PROPERTIES)
        .select('*');

      if (error) {
        console.error('Test: Error fetching all properties:', error);
        return [];
      }

      console.log('Test: Successfully fetched all properties:', data);
      return data || [];
    } catch (error) {
      console.error('Test: Error fetching all properties:', error);
      return [];
    }
  },

  // Property operations
  getAllProperties: async (): Promise<Property[]> => {
    if (!supabase) {
      console.warn('Supabase not configured. Using mock data.');
      return [];
    }

    try {
      console.log('Fetching properties from database...');
      
      // Get the sold property visibility setting
      const soldVisibility = await DatabaseService.getSoldPropertyVisibility();
      console.log('Sold property visibility setting:', soldVisibility);
      
      let query = supabase
        .from(TABLES.PROPERTIES)
        .select('*')
        .eq('published', true)  // Only show published properties
        .order('update_at', { ascending: false });

      // If sold properties should be hidden, filter them out
      if (soldVisibility === 'hide') {
        query = query.neq('status', 'sold');
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching properties:', error);
        return [];
      }

      console.log('Fetched properties:', data);

      // Fetch images for each property
      const propertiesWithImages = await Promise.all(
        (data || []).map(async (property) => {
          try {
            if (!supabase) {
              console.warn('Supabase not configured for image fetching');
              return { ...property, images: [] };
            }

            const { data: imagesData, error: imagesError } = await supabase
              .from(TABLES.IMAGES)
              .select('image_url')
              .eq('property_id', property.id)
              .order('order');

            if (imagesError) {
              console.error(`Error fetching images for property ${property.id}:`, imagesError);
              return { ...property, images: [] };
            }

            const images = imagesData?.map(img => img.image_url) || [];
            console.log(`Property ${property.id} has ${images.length} images:`, images);
            return { ...property, images };
          } catch (error) {
            console.error(`Error fetching images for property ${property.id}:`, error);
            return { ...property, images: [] };
          }
        })
      );

      console.log('Properties with images:', propertiesWithImages);
      return propertiesWithImages;
    } catch (error) {
      console.error('Error fetching properties:', error);
      return [];
    }
  },

  // Admin function to get all properties (including unpublished)
  getAllPropertiesAdmin: async (): Promise<Property[]> => {
    if (!supabase) {
      console.warn('Supabase not configured. Using mock data.');
      return [];
    }

    try {
      console.log('Fetching all properties for admin...');
      const { data, error } = await supabase
        .from(TABLES.PROPERTIES)
        .select('*')
        .order('update_at', { ascending: false });

      if (error) {
        console.error('Error fetching all properties:', error);
        return [];
      }

      console.log('Fetched all properties:', data);

      // Fetch images for each property
      const propertiesWithImages = await Promise.all(
        (data || []).map(async (property) => {
          try {
            if (!supabase) {
              console.warn('Supabase not configured for image fetching');
              return { ...property, images: [] };
            }

            const { data: imagesData, error: imagesError } = await supabase
              .from(TABLES.IMAGES)
              .select('image_url')
              .eq('property_id', property.id)
              .order('order');

            if (imagesError) {
              console.error(`Error fetching images for property ${property.id}:`, imagesError);
              return { ...property, images: [] };
            }

            const images = imagesData?.map(img => img.image_url) || [];
            console.log(`Property ${property.id} has ${images.length} images:`, images);
            return { ...property, images };
          } catch (error) {
            console.error(`Error fetching images for property ${property.id}:`, error);
            return { ...property, images: [] };
          }
        })
      );

      console.log('Properties with images:', propertiesWithImages);
      return propertiesWithImages;
    } catch (error) {
      console.error('Error fetching all properties:', error);
      return [];
    }
  },

  getPropertyById: async (id: string): Promise<Property | null> => {
    if (!supabase) {
      console.warn('Supabase not configured.');
      return null;
    }

    try {
      console.log(`Fetching property with ID: ${id}`);
      const { data, error } = await supabase
        .from(TABLES.PROPERTIES)
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching property:', error);
        return null;
      }

      console.log('Fetched property:', data);

      // Fetch images for this property
      if (data) {
        try {
          if (!supabase) {
            console.warn('Supabase not configured for image fetching');
            return { ...data, images: [] };
          }

          const { data: imagesData, error: imagesError } = await supabase
            .from(TABLES.IMAGES)
            .select('image_url')
            .eq('property_id', data.id)
            .order('order');

          if (imagesError) {
            console.error(`Error fetching images for property ${data.id}:`, imagesError);
            return { ...data, images: [] };
          }

          const images = imagesData?.map(img => img.image_url) || [];
          console.log(`Property ${data.id} has ${images.length} images:`, images);
          return { ...data, images };
        } catch (error) {
          console.error(`Error fetching images for property ${data.id}:`, error);
          return { ...data, images: [] };
        }
      }

      return data;
    } catch (error) {
      console.error('Error fetching property:', error);
      return null;
    }
  },

  createProperty: async (property: Omit<Property, 'id' | 'update_at'>): Promise<Property | null> => {
    if (!supabase) {
      console.warn('Supabase not configured. Property not saved.');
      return null;
    }

    try {
      console.log('Attempting to create property:', property);
      
      // Include only the fields that exist in the database schema
      const propertyData = {
        title: property.title,
        description: property.description,
        price: property.price,
        bedrooms: property.bedrooms,
        sqft: property.sqft || property.squareFeet, // Handle both field names
        address: property.address,
        city: property.city,
        state: property.state,
        zip_code: property.zip_code,
        lat: property.lat,
        lng: property.lng,
        status: property.status,
        build_plan_url: property.build_plan_url,
        published: property.published,
        update_at: new Date().toISOString(),
      };

      console.log('Property data to insert:', propertyData);

      const { data, error } = await supabase
        .from(TABLES.PROPERTIES)
        .insert([propertyData])
        .select()
        .single();

      if (error) {
        console.error('Supabase error creating property:', error);
        console.error('Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        return null;
      }

      console.log('Property created successfully:', data);

      // Save images to the images table if provided
      if (property.images && property.images.length > 0 && data) {
        try {
          const imageRecords = property.images.map((imageUrl, index) => ({
            property_id: data.id,
            image_url: imageUrl,
            caption: `Property image ${index + 1}`,
            order: index,
            created_at: new Date().toISOString()
          }));

          const { error: imageError } = await supabase
            .from(TABLES.IMAGES)
            .insert(imageRecords);

          if (imageError) {
            console.error('Error saving images:', imageError);
          } else {
            console.log('Images saved successfully');
          }
        } catch (imageError) {
          console.error('Error saving images:', imageError);
        }
      }

      return data;
    } catch (error) {
      console.error('Error creating property:', error);
      return null;
    }
  },

  updateProperty: async (id: string, updates: Partial<Property>): Promise<Property | null> => {
    if (!supabase) {
      console.warn('Supabase not configured. Property not updated.');
      return null;
    }

    try {
      console.log('Attempting to update property:', updates);
      
      // Include all fields that might be updated
      const updateData: any = {
        update_at: new Date().toISOString(),
      };

      // Update only the fields that exist in the database schema
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.price !== undefined) updateData.price = updates.price;
      if (updates.bedrooms !== undefined) updateData.bedrooms = updates.bedrooms;
      if (updates.sqft !== undefined) updateData.sqft = updates.sqft;
      if (updates.squareFeet !== undefined) updateData.sqft = updates.squareFeet; // Handle squareFeet field
      if (updates.address !== undefined) updateData.address = updates.address;
      if (updates.city !== undefined) updateData.city = updates.city;
      if (updates.state !== undefined) updateData.state = updates.state;
      if (updates.zip_code !== undefined) updateData.zip_code = updates.zip_code;
      if (updates.lat !== undefined) updateData.lat = updates.lat;
      if (updates.lng !== undefined) updateData.lng = updates.lng;
      if (updates.status !== undefined) updateData.status = updates.status;
      if (updates.build_plan_url !== undefined) updateData.build_plan_url = updates.build_plan_url;
      if (updates.published !== undefined) updateData.published = updates.published;

      console.log('Update data to send:', updateData);

      const { data, error } = await supabase
        .from(TABLES.PROPERTIES)
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Supabase error updating property:', error);
        console.error('Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        return null;
      }

      console.log('Property updated successfully:', data);

      // Handle images if provided
      if (updates.images && updates.images.length > 0) {
        try {
          // First, delete existing images for this property
          await supabase
            .from(TABLES.IMAGES)
            .delete()
            .eq('property_id', id);

          // Then insert new images
          const imageRecords = updates.images.map((imageUrl, index) => ({
            property_id: id,
            image_url: imageUrl,
            caption: `Property image ${index + 1}`,
            order: index,
            created_at: new Date().toISOString()
          }));

          const { error: imageError } = await supabase
            .from(TABLES.IMAGES)
            .insert(imageRecords);

          if (imageError) {
            console.error('Error updating images:', imageError);
          } else {
            console.log('Images updated successfully');
          }
        } catch (imageError) {
          console.error('Error updating images:', imageError);
        }
      }

      return data;
    } catch (error) {
      console.error('Error updating property:', error);
      return null;
    }
  },

  deleteProperty: async (id: string): Promise<boolean> => {
    if (!supabase) {
      console.warn('Supabase not configured. Property not deleted.');
      return false;
    }

    try {
      const { error } = await supabase
        .from(TABLES.PROPERTIES)
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting property:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error deleting property:', error);
      return false;
    }
  },

  // Lead operations
  createLead: async (lead: Omit<Lead, 'id' | 'created_at'>): Promise<Lead | null> => {
    if (!supabase) {
      console.warn('Supabase not configured. Lead not saved.');
      return null;
    }

    try {
      const leadData = {
        ...lead,
        created_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from(TABLES.LEADS)
        .insert([leadData])
        .select()
        .single();

      if (error) {
        console.error('Error creating lead:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error creating lead:', error);
      return null;
    }
  },

  getLeadsByProperty: async (propertyId: string): Promise<Lead[]> => {
    if (!supabase) {
      console.warn('Supabase not configured.');
      return [];
    }

    try {
      const { data, error } = await supabase
        .from(TABLES.LEADS)
        .select('*')
        .eq('property_id', propertyId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching leads:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching leads:', error);
      return [];
    }
  },

  // Sale operations
  getAllSales: async (): Promise<Sale[]> => {
    if (!supabase) {
      console.warn('Supabase not configured.');
      return [];
    }

    try {
      // First get all active sales, then filter by date range in JavaScript
      const { data, error } = await supabase
        .from(TABLES.SALES)
        .select('*')
        .eq('active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching sales:', error);
        return [];
      }

      // Filter sales where current date is between starts_at and ends_at
      const currentSales = (data || []).filter(sale => {
        const startDate = new Date(sale.starts_at);
        const endDate = new Date(sale.ends_at);
        const currentDate = new Date();
        
        return currentDate >= startDate && currentDate <= endDate;
      });

      return currentSales;
    } catch (error) {
      console.error('Error fetching sales:', error);
      return [];
    }
  },

  // Get the current active sale for banner display
  getCurrentActiveSale: async (): Promise<Sale | null> => {
    if (!supabase) {
      console.warn('Supabase not configured.');
      return null;
    }

    try {
      const sales = await DatabaseService.getAllSales();
      // Return the first active sale (most recent if multiple)
      return sales.length > 0 ? sales[0] : null;
    } catch (error) {
      console.error('Error fetching current active sale:', error);
      return null;
    }
  },

  // Settings operations
  getSetting: async (key: string): Promise<string | null> => {
    if (!supabase) {
      console.warn('Supabase not configured.');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from(TABLES.SETTINGS)
        .select('value')
        .eq('key', key)
        .single();

      if (error) {
        console.error('Error fetching setting:', error);
        return null;
      }

      return data?.value || null;
    } catch (error) {
      console.error('Error fetching setting:', error);
      return null;
    }
  },

  updateSetting: async (key: string, value: string, description?: string): Promise<boolean> => {
    if (!supabase) {
      console.warn('Supabase not configured.');
      return false;
    }

    try {
      const { error } = await supabase
        .from(TABLES.SETTINGS)
        .upsert({
          key,
          value,
          description,
          updated_at: new Date().toISOString(),
        });

      if (error) {
        console.error('Error updating setting:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error updating setting:', error);
      return false;
    }
  },

  // Get sold property visibility setting
  getSoldPropertyVisibility: async (): Promise<'hide' | 'show'> => {
    const setting = await DatabaseService.getSetting('sold_property_visibility');
    return (setting as 'hide' | 'show') || 'show'; // Default to 'show'
  },

  // Initialize default settings
  initializeDefaultSettings: async (): Promise<void> => {
    if (!supabase) {
      console.warn('Supabase not configured.');
      return;
    }

    try {
      // Check if settings table exists and has the default setting
      const { error: checkError } = await supabase
        .from(TABLES.SETTINGS)
        .select('value')
        .eq('key', 'sold_property_visibility')
        .single();

      if (checkError && checkError.code === 'PGRST116') {
        // Setting doesn't exist, create it
        await DatabaseService.updateSetting(
          'sold_property_visibility',
          'show',
          'Controls whether sold properties are hidden or shown with SOLD tag'
        );
        console.log('Default settings initialized');
      }
    } catch (error) {
      console.error('Error initializing default settings:', error);
    }
  },

  createSale: async (sale: Omit<Sale, 'id' | 'created_at'>): Promise<Sale | null> => {
    if (!supabase) {
      console.warn('Supabase not configured. Sale not saved.');
      return null;
    }

    try {
      const saleData = {
        ...sale,
        created_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from(TABLES.SALES)
        .insert([saleData])
        .select()
        .single();

      if (error) {
        console.error('Error creating sale:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error creating sale:', error);
      return null;
    }
  },

  // Image operations
  uploadImage: async (file: File, propertyId: string, caption: string = '', order: number = 0): Promise<string | null> => {
    if (!supabase) {
      console.warn('Supabase not configured. Image not uploaded.');
      return null;
    }

    try {
      const fileName = `${Date.now()}-${file.name}`;
      const { error } = await supabase.storage
        .from('images')
        .upload(fileName, file);

      if (error) {
        console.error('Error uploading image:', error);
        return null;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('images')
        .getPublicUrl(fileName);

      // Save image metadata to database
      const { error: insertError } = await supabase
        .from(TABLES.IMAGES)
        .insert([{
          property_id: propertyId,
          image_url: urlData.publicUrl,
          caption,
          order,
          created_at: new Date().toISOString(),
        }]);

      if (insertError) {
        console.error('Error saving image metadata:', insertError);
      }

      return urlData.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  },

  uploadFloorPlan: async (file: File, propertyId: string): Promise<string | null> => {
    if (!supabase) {
      console.warn('Supabase not configured. Floor plan not uploaded.');
      return null;
    }

    try {
      console.log('Starting floor plan upload for property:', propertyId);
      console.log('File details:', { name: file.name, size: file.size, type: file.type });
      
      // Try to upload to storage first
      try {
        const fileName = `floorplans/${Date.now()}-${file.name}`;
        console.log('Uploading to path:', fileName);
        
        const { error } = await supabase.storage
          .from('images')
          .upload(fileName, file);

        if (error) {
          console.error('Error uploading floor plan to storage:', error);
          throw new Error('Storage upload failed');
        }

        console.log('Floor plan uploaded to storage successfully');

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('images')
          .getPublicUrl(fileName);

        console.log('Generated public URL:', urlData.publicUrl);

        // Update property with floor plan URL
        const { error: updateError } = await supabase
          .from(TABLES.PROPERTIES)
          .update({
            build_plan_url: urlData.publicUrl,
            update_at: new Date().toISOString()
          })
          .eq('id', propertyId);

        if (updateError) {
          console.error('Error updating property with floor plan:', updateError);
          return null;
        }

        console.log('Property updated with floor plan URL successfully');
        return urlData.publicUrl;
      } catch (storageError) {
        console.log('Storage upload failed, trying base64 approach:', storageError);
        
        // Fallback: Convert to base64 and save directly
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        console.log('Converted file to base64, size:', base64.length);

        // Update property with base64 data
        const { error: updateError } = await supabase
          .from(TABLES.PROPERTIES)
          .update({
            build_plan_url: base64,
            update_at: new Date().toISOString()
          })
          .eq('id', propertyId);

        if (updateError) {
          console.error('Error updating property with base64 floor plan:', updateError);
          return null;
        }

        console.log('Property updated with base64 floor plan successfully');
        return base64;
      }
    } catch (error) {
      console.error('Error uploading floor plan:', error);
      return null;
    }
  },

  deleteImage: async (imageId: string): Promise<boolean> => {
    if (!supabase) {
      console.warn('Supabase not configured. Image not deleted.');
      return false;
    }

    try {
      const { error } = await supabase
        .from(TABLES.IMAGES)
        .delete()
        .eq('id', imageId);

      if (error) {
        console.error('Error deleting image:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error deleting image:', error);
      return false;
    }
  },

  getAllImages: async (): Promise<Image[]> => {
    if (!supabase) {
      console.warn('Supabase not configured. Using mock data.');
      return [];
    }

    try {
      const { data, error } = await supabase
        .from(TABLES.IMAGES)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching images:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching images:', error);
      return [];
    }
  },

  getImagesByProperty: async (propertyId: string): Promise<Image[]> => {
    if (!supabase) {
      console.warn('Supabase not configured.');
      return [];
    }

    try {
      const { data, error } = await supabase
        .from(TABLES.IMAGES)
        .select('*')
        .eq('property_id', propertyId)
        .order('order', { ascending: true });

      if (error) {
        console.error('Error fetching images:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching images:', error);
      return [];
    }
  },

  // Community operations (using mock data for now since communities table doesn't exist in schema)
  getAllCommunities: async (): Promise<Community[]> => {
    // For now, return empty array since communities table is not in the schema
    // This can be implemented when the communities table is added to Supabase
    return [];
  },

  getCommunityById: async (id: string): Promise<Community | null> => {
    // For now, return null since communities table is not in the schema
    return null;
  },

  createCommunity: async (community: Omit<Community, 'id'>): Promise<Community | null> => {
    // For now, return null since communities table is not in the schema
    return null;
  },

  updateCommunity: async (id: string, updates: Partial<Community>): Promise<Community | null> => {
    // For now, return null since communities table is not in the schema
    return null;
  },

  deleteCommunity: async (id: string): Promise<boolean> => {
    // For now, return false since communities table is not in the schema
    return false;
  },

  // Sample data for testing
  createSampleProperties: async (): Promise<void> => {
    if (!supabase) {
      console.warn('Supabase not configured. Cannot create sample properties.');
      return;
    }

    const sampleProperties = [
      {
        title: 'Modern Downtown Condo',
        description: 'Luxurious 2-bedroom condo in the heart of downtown with stunning city views. Features include hardwood floors, granite countertops, and a private balcony. Perfect for young professionals or small families.',
        price: 450000,
        bedrooms: 2,
        sqft: 1200,
        address: '123 Main Street',
        city: 'Downtown',
        state: 'CA',
        zip_code: '90210',
        lat: 34.0522,
        lng: -118.2437,
        status: 'available',
        build_plan_url: 'https://example.com/floorplans/modern-downtown-condo.pdf',
        published: true,
        features: ['Hardwood Floors', 'Granite Countertops', 'Private Balcony', 'City Views', 'In-Unit Laundry'],
        garageSpaces: 1,
        bathrooms: 2,
        yearBuilt: 2020,
        lotSize: 'N/A',
        mlsNumber: 'MLS123456',
        isQuickMoveIn: true
      },
      {
        title: 'Luxury Waterfront Villa',
        description: 'Spectacular 4-bedroom waterfront villa with panoramic ocean views. This stunning property features a gourmet kitchen, home theater, wine cellar, and infinity pool. Perfect for those seeking the ultimate luxury lifestyle.',
        price: 1200000,
        bedrooms: 4,
        sqft: 3500,
        address: '456 Ocean Drive',
        city: 'Malibu',
        state: 'CA',
        zip_code: '90265',
        lat: 34.0259,
        lng: -118.7798,
        status: 'sold',
        build_plan_url: 'https://example.com/floorplans/luxury-waterfront-villa.pdf',
        published: true,
        features: ['Ocean Views', 'Infinity Pool', 'Gourmet Kitchen', 'Home Theater', 'Wine Cellar', 'Private Beach Access'],
        garageSpaces: 3,
        bathrooms: 4,
        yearBuilt: 2018,
        lotSize: '0.5 acres',
        mlsNumber: 'MLS789012',
        isQuickMoveIn: false
      },
      {
        title: 'Family Suburban Home',
        description: 'Beautiful 3-bedroom family home in a quiet suburban neighborhood. Features include a spacious backyard, updated kitchen, and excellent schools nearby. Perfect for growing families.',
        price: 750000,
        bedrooms: 3,
        sqft: 2200,
        address: '789 Oak Avenue',
        city: 'Beverly Hills',
        state: 'CA',
        zip_code: '90210',
        lat: 34.0736,
        lng: -118.4004,
        status: 'available',
        build_plan_url: 'https://example.com/floorplans/family-suburban-home.pdf',
        published: true,
        features: ['Spacious Backyard', 'Updated Kitchen', 'Excellent Schools', 'Quiet Neighborhood', '2-Car Garage'],
        garageSpaces: 2,
        bathrooms: 2,
        yearBuilt: 2015,
        lotSize: '0.3 acres',
        mlsNumber: 'MLS345678',
        isQuickMoveIn: true
      }
    ];

    const sampleImages = [
      // Modern Downtown Condo images
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
      
      // Luxury Waterfront Villa images
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
      
      // Family Suburban Home images
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop'
    ];

    try {
      console.log('Creating sample properties...');
      
      for (let i = 0; i < sampleProperties.length; i++) {
        const property = sampleProperties[i];
        
        // Create property
        const { data: propertyData, error: propertyError } = await supabase
          .from(TABLES.PROPERTIES)
          .insert([{
            title: property.title,
            description: property.description,
            price: property.price,
            bedrooms: property.bedrooms,
            sqft: property.sqft,
            address: property.address,
            city: property.city,
            state: property.state,
            zip_code: property.zip_code,
            lat: property.lat,
            lng: property.lng,
            status: property.status,
            build_plan_url: property.build_plan_url,
            published: property.published,
            update_at: new Date().toISOString(),
          }])
          .select()
          .single();

        if (propertyError) {
          console.error('Error creating sample property:', propertyError);
          continue;
        }

        console.log('Created sample property:', propertyData);

        // Add images for this property
        const startIndex = i * 3;
        for (let j = 0; j < 3; j++) {
          const imageUrl = sampleImages[startIndex + j];
          if (imageUrl) {
            const { error: imageError } = await supabase
              .from(TABLES.IMAGES)
              .insert([{
                property_id: propertyData.id,
                image_url: imageUrl,
                order: j
              }]);

            if (imageError) {
              console.error('Error creating sample image:', imageError);
            }
          }
        }
      }

      console.log('Sample properties created successfully!');
    } catch (error) {
      console.error('Error creating sample properties:', error);
    }
  },

  // Create sample sales data for testing
  createSampleSales: async (): Promise<void> => {
    if (!supabase) {
      console.warn('Supabase not configured. Cannot create sample sales.');
      return;
    }

    const sampleSales = [
      {
        label: 'Summer Sale',
        discount_pct: 15,
        starts_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // Started 7 days ago
        ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // Ends in 14 days
        active: true
      },
      {
        label: 'Holiday Special',
        discount_pct: 20,
        starts_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // Starts in 30 days
        ends_at: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // Ends in 60 days
        active: true
      }
    ];

    try {
      console.log('Creating sample sales...');
      
      for (const sale of sampleSales) {
        const { data: saleData, error: saleError } = await supabase
          .from(TABLES.SALES)
          .insert([{
            label: sale.label,
            discount_pct: sale.discount_pct,
            starts_at: sale.starts_at,
            ends_at: sale.ends_at,
            active: sale.active,
            created_at: new Date().toISOString(),
          }])
          .select()
          .single();

        if (saleError) {
          console.error('Error creating sample sale:', saleError);
          continue;
        }

        console.log('Created sample sale:', saleData);
      }

      console.log('Sample sales created successfully!');
    } catch (error) {
      console.error('Error creating sample sales:', error);
    }
  },
};

export default DatabaseService;