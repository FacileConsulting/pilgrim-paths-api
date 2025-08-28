const express = require('express');
const router = express.Router();
const packagesController = require('../controllers/packages');

router.post('/', packagesController.packages);

module.exports = router;
