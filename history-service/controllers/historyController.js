const History = require('../models/history');

// Create  history
exports.createHistory = async (req, res) => {
  const { userId, type, description, coordinates, createdAt, updatedAt, assignedEmployee, status } = req.body;

  // Validate coordinates
  if (!Array.isArray(coordinates) || coordinates.length !== 2) {
    return res.status(400).json({ message: 'Invalid coordinates format. It should be an array with two numbers.' });
  }

  try {
    const newHistory = await History.create({
      userId,
      type,
      description,
      coordinates,
      assignedEmployee: assignedEmployee || null,
      status: status || 'resolved',
      createdAt: createdAt || new Date(),
      updatedAt: updatedAt || new Date(),
    });

    res.status(201).json(newHistory);
  } catch (error) {
    console.error('Error creating history:', error); // Log the error
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// Get all histories for admin
exports.getAllHistory = async (req, res) => {
  try {
    const histories = await History.find({});
    res.json(histories);
  } catch (error) {
    console.error('Error fetching all histories:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Get all histories for a specific user
exports.getHistoryByUserId = async (req, res) => {
  const { userId } = req.params; // Get userId from the route parameters

  try {
    const histories = await History.find({ userId }); // Find histories by userId
    if (!histories.length) {
      return res.status(404).json({ message: 'No history found for this user.' });
    }
    res.json(histories);
  } catch (error) {
    console.error('Error fetching histories by user ID:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
