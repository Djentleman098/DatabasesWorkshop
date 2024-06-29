const express = require('express');
const router = express.Router();
const dataBackupController = require('../controllers/dataBackupController');

router.post('/dataBackup', dataBackupController.dataBackup);

module.exports = router;