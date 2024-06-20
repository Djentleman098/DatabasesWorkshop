const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const getInsertFileController = require('../controllers/insertFileController');

router.post('/insertFile', upload.single('file'), getInsertFileController.getInsertFile);

module.exports = router;