const express = require('express');
const router = express.Router();
const getFullTextController = require('../controllers/getFullTextController');

router.post('/getFullText', getFullTextController.getFullText);

module.exports = router;