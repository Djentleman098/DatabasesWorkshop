const addGroupElementService = require('../services/addGroupElementService');

exports.addGroupElement = async (req, res) => {
    const { type, id, element } = req.body;

    try {
        const result = await addGroupElementService.fetchAddGroupElement(type, id, element);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error creating group element: ", error);
        res.status(500).send(error);
    }
};