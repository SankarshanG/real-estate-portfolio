import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'placeholder-key'

// Note: Replace the placeholder values in .env with your actual Supabase credentials
if (supabaseUrl === 'https://placeholder.supabase.co' || supabaseAnonKey === 'placeholder-key') {
  console.warn('Using placeholder Supabase credentials. Please update .env with your actual Supabase URL and anon key.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)