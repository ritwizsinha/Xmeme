const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const swaggerUI = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const SERVER_URL="http://localhost:8081"
const SWAGGER_URL="http://localhost:8080"
const DATABASE_URL="mongodb://localhost:27017"
const SWAGGER_PORT = 8080
const PORT=8081

const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'XMeme API',
            version: '1.0.0'
        },
        servers: ['http://localhost:8081'],
        host: 'localhost:8081',
    },
    apis: ['./routes/Post.js', './routes/Like.js'],
};
swaggerDocument = swaggerJSDoc(swaggerOptions);
console.log(JSON.stringify(swaggerDocument, null, 2));
const app = express();
const swaggerApp = express();

swaggerApp.use('/swagger-ui', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
// const corsOptions = {
//     origin: 'http://localhost:3000',
//     credentials:true,            //access-control-allow-credentials:true
//     optionSuccessStatus:200
// };
app.use(cors());
swaggerApp.use(cors());
require('dotenv').config();
mongoose.connect(DATABASE_URL, {
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

swaggerApp.listen(process.env.SWAGGER_PORT, () => {
    console.log('Swagger up and running on '+ process.env.SWAGGER_PORT)
});
app.listen(process.env.PORT, () => console.log('Server started'));
