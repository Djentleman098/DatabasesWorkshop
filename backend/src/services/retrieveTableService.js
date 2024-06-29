const db = require('../dbConfig');
const fs = require('fs').promises;
const path = require('path');

exports.fetchRetrieveTable = async (tableName, variable) => {
    let connection;
    let filePath = null;
    let result = {};

    try {
        connection = await db.getConnection();
        switch (tableName) {
            case 'TextTypes':
                filePath = path.join(__dirname, '../queries/textTypes.sql');
                break;
            case 'MetadataOptions':
                filePath = path.join(__dirname, '../queries/metadataOptions.sql');
                break;
            case 'Expressions':
                filePath = path.join(__dirname, '../queries/fetchExpressions.sql');
                break;
            default:
                console.log('Invalid table name');
                break;
        };

        if (filePath != null){
            let fileRead = await fs.readFile(filePath, 'utf-8');
            if (variable){
                fileRead = fileRead.replace(':variable', variable);
            }
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
        }
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