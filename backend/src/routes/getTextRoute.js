const express = require('express');
const router = express.Router();
const getTextController = require('../controllers/getTextController');

router.post('/getText', getTextController.getText);

module.exports = router;