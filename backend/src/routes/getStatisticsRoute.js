const express = require('express');
const router = express.Router();
const getStatisticsController = require('../controllers/getStatisticsController');

router.post('/getStatistics', getStatisticsController.getStatistics);

module.exports = router;