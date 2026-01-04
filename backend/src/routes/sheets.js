const express = require('express');
const router = express.Router();
const sheetsController = require('../controllers/sheetsController');
const { authenticateToken } = require('../middleware/auth');
const { upload, handleMulterError } = require('../middleware/fileValidation');

/**
 * Sheets Routes
 * All routes are prefixed with /api/sheets
 */

// Public routes
router.get('/', sheetsController.getSheets);
router.get('/:id/download', sheetsController.downloadSheet);

// Admin routes (protected)
router.post(
  '/',
  authenticateToken,
  upload.single('file'), // Field name must be 'file'
  handleMulterError,
  sheetsController.createSheet
);

router.delete(
  '/:id',
  authenticateToken,
  sheetsController.deleteSheet
);

module.exports = router;
