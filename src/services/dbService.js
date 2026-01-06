const { User, Theme, Joke } = require('../models');
const { Op } = require('sequelize');
const logger = require('../config/logger');

/**
 * Create or get user by name (upsert)
 */
const createOrGetUser = async (userName) => {
  try {
    const [user, created] = await User.findOrCreate({
      where: { name: userName },
      defaults: { name: userName }
    });

    logger.info(`User "${userName}" ${created ? 'created' : 'already exists'} with ID: ${user.id}`);
    return { id: user.id, name: user.name, created };
  } catch (error) {
    logger.error('Error in createOrGetUser:', error.message);
    throw error;
  }
};

/**
 * Create or get theme by name (upsert)
 */
const createOrGetTheme = async (themeName) => {
  try {
    const [theme, created] = await Theme.findOrCreate({
      where: { name: themeName },
      defaults: { name: themeName }
    });

    logger.info(`Theme "${themeName}" ${created ? 'created' : 'already exists'} with ID: ${theme.id}`);
    return { id: theme.id, name: theme.name, created };
  } catch (error) {
    logger.error('Error in createOrGetTheme:', error.message);
    throw error;
  }
};

/**
 * Save a joke to the database with user and theme
 */
const saveJoke = async (text, userName, themeName) => {
  try {
    // Get or create user
    const user = await createOrGetUser(userName);
    
    // Get or create theme (upsert)
    const theme = await createOrGetTheme(themeName);
    
    // Save joke with user_id and theme_id
    const joke = await Joke.create({
      text,
      user_id: user.id,
      theme_id: theme.id
    });

    logger.info(`Joke saved with ID: ${joke.id} by user "${userName}" with theme "${themeName}"`);
    
    return {
      id: joke.id,
      text: joke.text,
      user: { id: user.id, name: user.name },
      theme: { id: theme.id, name: theme.name }
    };
  } catch (error) {
    logger.error('Error in saveJoke:', error.message);
    throw error;
  }
};

/**
 * Update a joke by ID
 */
const updateJoke = async (id, newText) => {
  try {
    const joke = await Joke.findByPk(id);
    
    if (!joke) {
      throw new Error(`Joke with ID ${id} not found`);
    }
    
    joke.text = newText;
    await joke.save();
    
    logger.info(`Joke ${id} updated successfully`);
    return { id: joke.id, text: joke.text };
  } catch (error) {
    logger.error('Error in updateJoke:', error.message);
    throw error;
  }
};

/**
 * Delete a joke by ID
 */
const deleteJoke = async (id) => {
  try {
    const joke = await Joke.findByPk(id);
    
    if (!joke) {
      throw new Error(`Joke with ID ${id} not found`);
    }
    
    await joke.destroy();
    
    logger.info(`Joke ${id} deleted successfully`);
    return { id, deleted: true };
  } catch (error) {
    logger.error('Error in deleteJoke:', error.message);
    throw error;
  }
};

/**
 * Get all jokes by user name
 */
const getJokesByUser = async (userName) => {
  try {
    const jokes = await Joke.findAll({
      include: [
        {
          model: User,
          as: 'user',
          where: { name: userName },
          attributes: ['name'],
          required: true
        },
        {
          model: Theme,
          as: 'theme',
          attributes: ['name'],
          required: true
        }
      ],
      attributes: ['id', 'text', 'created_at']
    });

    return jokes.map(joke => ({
      id: joke.id,
      text: joke.text,
      created_at: joke.created_at,
      user_name: joke.user.name,
      theme_name: joke.theme.name
    }));
  } catch (error) {
    logger.error('Error in getJokesByUser:', error.message);
    throw error;
  }
};

/**
 * Get all jokes by theme
 */
const getJokesByTheme = async (themeName) => {
  try {
    const jokes = await Joke.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name'],
          required: true
        },
        {
          model: Theme,
          as: 'theme',
          where: { name: themeName },
          attributes: ['name'],
          required: true
        }
      ],
      attributes: ['id', 'text', 'created_at']
    });

    return jokes.map(joke => ({
      id: joke.id,
      text: joke.text,
      created_at: joke.created_at,
      user_name: joke.user.name,
      theme_name: joke.theme.name
    }));
  } catch (error) {
    logger.error('Error in getJokesByTheme:', error.message);
    throw error;
  }
};

/**
 * Get all jokes by user and theme
 */
const getJokesByUserAndTheme = async (userName, themeName) => {
  try {
    const jokes = await Joke.findAll({
      include: [
        {
          model: User,
          as: 'user',
          where: { name: userName },
          attributes: ['name'],
          required: true
        },
        {
          model: Theme,
          as: 'theme',
          where: { name: themeName },
          attributes: ['name'],
          required: true
        }
      ],
      attributes: ['id', 'text', 'created_at']
    });

    return jokes.map(joke => ({
      id: joke.id,
      text: joke.text,
      created_at: joke.created_at,
      user_name: joke.user.name,
      theme_name: joke.theme.name
    }));
  } catch (error) {
    logger.error('Error in getJokesByUserAndTheme:', error.message);
    throw error;
  }
};

/**
 * Get all users
 */
const getAllUsers = async () => {
  try {
    const users = await User.findAll({
      order: [['name', 'ASC']],
      attributes: ['id', 'name']
    });
    
    return users.map(user => ({
      id: user.id,
      name: user.name
    }));
  } catch (error) {
    logger.error('Error in getAllUsers:', error.message);
    throw error;
  }
};

/**
 * Get all themes
 */
const getAllThemes = async () => {
  try {
    const themes = await Theme.findAll({
      order: [['name', 'ASC']],
      attributes: ['id', 'name']
    });
    
    return themes.map(theme => ({
      id: theme.id,
      name: theme.name
    }));
  } catch (error) {
    logger.error('Error in getAllThemes:', error.message);
    throw error;
  }
};

module.exports = {
  createOrGetUser,
  createOrGetTheme,
  saveJoke,
  updateJoke,
  deleteJoke,
  getJokesByUser,
  getJokesByTheme,
  getJokesByUserAndTheme,
  getAllUsers,
  getAllThemes
};
