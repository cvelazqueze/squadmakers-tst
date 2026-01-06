const axios = require('axios');
const logger = require('../config/logger');

const CHUCK_NORRIS_API = 'https://api.chucknorris.io/jokes/random';
const DAD_JOKE_API = 'https://icanhazdadjoke.com/';

/**
 * Get a random joke from Chuck Norris API
 */
const getChuckNorrisJoke = async () => {
  try {
    const response = await axios.get(CHUCK_NORRIS_API);
    return response.data.value;
  } catch (error) {
    logger.error('Error fetching Chuck Norris joke:', error.message);
    throw new Error('Failed to fetch Chuck Norris joke');
  }
};

/**
 * Get a random joke from Dad Jokes API
 */
const getDadJoke = async () => {
  try {
    const response = await axios.get(DAD_JOKE_API, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'SquadMakers Jokes API'
      }
    });
    return response.data.joke;
  } catch (error) {
    logger.error('Error fetching Dad joke:', error.message);
    throw new Error('Failed to fetch Dad joke');
  }
};

/**
 * Get a random joke from either API
 */
const getRandomJoke = async (source) => {
  if (source === 'Chuck') {
    return await getChuckNorrisJoke();
  } else if (source === 'Dad') {
    return await getDadJoke();
  } else {
    throw new Error(`Invalid source: ${source}. Must be 'Chuck' or 'Dad'`);
  }
};

/**
 * Get paired jokes: 5 from Chuck Norris and 5 from Dad Jokes
 */
const getPairedJokes = async () => {
  try {
    logger.info('Fetching paired jokes...');
    
    // Make 5 parallel requests to each API
    const chuckPromises = Array(5).fill().map(() => getChuckNorrisJoke());
    const dadPromises = Array(5).fill().map(() => getDadJoke());
    
    const [chuckJokes, dadJokes] = await Promise.all([
      Promise.all(chuckPromises),
      Promise.all(dadPromises)
    ]);
    
    logger.info(`Fetched ${chuckJokes.length} Chuck jokes and ${dadJokes.length} Dad jokes`);
    
    // Pair them 1-to-1 and create combined jokes
    const pairedJokes = chuckJokes.map((chuck, index) => {
      const dad = dadJokes[index];
      const combinado = `${chuck} Also, ${dad.toLowerCase()}`;
      
      return {
        chuck,
        dad,
        combinado
      };
    });
    
    logger.info('Successfully paired jokes');
    return pairedJokes;
  } catch (error) {
    logger.error('Error fetching paired jokes:', error.message);
    throw error;
  }
};

module.exports = {
  getChuckNorrisJoke,
  getDadJoke,
  getRandomJoke,
  getPairedJokes
};
