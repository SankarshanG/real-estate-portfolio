const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5050;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// MySQL connection configuration
const dbConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'real_estate',
  port: parseInt(process.env.MYSQL_PORT || '3306'),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create connection pool
let pool = null;

const getConnection = async () => {
  if (!pool) {
    pool = mysql.createPool(dbConfig);
  }
  return pool;
};

// Test database connection
const testConnection = async () => {
  try {
    const connection = await getConnection();
    await connection.execute('SELECT 1');
    console.log('✅ MySQL connection successful');
    return true;
  } catch (error) {
    console.error('❌ MySQL connection failed:', error);
    return false;
  }
};

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Optional: create optimized derivative on upload (webp)
const createOptimizedVariant = async (filePath) => {
  try {
    const outputPath = filePath.replace(/\.[^.]+$/, '.webp');
    await sharp(filePath)
      .rotate()
      .withMetadata()
      .webp({ quality: 92 })
      .toFile(outputPath);
    return outputPath;
  } catch (e) {
    return null;
  }
};

// Routes

// Test connection
app.get('/api/test', async (req, res) => {
  try {
    const isConnected = await testConnection();
    res.json({ 
      success: isConnected, 
      message: isConnected ? 'Database connected' : 'Database connection failed' 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all properties
app.get('/api/properties', async (req, res) => {
  try {
    const connection = await getConnection();
    const [rows] = await connection.execute('SELECT * FROM properties WHERE published = 1 ORDER BY update_at DESC');
    
    // Get images for each property
    const propertiesWithImages = await Promise.all(
      rows.map(async (property) => {
        const [imageRows] = await connection.execute(
          'SELECT image_url FROM images WHERE property_id = ? ORDER BY `order`',
          [property.id]
        );
        const images = imageRows.map(img => img.image_url);
        return { ...property, images };
      })
    );
    
    res.json({ success: true, data: propertiesWithImages });
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all properties for admin (include unpublished)
app.get('/api/properties/admin', async (req, res) => {
  try {
    const connection = await getConnection();
    const [rows] = await connection.execute('SELECT * FROM properties ORDER BY update_at DESC');

    const propertiesWithImages = await Promise.all(
      rows.map(async (property) => {
        const [imageRows] = await connection.execute(
          'SELECT image_url FROM images WHERE property_id = ? ORDER BY `order`',
          [property.id]
        );
        const images = imageRows.map(img => img.image_url);
        return { ...property, images };
      })
    );

    res.json({ success: true, data: propertiesWithImages });
  } catch (error) {
    console.error('Error fetching admin properties:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get property by ID
app.get('/api/properties/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    
    const [rows] = await connection.execute(
      'SELECT * FROM properties WHERE id = ?',
      [id]
    );
    
    if (!rows.length) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }
    
    const property = rows[0];
    
    // Get images for this property
    const [imageRows] = await connection.execute(
      'SELECT image_url FROM images WHERE property_id = ? ORDER BY `order`',
      [property.id]
    );
    const images = imageRows.map(img => img.image_url);
    
    res.json({ success: true, data: { ...property, images } });
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get images for a property
app.get('/api/properties/:id/images', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const [rows] = await connection.execute(
      'SELECT id, property_id, image_url, caption, `order`, created_at FROM images WHERE property_id = ? ORDER BY `order`',
      [id]
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching property images:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create property
app.post('/api/properties', async (req, res) => {
  try {
    const connection = await getConnection();
    const propertyData = req.body;
    
    const [result] = await connection.execute(
      `INSERT INTO properties (title, description, price, bedrooms, sqft, address, city, state, zip_code, lat, lng, status, build_plan_url, published) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        propertyData.title, propertyData.description, propertyData.price, propertyData.bedrooms,
        propertyData.sqft, propertyData.address, propertyData.city, propertyData.state,
        propertyData.zip_code, propertyData.lat, propertyData.lng, propertyData.status,
        propertyData.build_plan_url, propertyData.published
      ]
    );
    
    const propertyId = result.insertId;
    
    // Save images if provided
    if (propertyData.images && propertyData.images.length > 0) {
      for (let i = 0; i < propertyData.images.length; i++) {
        const imageUrl = propertyData.images[i];
        await connection.execute(
          'INSERT INTO images (property_id, image_url, caption, `order`) VALUES (?, ?, ?, ?)',
          [propertyId, imageUrl, `Property image ${i + 1}`, i]
        );
      }
    }
    
    res.json({ success: true, data: { id: propertyId, message: 'Property created successfully' } });
  } catch (error) {
    console.error('Error creating property:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update property
app.put('/api/properties/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const connection = await getConnection();
    
    // Build dynamic update query
    const updateFields = [];
    const updateValues = [];
    
    Object.keys(updates).forEach(key => {
      if (key !== 'id' && key !== 'images') {
        updateFields.push(`${key} = ?`);
        updateValues.push(updates[key]);
      }
    });
    
    if (updateFields.length === 0) {
      return res.status(400).json({ success: false, message: 'No fields to update' });
    }
    
    updateFields.push('update_at = CURRENT_TIMESTAMP');
    const query = `UPDATE properties SET ${updateFields.join(', ')} WHERE id = ?`;
    updateValues.push(id);
    
    await connection.execute(query, updateValues);
    
    // Handle images if provided
    if (updates.images && updates.images.length > 0) {
      // Delete existing images
      await connection.execute('DELETE FROM images WHERE property_id = ?', [id]);
      
      // Insert new images
      for (let i = 0; i < updates.images.length; i++) {
        const imageUrl = updates.images[i];
        await connection.execute(
          'INSERT INTO images (property_id, image_url, caption, `order`) VALUES (?, ?, ?, ?)',
          [id, imageUrl, `Property image ${i + 1}`, i]
        );
      }
    }
    
    res.json({ success: true, message: 'Property updated successfully' });
  } catch (error) {
    console.error('Error updating property:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete property
app.delete('/api/properties/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    
    // Delete associated images first
    await connection.execute('DELETE FROM images WHERE property_id = ?', [id]);
    
    // Delete the property
    await connection.execute('DELETE FROM properties WHERE id = ?', [id]);
    
    res.json({ success: true, message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Error deleting property:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Upload image
app.post('/api/upload-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    
    const imageUrl = `/uploads/${req.file.filename}`;
    // Kick off variant creation (non-blocking)
    createOptimizedVariant(req.file.path).catch(() => {});
    res.json({ success: true, data: { imageUrl } });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create image record for a property
app.post('/api/properties/:id/images', async (req, res) => {
  try {
    const { id } = req.params;
    const { image_url, caption = '', order = 0 } = req.body;
    if (!image_url) {
      return res.status(400).json({ success: false, message: 'image_url is required' });
    }
    const connection = await getConnection();
    const [result] = await connection.execute(
      'INSERT INTO images (property_id, image_url, caption, `order`) VALUES (?, ?, ?, ?)',
      [id, image_url, caption, order]
    );
    res.json({ success: true, data: { id: result.insertId } });
  } catch (error) {
    console.error('Error creating image record:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete image record
app.delete('/api/images/:imageId', async (req, res) => {
  try {
    const { imageId } = req.params;
    const connection = await getConnection();
    await connection.execute('DELETE FROM images WHERE id = ?', [imageId]);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all communities
app.get('/api/communities', async (req, res) => {
  try {
    const connection = await getConnection();
    const [rows] = await connection.execute('SELECT * FROM communities ORDER BY created_at DESC');
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching communities:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create lead
app.post('/api/leads', async (req, res) => {
  try {
    const connection = await getConnection();
    const leadData = req.body;
    
    const [result] = await connection.execute(
      'INSERT INTO leads (property_id, name, email, phone, message) VALUES (?, ?, ?, ?, ?)',
      [leadData.property_id, leadData.name, leadData.email, leadData.phone, leadData.message]
    );
    
    res.json({ success: true, data: { id: result.insertId, message: 'Lead created successfully' } });
  } catch (error) {
    console.error('Error creating lead:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all sales
app.get('/api/sales', async (req, res) => {
  try {
    const connection = await getConnection();
    const [rows] = await connection.execute(
      'SELECT * FROM sales WHERE active = 1 ORDER BY created_at DESC'
    );
    
    // Filter sales where current date is between starts_at and ends_at
    const currentSales = rows.filter(sale => {
      const startDate = new Date(sale.starts_at);
      const endDate = new Date(sale.ends_at);
      const currentDate = new Date();
      return currentDate >= startDate && currentDate <= endDate;
    });
    
    res.json({ success: true, data: currentSales });
  } catch (error) {
    console.error('Error fetching sales:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  
  // Test database connection
  await testConnection();
});

module.exports = app;
