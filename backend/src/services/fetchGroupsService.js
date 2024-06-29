const db = require('../dbConfig');
const fs = require('fs').promises;
const path = require('path');

exports.fetchGroups = async () => {
    let connection;
    let result = [];

    try {
        connection = await db.getConnection();

        // execute procedure to fetch groups
        const filePath = path.join(__dirname, '../queries/fetchWordGroups.sql');

        const fileRead = await fs.readFile(filePath, 'utf-8');
        const queryExecute = await connection.execute(fileRead);

        // return the values
        if (queryExecute.rows) {
            queryExecute.rows.forEach(row => {
                result.push({
                    ID: row[0],
                    NAME: row[1],
                    COUNT: row[2]
                });
            });
        } else {
            throw new Error('No Groups found');
        }

        return result;
    } catch (error) {
        throw error;
    } finally {
        if (connection) {
            try {
                await connection.close();
                console.log('Closed connection');
            } catch (error) {
                console.error('Error closing connection: ', error);
            }
        }
    }
};
