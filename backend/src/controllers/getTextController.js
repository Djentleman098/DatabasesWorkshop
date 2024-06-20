const getTextService = require('../services/getTextService');

exports.getText = async (req, res) => {
    const { textId } = req.body;
    
    try {
        const result = await getTextService.fetchGetText(textId);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error fetching text: ", error);
        res.status(500).send('Internal Server Error');
    }
};