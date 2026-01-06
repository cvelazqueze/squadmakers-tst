require('dotenv').config();
const express = require('express');
const cors = require('cors');
const logger = require('./config/logger');

const jokeRoutes = require('./routes/jokeRoutes');
const mathRoutes = require('./routes/mathRoutes');
const queryRoutes = require('./routes/queryRoutes');
const userRoutes = require('./routes/userRoutes');
const themeRoutes = require('./routes/themeRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/chistes', jokeRoutes);
app.use('/matematico', mathRoutes);
app.use('/consultas', queryRoutes);
app.use('/usuarios', userRoutes);
app.use('/tematicas', themeRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'SquadMakers Jokes API',
    version: '1.0.0',
    endpoints: {
      jokes: '/chistes',
      math: '/matematico',
      queries: '/consultas',
      users: '/usuarios',
      themes: '/tematicas',
      health: '/health',
      docs: '/api-docs'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler - must be last
app.use((req, res) => {
  logger.warn(`404 - Endpoint not found: ${req.method} ${req.path}`);
  res.status(404).json({ 
    error: 'Endpoint not found',
    path: req.path,
    method: req.method,
    availableEndpoints: {
      jokes: '/chistes',
      math: '/matematico',
      queries: '/consultas',
      users: '/usuarios',
      themes: '/tematicas',
      health: '/health'
    }
  });
});

module.exports = app;
