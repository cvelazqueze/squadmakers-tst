const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// GET /usuarios - Get all users
router.get('/', userController.getAllUsers);

// POST /usuarios - Create a user
router.post('/', userController.createUser);

module.exports = router;
