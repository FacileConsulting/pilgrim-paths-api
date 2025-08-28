const express = require('express');
const router = express.Router();
const providersController = require('../controllers/providers');

router.post('/', providersController.providers);

module.exports = router;
