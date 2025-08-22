# MySQL Database Setup

## Step 1: Install MySQL

### Option A: Local MySQL Installation
```bash
# macOS (using Homebrew)
brew install mysql

# Start MySQL service
brew services start mysql

# Set root password
mysql_secure_installation
```

### Option B: Docker MySQL
```bash
# Run MySQL in Docker
docker run --name mysql-real-estate \
  -e MYSQL_ROOT_PASSWORD=your_password \
  -e MYSQL_DATABASE=real_estate \
  -p 3306:3306 \
  -d mysql:8.0
```

## Step 2: Create Database and Tables

Connect to MySQL and run the setup script:

```sql
-- Create database
CREATE DATABASE IF NOT EXISTS real_estate;
USE real_estate;

-- Create properties table
CREATE TABLE IF NOT EXISTS properties (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(12,2) NOT NULL,
  bedrooms INT NOT NULL,
  sqft INT,
  address VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(50) NOT NULL,
  zip_code VARCHAR(20),
  lat DECIMAL(10,8),
  lng DECIMAL(11,8),
  status ENUM('available', 'reserved', 'sold') DEFAULT 'available',
  build_plan_url TEXT,
  published BOOLEAN DEFAULT true,
  update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create images table
CREATE TABLE IF NOT EXISTS images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  property_id INT NOT NULL,
  image_url TEXT NOT NULL,
  caption VARCHAR(255),
  `order` INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);

-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  property_id INT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE SET NULL
);

-- Create sales table
CREATE TABLE IF NOT EXISTS sales (
  id INT AUTO_INCREMENT PRIMARY KEY,
  label VARCHAR(255) NOT NULL,
  discount_pct INT NOT NULL,
  starts_at TIMESTAMP NOT NULL,
  ends_at TIMESTAMP NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create settings table
CREATE TABLE IF NOT EXISTS settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  `key` VARCHAR(255) UNIQUE NOT NULL,
  value TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create communities table (optional)
CREATE TABLE IF NOT EXISTS communities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  address VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(50),
  amenities TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default settings
INSERT INTO settings (`key`, value, description) VALUES 
('sold_property_visibility', 'show', 'Controls whether sold properties are hidden or shown with SOLD tag')
ON DUPLICATE KEY UPDATE value = VALUES(value);
```

## Step 3: Environment Configuration

Create a `.env` file in your project root:

```bash
# MySQL Configuration
REACT_APP_MYSQL_HOST=localhost
REACT_APP_MYSQL_USER=root
REACT_APP_MYSQL_PASSWORD=your_password
REACT_APP_MYSQL_DATABASE=real_estate
REACT_APP_MYSQL_PORT=3306
```

## Step 4: Test Connection

Restart your development server and check the browser console for connection status:

```bash
npm start
```

## Step 5: Create Sample Data (Optional)

You can create sample data using the built-in functions:

```typescript
// In your browser console
import { DatabaseService } from './src/services/database';

// Create sample properties
await DatabaseService.createSampleProperties();

// Create sample sales
await DatabaseService.createSampleSales();
```

## Database Schema Details

### Properties Table
- **id**: Auto-incrementing primary key
- **title**: Property title/name
- **description**: Detailed property description
- **price**: Property price (decimal)
- **bedrooms**: Number of bedrooms
- **sqft**: Square footage
- **address**: Street address
- **city**: City name
- **state**: State abbreviation
- **zip_code**: ZIP code
- **lat/lng**: GPS coordinates
- **status**: Available/Reserved/Sold
- **build_plan_url**: Floor plan URL
- **published**: Whether property is public
- **update_at**: Last update timestamp

### Images Table
- **id**: Auto-incrementing primary key
- **property_id**: Foreign key to properties
- **image_url**: Image URL or path
- **caption**: Image description
- **order**: Display order
- **created_at**: Creation timestamp

### Leads Table
- **id**: Auto-incrementing primary key
- **property_id**: Foreign key to properties (optional)
- **name**: Contact name
- **email**: Contact email
- **phone**: Contact phone
- **message**: Contact message
- **created_at**: Creation timestamp

### Sales Table
- **id**: Auto-incrementing primary key
- **label**: Sale name/label
- **discount_pct**: Discount percentage
- **starts_at**: Sale start date
- **ends_at**: Sale end date
- **active**: Whether sale is active
- **created_at**: Creation timestamp

### Settings Table
- **id**: Auto-incrementing primary key
- **key**: Setting name (unique)
- **value**: Setting value
- **description**: Setting description
- **created_at**: Creation timestamp
- **updated_at**: Last update timestamp

## Troubleshooting

### Connection Issues
- Verify MySQL service is running
- Check host, port, username, and password
- Ensure database exists
- Check firewall settings

### Permission Issues
```sql
-- Grant permissions to user
GRANT ALL PRIVILEGES ON real_estate.* TO 'your_user'@'localhost';
FLUSH PRIVILEGES;
```

### Table Issues
- Verify all tables exist
- Check table structure matches schema
- Ensure foreign key constraints are correct

## Performance Tips

1. **Indexes**: Add indexes on frequently queried fields
2. **Connection Pooling**: Already configured in the service
3. **Query Optimization**: Use prepared statements (already implemented)

Your app is now configured to use MySQL! 🎉
