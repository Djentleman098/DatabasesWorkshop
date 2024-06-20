const express = require('express');
const router = express.Router();
const getWordsController = require('../controllers/getWordsController');

router.post('/getWords', getWordsController.getWords);

module.exports = router;