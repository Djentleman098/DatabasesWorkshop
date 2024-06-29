const express = require('express');
const router = express.Router();
const fetchGroupsController = require('../controllers/fetchGroupsController');

router.post('/fetchGroups', fetchGroupsController.fetchGroups);

module.exports = router;