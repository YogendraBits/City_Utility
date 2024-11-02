const Report = require('../models/archieve_report');

// Create a new report
const createReport = async (req, res) => {
  try {
    const report = new Report(req.body);
    await report.save();
    res.status(201).json(report);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all reports
const getReports = async (req, res) => {
  try {
    const reports = await Report.find().populate('userId assignedEmployee');
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createReport,
  getReports,
};
