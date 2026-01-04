const multer = require('multer');

/**
 * File validation middleware using Multer
 * CRITICAL: Uses memory storage (not disk) for Render free tier compatibility
 */

// Configure multer to store files in memory (buffer)
const storage = multer.memoryStorage();

// File filter - accept PDF only
const fileFilter = (req, file, cb) => {
  // Check MIME type
  if (file.mimetype === 'application/pdf') {
    cb(null, true); // Accept file
  } else {
    cb(
      new Error('Only PDF files are allowed. קבצי PDF בלבד מותרים.'),
      false
    );
  }
};

// Configure multer with storage, filter, and size limits
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB maximum file size
  }
});

// Error handling middleware for multer errors
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Multer-specific errors
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'File too large',
        message: 'הקובץ גדול מדי. מקסימום 10MB'
      });
    }
    return res.status(400).json({
      error: 'File upload error',
      message: err.message
    });
  } else if (err) {
    // Other errors (like file type validation)
    return res.status(400).json({
      error: 'Invalid file',
      message: err.message
    });
  }
  next();
};

module.exports = {
  upload,
  handleMulterError
};
