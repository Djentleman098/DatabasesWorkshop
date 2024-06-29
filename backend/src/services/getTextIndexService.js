const db = require('../dbConfig');
const fs = require('fs').promises;
const path = require('path');

exports.fetchGetTextIndex = async (textId,type, x, y) => {
    let connection;
    let result = {};

    try {
        connection = await db.getConnection();
        // Get the SQL query from the file
        let filePath;
        if (type === 'R&C')
            filePath = path.join(__dirname, '../queries/rowColumnHighlight.sql');
        else
            filePath = path.join(__dirname, '../queries/paragraphLineHighlight.sql'); 
        const fileRead = await fs.readFile(filePath, 'utf-8');
        // Execute the query with the bind parameters
        const queryExecute = await connection.execute(fileRead, { textId: textId, varX: x, varY: y }, { outFormat: db.OBJECT });
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
