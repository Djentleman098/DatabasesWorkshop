const express = require('express');
const router = express.Router();
const createGroupController = require('../controllers/createGroupController');

router.post('/createGroup', createGroupController.createGroup);

module.exports = router;