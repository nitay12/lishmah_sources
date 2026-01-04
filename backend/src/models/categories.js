const pool = require('../config/database');

/**
 * Categories Model
 * Database operations for sheet categories
 */
const categoriesModel = {
  /**
   * Get all categories
   * @returns {Promise<Array>} Array of category objects
   */
  async getAll() {
    const query = `
      SELECT
        c.id,
        c.name,
        c.created_at,
        COUNT(s.id) as sheet_count
      FROM categories c
      LEFT JOIN sheets s ON c.id = s.category_id
      GROUP BY c.id, c.name, c.created_at
      ORDER BY c.name
    `;

    const result = await pool.query(query);
    return result.rows;
  },

  /**
   * Get a single category by ID
   * @param {number} id - Category ID
   * @returns {Promise<Object|null>} Category object or null
   */
  async getById(id) {
    const query = 'SELECT * FROM categories WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  },

  /**
   * Create a new category
   * @param {string} name - Category name
   * @returns {Promise<Object>} Created category
   */
  async create(name) {
    const query = `
      INSERT INTO categories (name)
      VALUES ($1)
      RETURNING *
    `;

    const result = await pool.query(query, [name]);
    return result.rows[0];
  },

  /**
   * Delete a category
   * Note: Sheets with this category will have category_id set to NULL (ON DELETE SET NULL)
   * @param {number} id - Category ID
   * @returns {Promise<Object>} Deleted category
   */
  async delete(id) {
    const query = `
      DELETE FROM categories
      WHERE id = $1
      RETURNING *
    `;

    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
};

module.exports = categoriesModel;
