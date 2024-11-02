const express = require('express');
const { getLocationData } = require('../controllers/locationController'); // Adjust the path as necessary
const router = express.Router();

router.get('/api/location', getLocationData); // Use the controller

module.exports = router;
