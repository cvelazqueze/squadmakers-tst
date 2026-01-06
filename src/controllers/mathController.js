const mathService = require('../services/mathService');
const logger = require('../config/logger');

/**
 * GET /matematico?numbers=1,2,3 - Calculate LCM
 */
const calculateLCM = (req, res) => {
  try {
    const { numbers } = req.query;
    
    if (!numbers) {
      return res.status(400).json({ error: 'Query parameter "numbers" is required' });
    }
    
    // Parse comma-separated numbers
    const numberArray = numbers.split(',').map(n => n.trim()).filter(n => n);
    
    if (numberArray.length === 0) {
      return res.status(400).json({ error: 'At least one number is required' });
    }
    
    const lcm = mathService.calculateLCM(numberArray);
    logger.info(`LCM calculated for [${numberArray.join(', ')}]: ${lcm}`);
    res.json({ numbers: numberArray, lcm });
  } catch (error) {
    logger.error('Error in calculateLCM:', error.message);
    res.status(400).json({ error: error.message });
  }
};

/**
 * GET /matematico?number=5 - Add 1 to number
 */
const addOne = (req, res) => {
  try {
    const { number } = req.query;
    
    if (!number) {
      return res.status(400).json({ error: 'Query parameter "number" is required' });
    }
    
    const result = mathService.addOne(number);
    logger.info(`Add one to ${number}: ${result}`);
    res.json({ number: Number(number), result });
  } catch (error) {
    logger.error('Error in addOne:', error.message);
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  calculateLCM,
  addOne
};
