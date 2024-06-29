const express = require('express');
const router = express.Router();
const removeGroupElementController = require('../controllers/removeGroupElementController');

router.post('/removeGroupElement', removeGroupElementController.removeGroupElement);

module.exports = router;