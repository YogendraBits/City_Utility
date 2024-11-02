const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const archieve_Routes = require('./routes/archieve_Routes');

const app = express();
const PORT = process.env.PORT || 5005;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/reports', archieve_Routes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
