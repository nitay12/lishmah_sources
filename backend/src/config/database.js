const { Pool } = require('pg');
require('dotenv').config();

// PostgreSQL connection pool for Neon Tech
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Required for Neon Tech
  }
});

// Test database connection on startup
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Database connection error:', err.message);
    process.exit(1);
  } else {
    console.log('✅ Database connected successfully:', res.rows[0].now);
  }
});

// Handle pool errors
pool.on('error', (err) => {
  console.error('Unexpected database error:', err);
});

module.exports = pool;
