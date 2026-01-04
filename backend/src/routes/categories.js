const express = require('express');
const router = express.Router();
const categoriesController = require('../controllers/categoriesController');
const { authenticateToken } = require('../middleware/auth');

/**
 * Categories Routes
 * All routes are prefixed with /api/categories
 */

// Public routes
router.get('/', categoriesController.getCategories);

// Admin routes (protected)
router.post('/', authenticateToken, categoriesController.createCategory);
router.delete('/:id', authenticateToken, categoriesController.deleteCategory);

module.exports = router;
