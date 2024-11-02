const Report = require('../models/Report');

// Create a new utility issue report
exports.createReport = async (req, res) => {
  const { type, description, location } = req.body;

  // Ensure the location is structured correctly
  const locationData = {
    address: location.address,
    city: location.city,
    postalCode: location.postalCode,
    country: location.country,
    coordinates: location.coordinates || [0, 0], // Fallback if coordinates are not provided
    type: 'Point', // GeoJSON type
  };

  try {
    const report = await Report.create({ 
      userId: req.user.id, // Persist userId of the report creator
      type, 
      description, 
      location: locationData // Pass the structured location data
    });
    res.status(201).json(report);
  } catch (error) {
    console.error('Error creating report:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};



// Get all reports for a user
exports.getReports = async (req, res) => {
  try {
    const reports = await Report.find({ userId: req.user.id });
    res.json(reports); // Return reports without modifying userId
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Get all reports for admin
exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.find({});
    res.json(reports);
  } catch (error) {
    console.error('Error fetching all reports:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



// Update report status
exports.updateReportStatus = async (req, res) => {
  const { reportId, status } = req.body;
  try {
    const report = await Report.findByIdAndUpdate(reportId, { status }, { new: true });
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    res.json(report);
  } catch (error) {
    console.error('Error updating report status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Assign a report to an employee
exports.assignReportToEmployee = async (req, res) => {
  const { reportId, employeeId } = req.body;
  console.log("Attempting to assign reportId:", reportId, "to employeeId:", employeeId);

  try {
    const report = await Report.findByIdAndUpdate(
      reportId,
      { assignedEmployee: employeeId },
      { new: true }
    );

    if (!report) {
      console.log("Report not found for ID:", reportId);
      return res.status(404).json({ message: 'Report not found' });
    }
    
    console.log("Report assigned successfully:", report);
    res.json(report);
  } catch (error) {
    console.error('Error assigning report:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get reports assigned to a specific employee
exports.getReportsByEmployee = async (req, res) => {
  const employeeId = req.user.id; // Get the authenticated user's ID
  try {
    const reports = await Report.find({ assignedEmployee: employeeId });
    res.json(reports);
  } catch (error) {
    console.error('Error fetching reports for employee:', error);
    res.status(500).json({ message: 'Error fetching reports for employee' });
  }
};

// Delete a report by ID
exports.deleteReport = async (req, res) => {
  const { reportId } = req.params; // Get reportId from the URL parameters
  try {
    const report = await Report.findByIdAndDelete(reportId);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    res.status(204).send(); // No content to send back
  } catch (error) {
    console.error('Error deleting report:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
