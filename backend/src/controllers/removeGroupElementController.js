const removeGroupElementService = require('../services/removeGroupElementService');

exports.removeGroupElement = async (req, res) => {
    const { type, id, element } = req.body;

    try {
        const result = await removeGroupElementService.fetchRemoveGroupElement(type, id, element);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error removing group element: ", error);
        res.status(500).send(error);
    }
};