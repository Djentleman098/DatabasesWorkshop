const express = require('express');
const router = express.Router();
const getSearchTextController = require('../controllers/searchTextController');

router.post('/searchText', getSearchTextController.getSearchText);

module.exports = router;