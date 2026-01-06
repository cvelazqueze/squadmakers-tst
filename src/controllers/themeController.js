const dbService = require('../services/dbService');
const logger = require('../config/logger');

/**
 * POST /tematicas - Create a theme
 */
const createTheme = async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Name parameter is required and must be a non-empty string' 
      });
    }
    
    const result = await dbService.createOrGetTheme(name.trim());
    logger.info(`Theme "${name}" ${result.created ? 'created' : 'already exists'}`);
    res.status(result.created ? 201 : 200).json(result);
  } catch (error) {
    logger.error('Error in createTheme:', error.message);
    res.status(500).json({ error: error.message });
  }
};

/**
 * GET /tematicas - Get all themes
 */
const getAllThemes = async (req, res) => {
  try {
    const themes = await dbService.getAllThemes();
    logger.info(`Returning ${themes.length} themes`);
    res.json({ count: themes.length, themes });
  } catch (error) {
    logger.error('Error in getAllThemes:', error.message);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createTheme,
  getAllThemes
};
