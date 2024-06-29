const getTextIndexService = require('../services/getTextIndexService');

exports.getTextIndex = async (req, res) => {
    const { textId, type, x, y } = req.body;

    try {
        const result = await getTextIndexService.fetchGetTextIndex(textId,type, x, y);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error fetching text: ", error);
        res.status(500).send('Internal Server Error');
    }
};