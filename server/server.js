// Getting the objects for express server and mongoose ODM
const express = require('express');
const mongoose = require('mongoose');
// Getting CORS to allow different servers to interact
const cors = require('cors');
const swaggerUI = require('swagger-ui-express');
// The swagger json schema
const swaggerJson = require('./swagger.json');
const config = require('./config');

// Initializing  express app
const app = express();
if (process.env.NODE_ENV === 'production') {
    // Swagger app will use same app but different route in production
    console.info('Swagger started in production');
    swaggerJson.host = config.SWAGGER_HOST;
    app.use('/swagger-ui', swaggerUI.serve, swaggerUI.setup(swaggerJson));
} else {
    // Swagger app runs as separate app on a different port locally and in docker
    const swaggerApp = express();
    swaggerApp.use('/swagger-ui', swaggerUI.serve, swaggerUI.setup(swaggerJson));
    swaggerApp.use(cors());
    swaggerApp.listen(8080, () => {
        console.log('Swagger up and running on ' + 8080)
    });

}

// Enabling CORS
app.use(cors());

// Connecting database
// process.env.MONGO_URI is used in docker and heroku while config.MONGO_URI is used in local development
mongoose.connect(process.env.MONGO_URI || config.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
})

const db = mongoose.connection;
db.on('error', (err) => {
    console.error(err);
})

db.once('open', () => console.log('Connected to Database'));

// Middlewares for encoding urls and enabling only json body
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

// Adding the routes
const postMiddleware = require('./routes/Post');
app.use(postMiddleware);

// Route for invalid requests
app.all('*', function (req, res) {
    res.status(404).json({
        messsage: 'Undefined path'
    });
});

// App listening on specified port
// Again process.env.PORT is specified in HEROKu and docker and config.SERVER_PORT in local development
app.listen(process.env.PORT || config.SERVER_PORT, () => console.log('Server started on port ' + (process.env.PORT || config.SERVER_PORT)));
