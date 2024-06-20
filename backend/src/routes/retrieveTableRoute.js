const express = require('express');
const router = express.Router();
const getRetrieveTableController = require('../controllers/retrieveTableController');

router.post('/retrieveTable', getRetrieveTableController.getRetrieveTable);

module.exports = router;