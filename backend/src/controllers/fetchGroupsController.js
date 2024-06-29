const fetchGroupsService = require('../services/fetchGroupsService');

exports.fetchGroups = async (req, res) => {

    try {
        const result = await fetchGroupsService.fetchGroups();
        res.status(200).json(result);
    } catch (error) {
        console.error("Error fetching groups: ", error);
        res.status(500).send(error);
    }
};