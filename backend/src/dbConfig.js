// Information about the database connection
const oracledb = require('oracledb');
const dbConfig = {
    user: 'dbws',
    password: 'tantan123457',
    connectString: 'localhost:1521/xe'
};

//Opens a connection pool - used once in the server file
const initializeDatabase = async () => {
    try {
        await oracledb.createPool(dbConfig);
        console.log('Database connection pool created successfully');
    } catch (error) {
        console.error('Error creating database connection pool: ', error);
    }
};

//Opens a connection - used in every service we need to access the db
const getConnection = async () => {
    try {
        const connection = await oracledb.getConnection(dbConfig);
        console.log('Connected to Oracle Database');
        return connection;
    } catch (error) {
        console.error('Error connecting to Oracle Database:', error.message);
        throw error;
    }
}

//Closes the connection pool - used once in the server file
const closeDatabase = async () => {
    try {
        await oracledb.getPool().close(10);
        console.log('Database connection pool closed successfully');
    } catch (error) {
        console.error('Error closing database connection pool: ', error);
    }
};

//Executes a query on the db. Requires a connection and a query string
const executeQuery = async (connection, query, binds = [], options = {}) => {
    try {
        const result = await connection.execute(query, binds, options);
        console.log('Executed query');
        return result.rows;
    } catch (error) {
        console.error('Error executing query:', error.message);
        throw error;
    } 
};

module.exports = {
    initializeDatabase,
    getConnection,
    closeDatabase,
    executeQuery,
}