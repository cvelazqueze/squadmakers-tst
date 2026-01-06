const dbService = require('../services/dbService');
const logger = require('../config/logger');

/**
 * GET /consultas/manolito - Get all jokes by Manolito
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
 * GET /consultas/humor-negro - Get all jokes of theme "humor negro"
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
 * GET /consultas/manolito/humor-negro - Get jokes by Manolito and theme "humor negro"
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
  getJokesByManolito,
  getJokesByHumorNegro,
  getJokesByManolitoAndHumorNegro
};
