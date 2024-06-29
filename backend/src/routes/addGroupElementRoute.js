const express = require('express');
const router = express.Router();
const addGroupElementController = require('../controllers/addGroupElementController');

router.post('/addGroupElement', addGroupElementController.addGroupElement);

module.exports = router;