const express = require('express');
const router = express.Router();
const jokeController = require('../controllers/jokeController');

// GET /chistes/emparejados - Get paired jokes
// This route must be defined before /:source to avoid matching "emparejados" as a source
router.get('/emparejados', jokeController.getPairedJokes);

// GET /chistes - Random joke
// GET /chistes/:source - Joke from specific source (Chuck or Dad)
router.get('/:source?', jokeController.getJoke);

// POST /chistes - Save joke
router.post('/', jokeController.saveJoke);

// PUT /chistes/:number - Update joke
router.put('/:number', jokeController.updateJoke);

// DELETE /chistes/:number - Delete joke
router.delete('/:number', jokeController.deleteJoke);

module.exports = router;
