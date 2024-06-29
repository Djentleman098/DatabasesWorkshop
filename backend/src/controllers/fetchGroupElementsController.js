const fetchGroupElementsService = require('../services/fetchGroupElementsService');

exports.fetchGroupElements = async (req, res) => {
    const { id } = req.body;

    try {
        const result = await fetchGroupElementsService.fetchGroupElements(id);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error creating group elements: ", error);
        res.status(500).send(error);
    }
};