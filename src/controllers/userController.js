const dbService = require('../services/dbService');
const logger = require('../config/logger');

/**
 * POST /usuarios - Create a user
 */
const createUser = async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Name parameter is required and must be a non-empty string' 
      });
    }
    
    const result = await dbService.createOrGetUser(name.trim());
    logger.info(`User "${name}" ${result.created ? 'created' : 'already exists'}`);
    res.status(result.created ? 201 : 200).json(result);
  } catch (error) {
    logger.error('Error in createUser:', error.message);
    res.status(500).json({ error: error.message });
  }
};

/**
 * GET /usuarios - Get all users
 */
const getAllUsers = async (req, res) => {
  try {
    const users = await dbService.getAllUsers();
    logger.info(`Returning ${users.length} users`);
    res.json({ count: users.length, users });
  } catch (error) {
    logger.error('Error in getAllUsers:', error.message);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createUser,
  getAllUsers
};
