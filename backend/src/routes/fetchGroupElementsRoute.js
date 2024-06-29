const express = require('express');
const router = express.Router();
const fetchGroupElementsController = require('../controllers/fetchGroupElementsController');

router.post('/fetchGroupElements', fetchGroupElementsController.fetchGroupElements);

module.exports = router;