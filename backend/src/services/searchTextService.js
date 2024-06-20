const db = require('../dbConfig');
const fs = require('fs').promises;
const path = require('path');

exports.fetchSearchText = async (variable, text) => {
    let connection;
    let filePath = null;
    let fileRead, queryExecute, curKey = 'TEXT_ID', curValues = [];
    let result = {};

    try {
        connection = await db.getConnection();

        // search the text in the db based on the search type selected
        if (variable === 'Texts' || variable === 'All'){
            // search in texts
            filePath = path.join(__dirname, '../queries/textSearch.sql');
            fileRead = await fs.readFile(filePath, 'utf-8');
            fileRead = fileRead.replace(':variable', "'"+text+"'");
            queryExecute = await connection.execute(fileRead);
            colNames = queryExecute.metaData.map(col => col.name);
            for (let j = 0; j < queryExecute.rows.length; j++) {
                curValues.push(queryExecute.rows[j]);
            }
        };
        if (variable === 'Metadata' || variable === 'All') {
            // search in metadata
            filePath = path.join(__dirname, '../queries/metadataSearch.sql');
            fileRead = await fs.readFile(filePath, 'utf-8');
            fileRead = fileRead.replace(':variable', "'"+text+"'");
            queryExecute = await connection.execute(fileRead);
            colNames = queryExecute.metaData.map(col => col.name);
            for (let j = 0; j < queryExecute.rows.length; j++) {
                curValues.push(queryExecute.rows[j]);
            }
        };
        if (variable === 'Full') {
            // search in metadata
            filePath = path.join(__dirname, '../queries/fetchAllTexts.sql');
            fileRead = await fs.readFile(filePath, 'utf-8');
            queryExecute = await connection.execute(fileRead);
            colNames = queryExecute.metaData.map(col => col.name);
            for (let j = 0; j < queryExecute.rows.length; j++) {
                curValues.push(queryExecute.rows[j]);
            }
        };

        result[curKey] = curValues;

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