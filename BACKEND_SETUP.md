# Backend API Setup Guide

## Overview

This guide explains how to set up the backend API server that connects to MySQL. The frontend React app will communicate with this backend API instead of trying to connect directly to MySQL.

## Architecture

```
Frontend (React) ←→ Backend API (Express) ←→ MySQL Database
```

## Step 1: Install Backend Dependencies

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

## Step 2: Configure Environment Variables

Create a `.env` file in the `backend/` directory:

```bash
# MySQL Configuration
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=real_estate
MYSQL_PORT=3306

# Server Configuration
PORT=5000
```

## Step 3: Start the Backend Server

```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The server will start on port 5000 and test the MySQL connection.

## Step 4: Test the API

Once the server is running, test the connection:

```bash
curl http://localhost:5000/api/test
```

You should see:
```json
{
  "success": true,
  "message": "Database connected"
}
```

## API Endpoints

### Properties
- `GET /api/properties` - Get all published properties
- `GET /api/properties/:id` - Get property by ID
- `POST /api/properties` - Create new property
- `PUT /api/properties/:id` - Update property
- `DELETE /api/properties/:id` - Delete property

### Images
- `POST /api/upload-image` - Upload property image

### Communities
- `GET /api/communities` - Get all communities

### Leads
- `POST /api/leads` - Create new lead

### Sales
- `GET /api/sales` - Get active sales

## Step 5: Update Frontend to Use API

Once the backend is running, update the frontend `DatabaseService` to call the API endpoints instead of using mock data.

## Troubleshooting

### Backend won't start
- Check if port 5000 is available
- Verify MySQL is running
- Check environment variables

### Database connection fails
- Verify MySQL credentials
- Check if database exists
- Ensure MySQL service is running

### CORS issues
- Backend is configured with CORS enabled
- Frontend should be able to call API endpoints

## Next Steps

1. **Start the backend server**
2. **Test the API endpoints**
3. **Update frontend to use API**
4. **Deploy both frontend and backend**

## Deploying the Backend to Render (recommended)

1. Create a MySQL database (PlanetScale/Railway/Neon-MySQL) and note: host, port, user, password, database.
2. In this repo root, use the provided `render.yaml` or create a new Web Service in Render:

   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `node server.js`
   - Health Check Path: `/api/test`
   - Add a persistent disk mounted at `backend/uploads` so images persist
   - Add env vars: `MYSQL_HOST`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE`, `MYSQL_PORT`

3. Apply schema to your DB:

```bash
mysql -h <host> -P <port> -u <user> -p < /Users/sankarshan/Real_Estate_Profolio/backend/schema.sql
```

4. After the service is live, copy the Render URL (e.g., `https://real-estate-backend.onrender.com`).

5. In Netlify, set frontend env var:

```bash
netlify env:set REACT_APP_API_BASE_URL https://YOUR-RENDER-URL
netlify deploy --prod
```

Your backend API is now ready to serve your React frontend! 🚀
