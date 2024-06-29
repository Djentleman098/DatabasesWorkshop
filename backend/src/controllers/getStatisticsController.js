const getStatisticsService = require('../services/getStatisticsService');

exports.getStatistics = async (req, res) => {
    const { id } = req.body;

    try {
        const result = await getStatisticsService.fetchGetStatistics(id);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error fetching statistics: ", error);
        res.status(500).send('Internal Server Error');
    }
};