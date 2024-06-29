const db = require('../dbConfig');
const fs = require('fs').promises;
const path = require('path');

exports.fetchGetFullText = async (textId) => {
    let connection;
    let result = {};

    try {
        connection = await db.getConnection();

        // Get the SQL query from the file
        const filePath = path.join(__dirname, '../queries/fetchFullText.sql');
        const fileRead = await fs.readFile(filePath, 'utf-8');
        // Execute the query with the textId as a bind parameter
        const queryExecute = await connection.execute(fileRead, { textId: textId }, { outFormat: db.OBJECT });
        const row = queryExecute.rows[0];

        if (row) {
            result.TEXT_ID = row[0];
            result.TEXT_DATA = row[1];
        } else {
            throw new Error('No text found with the provided textId');
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
