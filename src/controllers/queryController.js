const dbService = require('../services/dbService');
const logger = require('../config/logger');

/**
 * GET /consultas?user_name=...&theme_name=... - Get jokes by query parameters
 * Supports:
 * - ?user_name=Manolito - All jokes by a user
 * - ?theme_name=humor negro - All jokes of a theme
 * - ?user_name=Manolito&theme_name=humor negro - Jokes by user and theme
 */
const getJokesByQuery = async (req, res) => {
  try {
    const { user_name, theme_name } = req.query;
    
    // If both parameters are provided
    if (user_name && theme_name) {
      const jokes = await dbService.getJokesByUserAndTheme(user_name.trim(), theme_name.trim());
      logger.info(`Found ${jokes.length} jokes by user "${user_name}" of theme "${theme_name}"`);
      return res.json({ 
        user: user_name.trim(), 
        theme: theme_name.trim(), 
        count: jokes.length, 
        jokes 
      });
    }
    
    // If only user_name is provided
    if (user_name) {
      const jokes = await dbService.getJokesByUser(user_name.trim());
      logger.info(`Found ${jokes.length} jokes by user "${user_name}"`);
      return res.json({ 
        user: user_name.trim(), 
        count: jokes.length, 
        jokes 
      });
    }
    
    // If only theme_name is provided
    if (theme_name) {
      const jokes = await dbService.getJokesByTheme(theme_name.trim());
      logger.info(`Found ${jokes.length} jokes of theme "${theme_name}"`);
      return res.json({ 
        theme: theme_name.trim(), 
        count: jokes.length, 
        jokes 
      });
    }
    
    // If no parameters are provided
    return res.status(400).json({ 
      error: 'At least one query parameter is required: user_name or theme_name',
      example: '/consultas?user_name=Manolito or /consultas?theme_name=humor negro'
    });
  } catch (error) {
    logger.error('Error in getJokesByQuery:', error.message);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Legacy: GET /consultas/manolito - Get all jokes by Manolito
 * @deprecated Use /consultas?user_name=Manolito instead
 */
const getJokesByManolito = async (req, res) => {
  try {
    const jokes = await dbService.getJokesByUser('Manolito');
    logger.info(`Found ${jokes.length} jokes by Manolito`);
    res.json({ user: 'Manolito', count: jokes.length, jokes });
  } catch (error) {
    logger.error('Error in getJokesByManolito:', error.message);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Legacy: GET /consultas/humor-negro - Get all jokes of theme "humor negro"
 * @deprecated Use /consultas?theme_name=humor negro instead
 */
const getJokesByHumorNegro = async (req, res) => {
  try {
    const jokes = await dbService.getJokesByTheme('humor negro');
    logger.info(`Found ${jokes.length} jokes of theme "humor negro"`);
    res.json({ theme: 'humor negro', count: jokes.length, jokes });
  } catch (error) {
    logger.error('Error in getJokesByHumorNegro:', error.message);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Legacy: GET /consultas/manolito/humor-negro - Get jokes by Manolito and theme "humor negro"
 * @deprecated Use /consultas?user_name=Manolito&theme_name=humor negro instead
 */
const getJokesByManolitoAndHumorNegro = async (req, res) => {
  try {
    const jokes = await dbService.getJokesByUserAndTheme('Manolito', 'humor negro');
    logger.info(`Found ${jokes.length} jokes by Manolito of theme "humor negro"`);
    res.json({ user: 'Manolito', theme: 'humor negro', count: jokes.length, jokes });
  } catch (error) {
    logger.error('Error in getJokesByManolitoAndHumorNegro:', error.message);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getJokesByQuery,
  getJokesByManolito,
  getJokesByHumorNegro,
  getJokesByManolitoAndHumorNegro
};
