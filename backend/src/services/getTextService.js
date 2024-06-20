const db = require('../dbConfig');
const fs = require('fs').promises;
const path = require('path');
const flatted = require('flatted');

exports.fetchGetText = async (textId) => {
    let connection;
    let result = {};

    try {
        connection = await db.getConnection();

        // get the text from the db
        const filePath = path.join(__dirname, '../queries/textFullData.sql');
        let fileRead = await fs.readFile(filePath, 'utf-8');
        fileRead = fileRead.replace(':variable', textId);
        const queryExecute = await connection.execute(fileRead);
        const colNames = queryExecute.metaData.map(col => col.name);
        let curKey, curValues;
        for (let i = 0; i < colNames.length; i++) {
            curKey = colNames[i];
            curValues = [];
            for (let j = 0; j < queryExecute.rows.length; j++) {
                curValues.push(queryExecute.rows[j][i]);
            }
            result[curKey] = curValues;
        };

        return result;
    } catch (error) {
        throw error;
    } finally {
        if (connection){
            try {
                await connection.close();
                console.log('Closed connection');
            } catch (error) {
                console.error('Error closing connection: ', error);
            }
        }
    }
};