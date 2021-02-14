const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const swaggerUI = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerJson = require('./swagger.json');
const config = require('./config');

// console.log(config);
// const swaggerOptions = {
//     swaggerDefinition: {
//         info: {
//             title: 'XMeme API',
//             version: '1.0.0'
//         },
//         servers: ['http://localhost:8081'],
//         host: 'localhost:8081',
//     },
//     apis: ['./routes/Post.js', './routes/Like.js'],
// };


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

// const corsOptions = {
//     origin: 'http://localhost:3000',
//     credentials:true,            //access-control-allow-credentials:true
//     optionSuccessStatus:200
// };
app.use(cors());

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

app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());
const postMiddleware = require('./routes/Post');
app.use(postMiddleware);
app.get('*', function (req, res) {
    res.status(404).json({
        messsage: 'Undefined path'
    });
});

app.listen(process.env.PORT || config.SERVER_PORT, () => console.log('Server started on port ' + (process.env.PORT || config.SERVER_PORT)));
