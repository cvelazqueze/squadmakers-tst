const express = require('express');
const router = express.Router();
const queryController = require('../controllers/queryController');

// GET /consultas/manolito - All jokes by Manolito
router.get('/manolito', queryController.getJokesByManolito);

// GET /consultas/humor-negro - All jokes of theme "humor negro"
router.get('/humor-negro', queryController.getJokesByHumorNegro);

// GET /consultas/manolito/humor-negro - Jokes by Manolito and theme "humor negro"
router.get('/manolito/humor-negro', queryController.getJokesByManolitoAndHumorNegro);

module.exports = router;
