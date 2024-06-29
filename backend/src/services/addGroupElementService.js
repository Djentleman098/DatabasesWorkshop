const oracledb = require('oracledb');
const db = require('../dbConfig');

exports.fetchAddGroupElement = async (type, id, element) => {
    let connection;
    let result = {};

    try {
        connection = await db.getConnection();

        // bind parameters
        let bindParams;
        if (type === 'Words') {
            bindParams = {
                p_id: { dir: oracledb.BIND_IN, type: oracledb.NUMBER, val: id },
                p_element: { dir: oracledb.BIND_IN, type: oracledb.VARCHAR2, val: element },
            }
        } else {
            bindParams = {
                p_element: { dir: oracledb.BIND_IN, type: oracledb.VARCHAR2, val: element },
            }
        }

        // execute procedure to save the group in the db
        if (type === 'Words') {
            result = await connection.execute(
                `BEGIN
                    WORD_CREATE(:p_id, :p_element);
                END;`,
                bindParams,
                { autoCommit: true }
            );
        } else {
            result = await connection.execute(
                `BEGIN
                    EXPRESSION_CREATE(:p_element);
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
