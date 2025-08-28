const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settings');

router.post('/', settingsController.settings);

module.exports = router;
