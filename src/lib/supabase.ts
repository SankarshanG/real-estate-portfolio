import { createClient } from '@supabase/supabase-js';

// These should be environment variables in production
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Only create client if environment variables are provided
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Database table names
export const TABLES = {
  PROPERTIES: 'properties',
  IMAGES: 'images',
  LEADS: 'leads',
  SALES: 'sales',
  COMMUNITIES: 'communities',
  SETTINGS: 'settings',
} as const;

export default supabase; 