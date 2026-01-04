const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

/**
 * Authentication Routes
 * All routes are prefixed with /api/auth
 */

// POST /api/auth/login
router.post('/login', authController.login);

module.exports = router;
