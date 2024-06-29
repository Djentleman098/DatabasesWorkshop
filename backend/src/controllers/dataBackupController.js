const dataBackupService = require('../services/dataBackupService');

exports.dataBackup = async (req, res) => {

    try {
        const result = await dataBackupService.dataBackup();
        res.status(200).json(result);
    } catch (error) {
        console.error("Error doing backup: ", error);
        res.status(500).send(error);
    }
};