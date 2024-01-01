const express = require('express');
const router = express.Router();
const getQueryController = require('../controllers/queryController');

router.get('/query', getQueryController.getQuery);

module.exports = router;