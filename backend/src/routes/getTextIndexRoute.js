const express = require('express');
const router = express.Router();
const getTextIndexController = require('../controllers/getTextIndexController');

router.post('/getTextIndex', getTextIndexController.getTextIndex);

module.exports = router;