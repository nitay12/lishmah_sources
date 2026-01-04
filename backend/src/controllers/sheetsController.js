const sheetsModel = require('../models/sheets');
const cloudinary = require('../config/cloudinary');
const { Readable } = require('stream');

/**
 * Sheets Controller
 * Handles HTTP requests for sheet operations
 */
const sheetsController = {
  /**
   * GET /api/sheets
   * Get all sheets with optional filtering and sorting
   */
  async getSheets(req, res) {
    try {
      const { category, sort } = req.query;

      const sheets = await sheetsModel.getAll(
        category ? parseInt(category) : null,
        sort || 'newest'
      );

      res.json(sheets);
    } catch (error) {
      console.error('Error fetching sheets:', error);
      res.status(500).json({
        error: 'Failed to fetch sheets',
        message: 'שגיאה בטעינת דפי המקורות'
      });
    }
  },

  /**
   * GET /api/sheets/:id/download
   * Increment download counter and return file URL
   * CRITICAL: Counter increments BEFORE returning URL to ensure accuracy
   */
  async downloadSheet(req, res) {
    try {
      const { id } = req.params;

      // Increment counter and get file URL atomically
      const sheet = await sheetsModel.incrementDownload(id);

      if (!sheet) {
        return res.status(404).json({
          error: 'Sheet not found',
          message: 'דף המקורות לא נמצא'
        });
      }

      // Return file URL - client will open it
      res.json({
        fileUrl: sheet.file_url,
        downloadCount: sheet.download_count
      });
    } catch (error) {
      console.error('Error downloading sheet:', error);
      res.status(500).json({
        error: 'Download failed',
        message: 'ההורדה נכשלה'
      });
    }
  },

  /**
   * POST /api/sheets
   * Create a new sheet (Admin only)
   * Streams file directly from buffer to Cloudinary (never saves to disk)
   */
  async createSheet(req, res) {
    try {
      const { title, category_id } = req.body;
      const file = req.file;

      // Validate required fields
      if (!title || !file) {
        return res.status(400).json({
          error: 'Missing required fields',
          message: 'חסרים שדות חובה (כותרת וקובץ)'
        });
      }

      // Upload to Cloudinary from buffer (streaming, no disk storage)
      const uploadPromise = new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'lishmah_sources',
            resource_type: 'raw', // For PDF files
            format: 'pdf',
            public_id: `sheet_${Date.now()}` // Unique filename
          },
          (error, result) => {
            if (error) {
              console.error('Cloudinary upload error:', error);
              reject(error);
            } else {
              resolve(result);
            }
          }
        );

        // Stream file buffer to Cloudinary
        const bufferStream = Readable.from(file.buffer);
        bufferStream.pipe(uploadStream);
      });

      // Wait for upload to complete
      const uploadResult = await uploadPromise;

      // Save sheet metadata to database
      const sheet = await sheetsModel.create(
        title,
        category_id ? parseInt(category_id) : null,
        uploadResult.secure_url,
        uploadResult.public_id
      );

      res.status(201).json({
        message: 'Sheet created successfully',
        sheet: sheet
      });
    } catch (error) {
      console.error('Error creating sheet:', error);
      res.status(500).json({
        error: 'Failed to create sheet',
        message: 'שגיאה ביצירת דף המקורות'
      });
    }
  },

  /**
   * DELETE /api/sheets/:id
   * Delete a sheet (Admin only)
   * Deletes both database record and Cloudinary file
   */
  async deleteSheet(req, res) {
    try {
      const { id } = req.params;

      // Delete from database and get cloudinary_id
      const deletedSheet = await sheetsModel.delete(id);

      if (!deletedSheet) {
        return res.status(404).json({
          error: 'Sheet not found',
          message: 'דף המקורות לא נמצא'
        });
      }

      // Delete file from Cloudinary
      try {
        await cloudinary.uploader.destroy(deletedSheet.cloudinary_id, {
          resource_type: 'raw'
        });
      } catch (cloudinaryError) {
        console.error('Cloudinary deletion error:', cloudinaryError);
        // Continue even if Cloudinary deletion fails (database is already updated)
      }

      res.json({
        message: 'Sheet deleted successfully',
        title: deletedSheet.title
      });
    } catch (error) {
      console.error('Error deleting sheet:', error);
      res.status(500).json({
        error: 'Failed to delete sheet',
        message: 'שגיאה במחיקת דף המקורות'
      });
    }
  }
};

module.exports = sheetsController;
