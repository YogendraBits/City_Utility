const express = require('express');
const { 
  createHistory, // Change to camelCase
  getAllHistory,
  getHistoryByUserId // Change to camelCase
} = require('../controllers/historyController');
const authMiddleware = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/isAdmin'); // Import the isAdmin middleware

const router = express.Router();

// Define the routes with authentication middleware
router.post('/', authMiddleware, createHistory); // Create a new history
router.get('/all', authMiddleware, isAdmin, getAllHistory); // New endpoint for admin to get all histories
router.get('/user/:userId', authMiddleware,getHistoryByUserId);

module.exports = router;
