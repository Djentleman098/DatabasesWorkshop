const editGroupService = require('../services/editGroupService');

exports.editGroup = async (req, res) => {
    const { id, action, name } = req.body;

    try {
        const result = await editGroupService.fetchEditGroup(id, action, name);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error editing group: ", error);
        res.status(500).send(error);
    }
};