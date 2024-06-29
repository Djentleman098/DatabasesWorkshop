const db = require('../dbConfig');
const fs = require('fs').promises;
const path = require('path');
const xmlbuilder = require('xmlbuilder');

exports.dataBackup = async () => {
    let connection;
    let result = [];

    try {
        connection = await db.getConnection();

        // fetch all the tables in the DB
        const tables = await connection.execute(`SELECT TABLE_NAME FROM ALL_TABLES WHERE OWNER = 'DBWS'`);

        // XML builder instance
        const xmlRoot = xmlbuilder.create('oracleDB');

        // iterate over all the tables
        for (let table of tables.rows){
            const tableName = table[0];

            // fetch all rows from the current table
            const query = `SELECT * FROM ${tableName}`;
            const result = await connection.execute(query);

            // save the column names
            const columns = [];
            for (let columnName of result.metaData){
                columns.push(columnName.name);
            }

            // XML structure for the current table
            // create the table element
            const tableElement = xmlRoot.ele('table', { name: tableName });
            // create the columns
            const columnsElement = tableElement.ele('columns');
            for (let i = 0; i < result.metaData.length; i++){
                if (i === 0){
                    // add also primary key property
                    columnsElement.ele('column', {
                        name: result.metaData[i].name,
                        type: result.metaData[i].dbTypeName,
                        nullable: result.metaData[i].nullable ? 'true' : 'false',
                        primaryKey: 'true'
                    });
                } else {
                    columnsElement.ele('column', {
                        name: result.metaData[i].name,
                        type: result.metaData[i].dbTypeName,
                        nullable: result.metaData[i].nullable ? 'true' : 'false',
                    });
                }
            }
            // add the rows
            const rowsElement = tableElement.ele('rows');
            result.rows.forEach(row => {
                // create the row element
                const rowElement = rowsElement.ele('row');
                for (let i = 0; i < row.length; i++){
                    rowElement.ele(columns[i], {}, row[i])
                }
            });
        }

        const xmlString = xmlRoot.end({ pretty: true });

        return xmlString;
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