const express = require('express');
const cors = require('cors');
const stringRoutes = require('./routes/stringRoutes');
const filterRoutes = require('./routes/filterRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Routes
// Important: filterRoutes must come before stringRoutes to avoid route conflicts
// The /strings/filter-by-natural-language route needs to be matched before /strings/:string_value
app.use('/strings', filterRoutes);
app.use('/strings', stringRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'String Analysis API',
    version: '1.0.0',
    endpoints: {
      'POST /strings': 'Create and analyze a new string',
      'GET /strings/:string_value': 'Get a specific string by its value',
      'GET /strings': 'Get all strings with optional filtering',
      'GET /strings/filter-by-natural-language': 'Filter strings using natural language',
      'DELETE /strings/:string_value': 'Delete a specific string'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested endpoint does not exist'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message || 'An unexpected error occurred'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`String Analysis API is running on port ${PORT}`);
  console.log(`Access the API at http://localhost:${PORT}`);
});

module.exports = app;
