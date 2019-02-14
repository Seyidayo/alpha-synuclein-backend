const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const router = require('./routes');
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());

// CALL THE ROUTES FOLDER
app.use('/api', router);

// CONNECT THE MONGOOSE SERVER
mongoose.connect('mongodb://127.0.0.1:27017/alphadatabase', { useNewUrlParser: true});
const connection = mongoose.connection;

mongoose.Promise = global.Promise

// START THE MONGODB SERVER
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
})

// START THE SERVER
app.listen(PORT, () => {
    console.log('Server is running on PORT: ' + PORT);
});