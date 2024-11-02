// routes/announcementRoutes.js
const express = require('express');
const {
  createAnnouncement,
  getAllAnnouncements,
  updateAnnouncement,
  deleteAnnouncement,
} = require('../controllers/announcementController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, createAnnouncement); // Create a new announcement
router.get('/', getAllAnnouncements); // Get all announcements (publicly accessible)
router.put('/:announcementId', authMiddleware, updateAnnouncement); // Update an announcement
router.delete('/:announcementId', authMiddleware, deleteAnnouncement); // Delete an announcement

module.exports = router;
