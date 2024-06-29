const express = require('express');
const router = express.Router();
const editGroupController = require('../controllers/editGroupController');

router.post('/editGroup', editGroupController.editGroup);

module.exports = router;