const db = require('../dbConfig');
const fs = require('fs').promises;
const path = require('path');

exports.fetchGetWords = async (textIds) => {
    let connection;
    let result = [];

    try {
        connection = await db.getConnection();

        // Flatten the array of text IDs
        const flatIds = textIds.flat();
        console.log(flatIds);

        // Read the SQL query
        const filePath = path.join(__dirname, '../queries/fetchAllWords.sql');
        let fileRead = await fs.readFile(filePath, 'utf-8');

        // Construct the IN clause with placeholders
        const placeholders = flatIds.map((i) => `${i}`).join(',');
        const queryWithPlaceholders = fileRead.replace('&id_list', placeholders);


        // Execute the query with the bind variables
        const queryResult = await connection.execute(queryWithPlaceholders);
        const resultSet = queryResult.rows;

        // Process the result set
        resultSet.forEach(row => {
            result.push({
                TEXT_ID: row[0],
                WORD: row[1],
                WORD_ROW: row[2],
                WORD_COLUMN: row[3]
            });
        });

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
