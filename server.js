require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

require('./events/listeners'); // register listeners once at startup
const taskRoutes = require('./routes/tasks');

const app = express();
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
  next();
});

app.use('/tasks', taskRoutes);

// 404 handler for undefined routes
app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

// Global error handler (last)
app.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: Object.values(err.errors).map((e) => e.message) });
  }
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong' });
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error('MongoDB connection failed:', err.message));
