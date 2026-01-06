const express = require('express');
const router = express.Router();
const themeController = require('../controllers/themeController');

// GET /tematicas - Get all themes
router.get('/', themeController.getAllThemes);

// POST /tematicas - Create a theme
router.post('/', themeController.createTheme);

module.exports = router;
