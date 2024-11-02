// controllers/announcementController.js
const Announcement = require('../models/Announcement');

// Create a new announcement
exports.createAnnouncement = async (req, res) => {
  const { title, content, type, startDate, endDate } = req.body;

  try {
    const announcement = new Announcement({ title, content, type, startDate, endDate });
    await announcement.save();
    res.status(201).json(announcement);
  } catch (error) {
    console.error('Error creating announcement:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all announcements
exports.getAllAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find();
    res.json(announcements);
  } catch (error) {
    console.error('Error fetching announcements:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Edit an announcement
exports.updateAnnouncement = async (req, res) => {
  const { announcementId } = req.params;
  const { title, content, type, startDate, endDate } = req.body;

  try {
    const announcement = await Announcement.findByIdAndUpdate(
      announcementId,
      { title, content, type, startDate, endDate, updatedAt: Date.now() },
      { new: true }
    );
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }
    res.json(announcement);
  } catch (error) {
    console.error('Error updating announcement:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete an announcement
exports.deleteAnnouncement = async (req, res) => {
  const { announcementId } = req.params;

  try {
    const announcement = await Announcement.findByIdAndDelete(announcementId);
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }
    res.json({ message: 'Announcement deleted' });
  } catch (error) {
    console.error('Error deleting announcement:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
