const getRetrieveTableService = require('../services/retrieveTableService');

exports.getRetrieveTable = async (req, res) => {
    const { tableName, variable } = req.body;
    
    try {
        const result = await getRetrieveTableService.fetchRetrieveTable(tableName, variable);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error fetching table: ", error);
        res.status(500).send('Internal Server Error');
    }
};