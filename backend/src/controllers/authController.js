const bcrypt = require('bcryptjs');
const { generateToken } = require('../middleware/auth');
require('dotenv').config();

/**
 * Authentication Controller
 * Handles admin login
 */
const authController = {
  /**
   * POST /api/auth/login
   * Authenticate admin and return JWT token
   */
  async login(req, res) {
    try {
      const { username, password } = req.body;

      // Validate input
      if (!username || !password) {
        return res.status(400).json({
          error: 'Username and password required',
          message: 'נדרש שם משתמש וסיסמה'
        });
      }

      // Get admin credentials from environment variables
      const adminUsername = process.env.ADMIN_USERNAME;
      const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

      if (!adminUsername || !adminPasswordHash) {
        console.error('❌ Admin credentials not configured in .env');
        return res.status(500).json({
          error: 'Server configuration error',
          message: 'שגיאת הגדרות שרת'
        });
      }

      // Check username
      if (username !== adminUsername) {
        return res.status(401).json({
          error: 'Invalid credentials',
          message: 'שם משתמש או סיסמה שגויים'
        });
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, adminPasswordHash);

      if (!isPasswordValid) {
        return res.status(401).json({
          error: 'Invalid credentials',
          message: 'שם משתמש או סיסמה שגויים'
        });
      }

      // Generate JWT token
      const token = generateToken(username);

      res.json({
        message: 'Login successful',
        token: token,
        username: username
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        error: 'Login failed',
        message: 'ההתחברות נכשלה'
      });
    }
  }
};

module.exports = authController;
