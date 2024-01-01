const getQueryService = require('../services/queryService');

exports.getQuery = async (req, res) => {
    const { query } = req.query;

    try {
        const result = await getQueryService.fetchQuery(query);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error fetching query: ", error);
        res.status(500).send('Internal Server Error');
    }
};