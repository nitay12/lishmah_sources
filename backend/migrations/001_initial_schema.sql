-- Lishmah Sources Database Schema
-- Migration 001: Initial Schema
-- Created: 2026-01-04

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sheets Table
CREATE TABLE IF NOT EXISTS sheets (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    file_url TEXT NOT NULL,
    cloudinary_id VARCHAR(255) NOT NULL,
    download_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admins Table
CREATE TABLE IF NOT EXISTS admins (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_sheets_category ON sheets(category_id);
CREATE INDEX IF NOT EXISTS idx_sheets_created_at ON sheets(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sheets_downloads ON sheets(download_count DESC);

-- Insert default categories (optional)
INSERT INTO categories (name) VALUES
    ('פרשת שבוע'),
    ('הלכה'),
    ('מחשבה'),
    ('מועדים')
ON CONFLICT (name) DO NOTHING;

-- Success message
SELECT 'Database schema created successfully!' AS message;
