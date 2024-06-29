const oracledb = require('oracledb');
const db = require('../dbConfig');

exports.fetchRemoveGroupElement = async (type, id, element) => {
    let connection;
    let result = {};

    try {
        connection = await db.getConnection();

        // bind parameters
        let bindParams;
        if (type === 'Words') {
            bindParams = {
                p_id: { dir: oracledb.BIND_IN, type: oracledb.NUMBER, val: id },
                p_elementId: { dir: oracledb.BIND_IN, type: oracledb.NUMBER, val: element },
            }
        } else {
            bindParams = {
                p_element: { dir: oracledb.BIND_IN, type: oracledb.VARCHAR2, val: element },
            }
        }

        // execute procedure to remove the element
        if (type === 'Words') {
            result = await connection.execute(
                `BEGIN
                    WORD_DELETE(:p_id, :p_elementId);
                END;`,
                bindParams,
                { autoCommit: true }
            );
        } else {
            result = await connection.execute(
                `BEGIN
                    EXPRESSION_DELETE(:p_element);
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
