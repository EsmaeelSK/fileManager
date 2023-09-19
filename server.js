const express = require('express');
const dotenv = require('dotenv');

const connectToDB = require('./configs/db');
const fileManagerRouter = require('./routes/fileManager');

const setHeader = require('./middlewares/header');
const errorHandler = require('./middlewares/error');

dotenv.config({path: './configs/config.env'});
connectToDB();

const app = express();

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(setHeader);

app.use('/api/user/fileManager', fileManagerRouter)

app.use(errorHandler);

app.listen(process.env.PORT, err =>{
    if(err) console.log(err);
    else console.log("server is running...")
}); 