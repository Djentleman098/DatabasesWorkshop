const oracledb = require('oracledb');
const db = require('../dbConfig');

exports.fetchEditGroup = async (id, action, name) => {
    let connection;
    let result = {};

    try {
        connection = await db.getConnection();

        // bind parameters
        let bindParams;
        if (action === 'delete')
            bindParams = {
                p_id: { dir: oracledb.BIND_IN, type: oracledb.NUMBER, val: id }
            }
        else
            bindParams = {
                p_id: { dir: oracledb.BIND_IN, type: oracledb.NUMBER, val: id },
                p_name: { dir: oracledb.BIND_IN, type: oracledb.VARCHAR2, val: name }
            }

        // execute procedure to save the group in the db
        if (action === 'delete'){
            result = await connection.execute(
                `BEGIN
                    WORDS_GROUP_DELETE(:p_id);
                END;`,
                bindParams,
                { autoCommit: true }
            );
        } else {
            result = await connection.execute(
                `BEGIN
                    WORDS_GROUP_UPDATE(:p_id, :p_name);
                END;`,
                bindParams,
                { autoCommit: true }
            );
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
