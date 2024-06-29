const getFullTextService = require('../services/getFullTextService');

exports.getFullText = async (req, res) => {
    const { textId } = req.body;

    try {
        const result = await getFullTextService.fetchGetFullText(textId);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error fetching text: ", error);
        res.status(500).send('Internal Server Error');
    }
};