const jokeService = require('../services/jokeService');
const dbService = require('../services/dbService');
const logger = require('../config/logger');

/**
 * GET /chistes - Get random joke or from specific source
 */
const getJoke = async (req, res) => {
  try {
    const { source } = req.params;
    
    if (!source) {
      // Random joke: choose randomly between Chuck and Dad
      const randomSource = Math.random() < 0.5 ? 'Chuck' : 'Dad';
      const joke = await jokeService.getRandomJoke(randomSource);
      logger.info(`Returning random joke from ${randomSource}`);
      return res.json({ joke, source: randomSource });
    }
    
    if (source !== 'Chuck' && source !== 'Dad') {
      return res.status(400).json({
        error: `Invalid source: ${source}. Must be 'Chuck' or 'Dad'`
      });
    }
    
    const joke = await jokeService.getRandomJoke(source);
    logger.info(`Returning joke from ${source}`);
    res.json({ joke, source });
  } catch (error) {
    logger.error('Error in getJoke:', error.message);
    res.status(500).json({ error: error.message });
  }
};

/**
 * POST /chistes - Save a joke to database
 */
const saveJoke = async (req, res) => {
  try {
    const { text, usuario, tematica } = req.body;
    
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Text parameter is required and must be a non-empty string' 
      });
    }
    
    if (!usuario || typeof usuario !== 'string' || usuario.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Usuario parameter is required and must be a non-empty string' 
      });
    }
    
    if (!tematica || typeof tematica !== 'string' || tematica.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Tematica parameter is required and must be a non-empty string' 
      });
    }
    
    const result = await dbService.saveJoke(text.trim(), usuario.trim(), tematica.trim());
    logger.info(`Joke saved with ID: ${result.id} by user "${usuario}" with theme "${tematica}"`);
    res.status(201).json(result);
  } catch (error) {
    logger.error('Error in saveJoke:', error.message);
    res.status(500).json({ error: error.message });
  }
};

/**
 * PUT /chistes/:number - Update a joke
 */
const updateJoke = async (req, res) => {
  try {
    const { number } = req.params;
    const { text } = req.body;
    
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({ error: 'Text parameter is required and must be a non-empty string' });
    }
    
    const id = parseInt(number);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ error: 'Number parameter must be a positive integer' });
    }
    
    const result = await dbService.updateJoke(id, text.trim());
    logger.info(`Joke ${id} updated`);
    res.json(result);
  } catch (error) {
    logger.error('Error in updateJoke:', error.message);
    if (error.message.includes('not found')) {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

/**
 * DELETE /chistes/:number - Delete a joke
 */
const deleteJoke = async (req, res) => {
  try {
    const { number } = req.params;
    
    const id = parseInt(number);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ error: 'Number parameter must be a positive integer' });
    }
    
    const result = await dbService.deleteJoke(id);
    logger.info(`Joke ${id} deleted`);
    res.json(result);
  } catch (error) {
    logger.error('Error in deleteJoke:', error.message);
    if (error.message.includes('not found')) {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

/**
 * GET /chistes/emparejados - Get paired jokes
 */
const getPairedJokes = async (req, res) => {
  try {
    const pairedJokes = await jokeService.getPairedJokes();
    logger.info(`Returning ${pairedJokes.length} paired jokes`);
    res.json(pairedJokes);
  } catch (error) {
    logger.error('Error in getPairedJokes:', error.message);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getJoke,
  saveJoke,
  updateJoke,
  deleteJoke,
  getPairedJokes
};
