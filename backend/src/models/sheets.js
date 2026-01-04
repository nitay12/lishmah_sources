const pool = require('../config/database');

/**
 * Sheets Model
 * Database operations for PDF source sheets
 */
const sheetsModel = {
  /**
   * Get all sheets with optional filtering and sorting
   * @param {number|null} categoryId - Filter by category (null for all)
   * @param {string} sortBy - 'newest' or 'popular'
   * @returns {Promise<Array>} Array of sheet objects
   */
  async getAll(categoryId = null, sortBy = 'newest') {
    let query = `
      SELECT
        s.id,
        s.title,
        s.category_id,
        s.file_url,
        s.cloudinary_id,
        s.download_count,
        s.created_at,
        c.name as category_name
      FROM sheets s
      LEFT JOIN categories c ON s.category_id = c.id
    `;

    const params = [];

    // Add WHERE clause if category filter is specified
    if (categoryId) {
      query += ' WHERE s.category_id = $1';
      params.push(categoryId);
    }

    // Add ORDER BY clause based on sort preference
    if (sortBy === 'popular') {
      query += ' ORDER BY s.download_count DESC, s.created_at DESC';
    } else {
      query += ' ORDER BY s.created_at DESC';
    }

    const result = await pool.query(query, params);
    return result.rows;
  },

  /**
   * Get a single sheet by ID
   * @param {number} id - Sheet ID
   * @returns {Promise<Object|null>} Sheet object or null
   */
  async getById(id) {
    const query = `
      SELECT
        s.*,
        c.name as category_name
      FROM sheets s
      LEFT JOIN categories c ON s.category_id = c.id
      WHERE s.id = $1
    `;

    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  },

  /**
   * Increment download counter for a sheet
   * CRITICAL: This MUST be called BEFORE returning file URL to ensure accurate counting
   * @param {number} id - Sheet ID
   * @returns {Promise<Object>} Updated sheet with file_url
   */
  async incrementDownload(id) {
    const query = `
      UPDATE sheets
      SET download_count = download_count + 1
      WHERE id = $1
      RETURNING file_url, download_count
    `;

    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  /**
   * Create a new sheet
   * @param {string} title - Sheet title
   * @param {number|null} categoryId - Category ID (can be null)
   * @param {string} fileUrl - Cloudinary URL
   * @param {string} cloudinaryId - Cloudinary public ID
   * @returns {Promise<Object>} Created sheet
   */
  async create(title, categoryId, fileUrl, cloudinaryId) {
    const query = `
      INSERT INTO sheets (title, category_id, file_url, cloudinary_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;

    const result = await pool.query(query, [
      title,
      categoryId || null,
      fileUrl,
      cloudinaryId
    ]);

    return result.rows[0];
  },

  /**
   * Delete a sheet
   * @param {number} id - Sheet ID
   * @returns {Promise<Object>} Deleted sheet with cloudinary_id
   */
  async delete(id) {
    const query = `
      DELETE FROM sheets
      WHERE id = $1
      RETURNING cloudinary_id, title
    `;

    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
};

module.exports = sheetsModel;
