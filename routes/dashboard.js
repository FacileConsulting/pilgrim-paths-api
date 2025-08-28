const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard');

router.post('/', dashboardController.dashboard);

module.exports = router;
