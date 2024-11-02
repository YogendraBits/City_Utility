const getLocationData = require('../config/geocode');

// Get live location using OpenCage or similar service
exports.getLocation = async (req, res) => {
  const { address } = req.query;

  try {
    const locationData = address
      ? await getLocationData(address) // Get location based on address
      : await getLocationData(); // Get current location if no address

    res.json(locationData);
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: error.message });
  }
};
