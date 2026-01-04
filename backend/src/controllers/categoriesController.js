const categoriesModel = require('../models/categories');

/**
 * Categories Controller
 * Handles HTTP requests for category operations
 */
const categoriesController = {
  /**
   * GET /api/categories
   * Get all categories with sheet counts
   */
  async getCategories(req, res) {
    try {
      const categories = await categoriesModel.getAll();
      res.json(categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({
        error: 'Failed to fetch categories',
        message: 'שגיאה בטעינת הקטגוריות'
      });
    }
  },

  /**
   * POST /api/categories
   * Create a new category (Admin only)
   */
  async createCategory(req, res) {
    try {
      const { name } = req.body;

      if (!name || name.trim() === '') {
        return res.status(400).json({
          error: 'Category name required',
          message: 'נדרש שם קטגוריה'
        });
      }

      const category = await categoriesModel.create(name.trim());

      res.status(201).json({
        message: 'Category created successfully',
        category: category
      });
    } catch (error) {
      // Handle unique constraint violation
      if (error.code === '23505') {
        return res.status(409).json({
          error: 'Category already exists',
          message: 'קטגוריה זו כבר קיימת'
        });
      }

      console.error('Error creating category:', error);
      res.status(500).json({
        error: 'Failed to create category',
        message: 'שגיאה ביצירת הקטגוריה'
      });
    }
  },

  /**
   * DELETE /api/categories/:id
   * Delete a category (Admin only)
   * Sheets with this category will have category_id set to NULL
   */
  async deleteCategory(req, res) {
    try {
      const { id } = req.params;

      const deletedCategory = await categoriesModel.delete(id);

      if (!deletedCategory) {
        return res.status(404).json({
          error: 'Category not found',
          message: 'קטגוריה לא נמצאה'
        });
      }

      res.json({
        message: 'Category deleted successfully',
        category: deletedCategory
      });
    } catch (error) {
      console.error('Error deleting category:', error);
      res.status(500).json({
        error: 'Failed to delete category',
        message: 'שגיאה במחיקת הקטגוריה'
      });
    }
  }
};

module.exports = categoriesController;
