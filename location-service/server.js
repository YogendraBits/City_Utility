const express = require('express');
const locationRoutes = require('./routes/locationRoutes'); // Adjust the path as necessary
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5002; // Use 5002 for your Location Service

app.use(cors());
// Middleware to parse JSON
app.use(express.json());

// Mount the router
app.use('/api/location', locationRoutes); // Ensure this matches your frontend API calls

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
