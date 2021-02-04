const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

const db = mongoose.connection;
db.on('error', (err) => {
    console.error(err);
})

db.once('open', () => console.log('Connected to Database'));

app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());
const postMiddleware = require('./routes/Post');
app.use(postMiddleware);

app.listen(process.env.PORT, () => console.log('Server started'));
