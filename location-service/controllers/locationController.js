const axios = require('axios');

// Controller function to handle the location fetching logic
const getLocationData = async (req, res) => {
  const { latitude, longitude } = req.query;

  // Ensure latitude and longitude are passed as strings
  if (!latitude || !longitude) {
    return res.status(400).json({ message: 'Latitude and longitude are required' });
  }

  try {
    // Construct the URL for the OpenCage API or any other geocoding service
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude},${longitude}&key=${process.env.OPENCAGE_API_KEY}`;
    const response = await axios.get(url);

    // Check if results are returned
    if (response.data.results && response.data.results.length > 0) {
      const result = response.data.results[0];

      // Extracting components
      const streetAddress = result.components.road ? result.components.road : '';
      const houseNumber = result.components.house_number ? `${result.components.house_number}, ` : '';
      const neighbourhood = result.components.neighbourhood ? `${result.components.neighbourhood}, ` : '';
      const city = result.components.state_district || result.components.town || '';
      const state = result.components.state || '';
      const postalCode = result.components.postcode || '';
      const country = result.components.country || '';

      // Building the address format
      const formattedAddress = `${houseNumber}${streetAddress}${neighbourhood}`.replace(/,\s*$/, ''); // Trim any trailing comma
      const formattedCity = `${city}${state ? `, ${state}` : ''}`.trim();

      res.json({
        address: formattedAddress,
        city: formattedCity,
        postalCode: postalCode,
        country: country,
        coordinates: [longitude, latitude],
      });
    } else {
      res.status(404).json({ message: 'Location not found for the provided coordinates' });
    }
  } catch (error) {
    console.error('Error fetching location data from OpenCage:', error);
    res.status(500).json({ message: 'Failed to fetch location data.' });
  }
};

module.exports = { getLocationData };
