require('dotenv').config();
const { initDatabase, seedDatabase } = require('./config/database');
const logger = require('./config/logger');
const app = require('./app');

const PORT = process.env.PORT || 3000;

// Initialize database and start server
const startServer = async () => {
  try {
    await initDatabase();
    await seedDatabase();
    
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      logger.info(`Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Only start server if this file is run directly (not when imported)
if (require.main === module) {
  startServer();
}

module.exports = app;
