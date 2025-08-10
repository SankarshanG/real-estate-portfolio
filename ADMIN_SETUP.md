# Admin Dashboard Setup

## Overview
The admin dashboard provides full CRUD operations for properties and communities, with image upload functionality. It integrates with your existing Supabase database.

## Features
- ✅ **Property Management**: Add, edit, delete properties
- ✅ **Image Upload**: Upload and manage property images
- ✅ **Real-time Database**: All changes reflect in your Supabase database
- ✅ **Search & Filter**: Advanced property search and filtering
- ✅ **Statistics Dashboard**: Overview of property statistics

## Setup Instructions

### 1. Supabase Configuration
Create a `.env` file in the root directory with your Supabase credentials:

```env
REACT_APP_SUPABASE_URL=your_supabase_url_here
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 2. Database Schema
Ensure your Supabase database has the following tables:

#### Properties Table
```sql
CREATE TABLE properties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT DEFAULT 'TX',
  zip_code TEXT,
  price DECIMAL NOT NULL,
  bedrooms INTEGER DEFAULT 0,
  bathrooms DECIMAL DEFAULT 0,
  square_feet INTEGER DEFAULT 0,
  stories INTEGER DEFAULT 1,
  status TEXT DEFAULT 'available',
  type TEXT DEFAULT 'single-family',
  community TEXT,
  floor_plan TEXT,
  mls_number TEXT,
  images TEXT[] DEFAULT '{}',
  description TEXT,
  features TEXT[] DEFAULT '{}',
  lot_size DECIMAL DEFAULT 0,
  year_built INTEGER DEFAULT 2024,
  garage_spaces INTEGER DEFAULT 0,
  is_quick_move_in BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Communities Table
```sql
CREATE TABLE communities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  description TEXT,
  images TEXT[] DEFAULT '{}',
  amenities TEXT[] DEFAULT '{}',
  schools JSONB DEFAULT '[]',
  location TEXT,
  price_range TEXT,
  home_types TEXT[] DEFAULT '{}',
  total_homes INTEGER DEFAULT 0,
  available_homes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Images Table
```sql
CREATE TABLE images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  size INTEGER NOT NULL,
  type TEXT NOT NULL,
  category TEXT DEFAULT 'property',
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3. Storage Bucket
Create a storage bucket named `images` in your Supabase project for image uploads.

### 4. Row Level Security (RLS)
Enable RLS on your tables and configure appropriate policies for admin access.

## Usage

### Accessing the Admin Dashboard
Navigate to `/admin` in your application to access the admin dashboard.

### Adding Properties
1. Go to `/admin/properties/new`
2. Fill in property details
3. Upload images
4. Save the property

### Managing Properties
1. Go to `/admin/properties`
2. Search, filter, and sort properties
3. Edit or delete properties as needed

### Image Management
1. Go to `/admin/images`
2. Upload new images
3. Organize and manage existing images

## API Endpoints

The admin dashboard uses the following Supabase operations:

### Properties
- `GET /properties` - Fetch all properties
- `GET /properties/:id` - Fetch single property
- `POST /properties` - Create new property
- `PUT /properties/:id` - Update property
- `DELETE /properties/:id` - Delete property

### Communities
- `GET /communities` - Fetch all communities
- `GET /communities/:id` - Fetch single community
- `POST /communities` - Create new community
- `PUT /communities/:id` - Update community
- `DELETE /communities/:id` - Delete community

### Images
- `POST /storage/images` - Upload image
- `GET /images` - Fetch all images
- `DELETE /images/:id` - Delete image

## Security Considerations

1. **Authentication**: Implement proper authentication for admin access
2. **Authorization**: Use RLS policies to restrict access
3. **Input Validation**: Validate all form inputs
4. **File Upload**: Validate file types and sizes
5. **Error Handling**: Implement proper error handling

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify your Supabase URL and key
   - Check network connectivity
   - Ensure RLS policies are configured correctly

2. **Image Upload Fails**
   - Verify storage bucket exists
   - Check bucket permissions
   - Ensure file size is within limits

3. **Properties Not Loading**
   - Check database schema
   - Verify table permissions
   - Check browser console for errors

### Debug Mode
Enable debug logging by adding to your `.env`:
```env
REACT_APP_DEBUG=true
```

## Support
For issues or questions, check the browser console for error messages and refer to the Supabase documentation. 