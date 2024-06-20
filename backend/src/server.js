const express = require('express');
const app = express();
const cors = require('cors');
const corsOptions ={
    origin:'http://localhost:3000',
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
const db  = require('./dbConfig');
const retrieveTable = require('./routes/retrieveTableRoute');
const insertFile = require('./routes/insertFileRoute');
const searchText = require('./routes/searchTextRoute');
const getText = require('./routes/getTextRoute');
const getWords = require('./routes/getWordsRoute');
// ...more routes

//Initialize db connection pool
db.initializeDatabase();

app.use(cors(corsOptions));
app.use(express.json());
//Use routes to handle backend actions
app.use('/api', retrieveTable);
app.use('/api', insertFile);
app.use('/api', searchText);
app.use('/api', getText);
app.use('/api', getWords);
// ...more routes

//Close db connection pool
process.on('SIGINT', async () => {
    await db.closeDatabase();
    process.exit();
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log('Server is running on port ', PORT);
});
