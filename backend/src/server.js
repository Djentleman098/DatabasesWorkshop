const express = require('express');
const app = express();
const cors = require('cors');
const corsOptions ={
    origin:'http://localhost:3000',
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
const db  = require('./dbConfig');
const query = require('./routes/queryRoute');
// more routes

//Initialize db connection pool
db.initializeDatabase();

app.use(cors(corsOptions));
//Use routes to handle backend actions
app.use('/api', query);
// more routes

//Close db connection pool
process.on('SIGINT', async () => {
    await db.closeDatabase();
    process.exit();
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log('Server is running on port ', PORT);
});
