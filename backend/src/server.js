const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import routes
const sheetsRoutes = require('./routes/sheets');
const categoriesRoutes = require('./routes/categories');
const authRoutes = require('./routes/auth');

// Initialize database and Cloudinary (validates configuration)
require('./config/database');
require('./config/cloudinary');

const app = express();

// Middleware
app.use(cors()); // Enable CORS for all origins (configure for production)
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// API Routes
app.use('/api/sheets', sheetsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/auth', authRoutes);

// Health check endpoint (important for Render sleep mode detection)
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Lishmah Sources API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      sheets: '/api/sheets',
      categories: '/api/categories',
      auth: '/api/auth/login'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: 'הנתיב לא נמצא',
    path: req.path
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);

  res.status(err.status || 500).json({
    error: 'Internal server error',
    message: err.message || 'שגיאת שרת פנימית',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('========================================');
  console.log(`🚀 Lishmah Sources API Server`);
  console.log(`📡 Listening on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log('========================================');
});

module.exports = app;
