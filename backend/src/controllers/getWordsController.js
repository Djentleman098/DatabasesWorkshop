const getWordsService = require('../services/getWordsService');

exports.getWords = async (req, res) => {
    const { textIds } = req.body;
    
    try {
        const result = await getWordsService.fetchGetWords(textIds);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error fetching words: ", error);
        res.status(500).send('Internal Server Error');
    }
};