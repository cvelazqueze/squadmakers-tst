const express = require('express');
const router = express.Router();
const queryController = require('../controllers/queryController');

// GET /consultas?user_name=Manolito - All jokes by a specific user
// GET /consultas?theme_name=humor negro - All jokes of a specific theme
// GET /consultas?user_name=Manolito&theme_name=humor negro - Jokes by user and theme
router.get('/', queryController.getJokesByQuery);

module.exports = router;
