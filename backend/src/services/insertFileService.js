const oracledb = require('oracledb');
const db = require('../dbConfig');
const fs = require('fs');

exports.fetchInsertFile = async (textType, metadata, file) => {
    let connection;
    let result;

    try {
        connection = await db.getConnection();

        // Read the file content and convert it to a Buffer
        const fileContent = fs.readFileSync(file.path);

        // bind parameters
        const bindParams = {
            p_textType: { dir: oracledb.BIND_IN, type: oracledb.NUMBER, val: parseInt(textType) },
            p_file: { dir: oracledb.BIND_IN, type: oracledb.BUFFER, val: fileContent },
            p_textId: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
        };

        // execute procedure to save the text type and blob in the db
        result = await connection.execute(
            `BEGIN
                TEXT_CREATE(:p_textType, :p_file, :p_textId);
            END;`,
            bindParams,
            { autoCommit: true }
        );

        // get the text id
        const textId = result.outBinds.p_textId;

        // save the metadata with the textId
        metadata = JSON.parse(metadata); // the json was sent with stringify
        // go over all the metadata values and save in the db
        for (let i = 0; i < Object.keys(metadata).length; i++) {
            // bind parameters
            const metadataParams = {
                p_textId: { dir: oracledb.BIND_IN, type: oracledb.NUMBER, val: textId },
                p_metadataOption: { dir: oracledb.BIND_IN, type: oracledb.VARCHAR2, val: Object.keys(metadata)[i] },
                p_metadataValue: { dir: oracledb.BIND_IN, type: oracledb.VARCHAR2, val: Object.values(metadata)[i] }
            };
            // execute procedure
            result = await connection.execute(
                `BEGIN
                    METADATA_CREATE(:p_textId, :p_metadataOption, :p_metadataValue);
                END;`,
                metadataParams,
                { autoCommit: true }
            );
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