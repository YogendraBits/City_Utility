const express = require('express');
const { 
  createReport, 
  getReports, 
  updateReportStatus, 
  assignReportToEmployee, 
  getReportsByEmployee,
  getAllReports,
  deleteReport
} = require('../controllers/reportController');
const authMiddleware = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/isAdmin'); // Import the isAdmin middleware

const router = express.Router();

// Define the routes with authentication middleware
router.post('/', authMiddleware, createReport); // Create a new report
router.get('/', authMiddleware, getReports); // Get all reports for a user
router.get('/all', authMiddleware, isAdmin, getAllReports); // New endpoint for admin to get all reports
router.put('/status', authMiddleware, updateReportStatus); // Update report status
router.put('/assign', authMiddleware, assignReportToEmployee); // Assign report to employee
router.get('/assigned', authMiddleware, getReportsByEmployee); // Get reports assigned to employee
router.delete('/:reportId', authMiddleware, deleteReport);

module.exports = router;
