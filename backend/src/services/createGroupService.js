const oracledb = require('oracledb');
const db = require('../dbConfig');

exports.fetchCreateGroup = async (name) => {
    let connection;
    let result = {};

    try {
        connection = await db.getConnection();

        // bind parameters
        const bindParams = {
            p_name: { dir: oracledb.BIND_IN, type: oracledb.VARCHAR2, val: name },
        };

        // execute procedure to save the group in the db
        result = await connection.execute(
            `BEGIN
                WORDS_GROUP_CREATE(:p_name);
            END;`,
            bindParams,
            { autoCommit: true }
        );

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
