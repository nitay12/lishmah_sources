const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * Middleware to authenticate JWT tokens
 * Protects admin routes from unauthorized access
 */
const authenticateToken = (req, res, next) => {
  // Get token from Authorization header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({
      error: 'Access token required',
      message: 'נדרש אימות למשתמש מנהל'
    });
  }

  // Verify token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        error: 'Invalid or expired token',
        message: 'אסימון לא תקף או פג תוקפו'
      });
    }

    // Attach user info to request
    req.user = user;
    next();
  });
};

/**
 * Generate JWT token for admin login
 */
const generateToken = (username) => {
  return jwt.sign(
    { username },
    process.env.JWT_SECRET,
    { expiresIn: '24h' } // Token valid for 24 hours
  );
};

module.exports = {
  authenticateToken,
  generateToken
};
