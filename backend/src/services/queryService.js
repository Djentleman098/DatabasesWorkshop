const db = require('../dbConfig');

exports.fetchQuery = async (query) => {
    let connection;

    try {
        connection = await db.getConnection();
        const result = await db.executeQuery(connection, query);
        return result;
    } catch (error) {
        //console.error('Error executing query: ', error);
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