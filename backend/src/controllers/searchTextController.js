const getSearchTextService = require('../services/searchTextService');

exports.getSearchText = async (req, res) => {
    const { variable, text } = req.body;
    
    try {
        const result = await getSearchTextService.fetchSearchText(variable, text);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error searching: ", error);
        res.status(500).send('Internal Server Error');
    }
};