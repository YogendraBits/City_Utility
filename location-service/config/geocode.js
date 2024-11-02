const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const getLocationData = async (address = null) => {
  if (address) {
    // Fetch location based on provided address using OpenCage API
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=${process.env.OPENCAGE_API_KEY}`;
    const response = await axios.get(url);

    if (response.data.results.length > 0) {
      const result = response.data.results[0];
      return {
        address: result.formatted || `${result.components.road || ''}, ${result.components.neighbourhood || ''}`,
        city: result.components.city || result.components.town || '',
        postalCode: result.components.postcode || '',
        country: result.components.country || '',
        coordinates: [result.geometry.lng, result.geometry.lat],
      };
    } else {
      throw new Error('Location not found for the provided address');
    }
  } else {
    // Fetch current location based on IP using an IP geolocation API
    const ipUrl = `https://ipapi.co/json/`; // Using ipapi.co as an example
    const response = await axios.get(ipUrl);

    if (response.data) {
      return {
        address: `${response.data.street || ''}, ${response.data.city || ''}`,
        city: response.data.city || '',
        postalCode: response.data.postal || '',
        country: response.data.country_name || '',
        coordinates: [response.data.longitude, response.data.latitude],
      };
    } else {
      throw new Error('Unable to retrieve location based on IP');
    }
  }
};

module.exports = getLocationData;
