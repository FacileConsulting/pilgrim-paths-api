const express = require('express');
const router = express.Router();
const inquiriesController = require('../controllers/inquiries');

router.post('/', inquiriesController.inquiries);

module.exports = router;
