const express = require('express');
const router = express.Router();
const mathController = require('../controllers/mathController');

// GET /matematico?numbers=1,2,3 - Calculate LCM
// GET /matematico?number=5 - Add 1 to number
router.get('/', (req, res) => {
  if (req.query.numbers) {
    mathController.calculateLCM(req, res);
  } else if (req.query.number) {
    mathController.addOne(req, res);
  } else {
    res.status(400).json({ 
      error: 'Query parameter "numbers" or "number" is required' 
    });
  }
});

module.exports = router;
