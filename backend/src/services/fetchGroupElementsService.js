const db = require('../dbConfig');
const fs = require('fs').promises;
const path = require('path');

exports.fetchGroupElements = async (id) => {
    let connection;
    let result = [];

    try {
        connection = await db.getConnection();

        // execute procedure to fetch groups
        const filePath = path.join(__dirname, '../queries/fetchWordGroupElements.sql');

        const fileRead = await fs.readFile(filePath, 'utf-8');
        const queryExecute = await connection.execute(fileRead, { id: id }, { outFormat: db.OBJECT });

        // return the values
        if (queryExecute.rows.length > 0) {
            queryExecute.rows.forEach(row => {
                result.push({
                    ID: row[0],
                    ELEMENT: row[1],
                    INDEX: row[2]
                });
            });
        } else {
            throw new Error('No elements found in the group');
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
