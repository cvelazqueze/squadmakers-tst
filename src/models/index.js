const { Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs');
const logger = require('../config/logger');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '../../database/jokes.db');
const DB_DIR = path.dirname(DB_PATH);

// Ensure database directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// Initialize Sequelize
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: DB_PATH,
  logging: (msg) => logger.debug(msg),
  define: {
    timestamps: false, // We'll use created_at manually
    underscored: false
  }
});

// Import models
const User = require('./User')(sequelize);
const Theme = require('./Theme')(sequelize);
const Joke = require('./Joke')(sequelize);

// Define associations
User.hasMany(Joke, { 
  foreignKey: 'user_id', 
  as: 'jokes',
  onDelete: 'CASCADE'
});
Joke.belongsTo(User, { 
  foreignKey: 'user_id', 
  as: 'user'
});

Theme.hasMany(Joke, { 
  foreignKey: 'theme_id', 
  as: 'jokes',
  onDelete: 'CASCADE'
});
Joke.belongsTo(Theme, { 
  foreignKey: 'theme_id', 
  as: 'theme'
});

// Initialize database
const initDatabase = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Connected to SQLite database via Sequelize');
    
    // Sync models (create tables if they don't exist)
    await sequelize.sync({ alter: false });
    logger.info('Database models synchronized');
    
    return sequelize;
  } catch (error) {
    logger.error('Unable to connect to the database:', error);
    throw error;
  }
};

module.exports = {
  sequelize,
  User,
  Theme,
  Joke,
  initDatabase
};
