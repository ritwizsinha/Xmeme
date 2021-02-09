const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
};
app.use(cors(corsOptions));
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
const likeMiddleware = require('./routes/Like');
app.use(postMiddleware);
app.use(likeMiddleware);

app.listen(process.env.PORT, () => console.log('Server started'));
