const getInsertFileService = require('../services/insertFileService');

exports.getInsertFile = async (req, res) => {

    const { textType, metadata } = req.body;
    const file = req.file;

    try {
        const result = await getInsertFileService.fetchInsertFile(textType, metadata, file);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error fetching table: ", error);
        res.status(500).send('Internal Server Error');
    }
};