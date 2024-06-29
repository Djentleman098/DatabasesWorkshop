const db = require('../dbConfig');
const fs = require('fs').promises;
const path = require('path');

exports.fetchGetStatistics = async (id) => {
    let connection;
    let result = {};

    try {
        connection = await db.getConnection();

        // Get the SQL query from the file
        const filePath = path.join(__dirname, '../queries/statistics.sql');
        const fileRead = await fs.readFile(filePath, 'utf-8');
        // Execute the query with the textId as a bind parameter
        const queryExecute = await connection.execute(fileRead, { id: id });
        const row = queryExecute.rows[0];

        if (row) {
            result.ID = row[0];
            result.WORD = row[1];
            result.WORD_COUNT = row[7];
            result.TOP_WORD = row[8];
            result.AVG_ROW = row[9];
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
