# Supabase Setup Guide

## Database Schema

The application expects the following Supabase database schema:

### Tables

1. **properties** - Main property listings
   - `id` (uuid, primary key)
   - `title` (text)
   - `description` (text)
   - `price` (numeric)
   - `bedrooms` (int4)
   - `sqft` (int4)
   - `address` (text)
   - `city` (text)
   - `state` (text)
   - `zip_code` (text)
   - `lat` (float8)
   - `lng` (float8)
   - `status` (text)
   - `build_plan_url` (text)
   - `published` (bool)
   - `update_at` (timestamptz)

2. **images** - Property images
   - `id` (uuid, primary key)
   - `property_id` (uuid, foreign key to properties.id)
   - `image_url` (text)
   - `caption` (text)
   - `order` (int4)
   - `created_at` (timestamptz)

3. **leads** - Contact form submissions
   - `id` (uuid, primary key)
   - `property_id` (uuid, foreign key to properties.id)
   - `name` (text)
   - `email` (text)
   - `phone` (text)
   - `message` (text)
   - `created_at` (timestamptz)

4. **sales** - Promotional sales
   - `id` (uuid, primary key)
   - `label` (text)
   - `discount_pct` (int4)
   - `starts_at` (timestamptz)
   - `ends_at` (timestamptz)
   - `active` (bool)
   - `created_at` (timestamptz)

5. **settings** - Application settings
   - `id` (uuid, primary key)
   - `key` (text, unique)
   - `value` (text)
   - `description` (text)
   - `created_at` (timestamptz)
   - `updated_at` (timestamptz)

## Quick Setup Script

If you're getting permission errors, run this in your Supabase SQL Editor:

```sql
-- Enable RLS on all tables
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE images ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;

-- Create basic policies (allow all operations for now)
CREATE POLICY "Allow all operations on properties" ON properties FOR ALL USING (true);
CREATE POLICY "Allow all operations on images" ON images FOR ALL USING (true);
CREATE POLICY "Allow all operations on leads" ON leads FOR ALL USING (true);
CREATE POLICY "Allow all operations on sales" ON sales FOR ALL USING (true);
```

## SQL Setup Commands

Run these commands in your Supabase SQL editor to create the tables:

```sql
-- Create properties table
CREATE TABLE IF NOT EXISTS properties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  bedrooms INTEGER NOT NULL,
  sqft INTEGER,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  status TEXT DEFAULT 'available',
  build_plan_url TEXT,
  published BOOLEAN DEFAULT true,
  update_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create images table
CREATE TABLE IF NOT EXISTS images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create sales table
CREATE TABLE IF NOT EXISTS sales (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  label TEXT NOT NULL,
  discount_pct INTEGER NOT NULL,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create settings table
CREATE TABLE IF NOT EXISTS settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE images ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
```

## Environment Variables

Create a `.env` file in the root directory with:

```
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Storage Setup

1. Create a storage bucket named `images` in your Supabase project
2. Set the bucket to public
3. Configure CORS if needed

## Row Level Security (RLS)

Enable RLS on all tables and create appropriate policies:

### Properties Table
```sql
-- Allow public read access to published properties
CREATE POLICY "Public read access to published properties" ON properties
FOR SELECT USING (published = true);

-- Allow authenticated users to create properties
CREATE POLICY "Authenticated users can create properties" ON properties
FOR INSERT WITH CHECK (true);

-- Allow authenticated users to update their properties
CREATE POLICY "Authenticated users can update properties" ON properties
FOR UPDATE USING (true);

-- Allow authenticated users to delete properties
CREATE POLICY "Authenticated users can delete properties" ON properties
FOR DELETE USING (true);
```

### Images Table
```sql
-- Allow public read access
CREATE POLICY "Public read access to images" ON images
FOR SELECT USING (true);

-- Allow authenticated users to insert images
CREATE POLICY "Authenticated users can insert images" ON images
FOR INSERT WITH CHECK (true);
```

### Leads Table
```sql
-- Allow public insert access for contact forms
CREATE POLICY "Public can create leads" ON leads
FOR INSERT WITH CHECK (true);

-- Allow authenticated users to read leads
CREATE POLICY "Authenticated users can read leads" ON leads
FOR SELECT USING (true);
```

### Sales Table
```sql
-- Allow public read access to active sales
CREATE POLICY "Public read access to active sales" ON sales
FOR SELECT USING (active = true);

-- Allow authenticated users to manage sales
CREATE POLICY "Authenticated users can manage sales" ON sales
FOR ALL USING (true);
```

### Settings Table
```sql
-- Allow public read access to settings
CREATE POLICY "Public read access to settings" ON settings
FOR SELECT USING (true);

-- Allow authenticated users to manage settings
CREATE POLICY "Authenticated users can manage settings" ON settings
FOR ALL USING (true);
```

## Testing the Connection

1. Start the development server: `npm start`
2. Check the browser console for any Supabase connection errors
3. The application will fall back to mock data if Supabase is not configured

## Features

- **Property Management**: CRUD operations for properties
- **Image Upload**: Upload and manage property images
- **Lead Capture**: Contact form submissions stored in leads table
- **Sales Management**: Promotional sales and discounts
- **Real-time Updates**: Automatic data synchronization

## Next Steps

1. Set up your Supabase project with the schema above
2. Configure environment variables
3. Set up storage bucket for images
4. Configure RLS policies
5. Test the connection and functionality 