const createGroupService = require('../services/createGroupService');

exports.createGroup = async (req, res) => {
    const { name } = req.body;

    try {
        const result = await createGroupService.fetchCreateGroup(name);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error creating group: ", error);
        res.status(500).send(error);
    }
};