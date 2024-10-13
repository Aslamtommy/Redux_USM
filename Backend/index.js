const express = require('express');
const cors = require('cors')
require('dotenv').config();

const app = express()
const userRoute = require('./Router/userRouter');
const mongoDb = require('./config/mongoDb');

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static('uploads'));

app.use('/', userRoute);

const startServer = async () => {
    await mongoDb()
    app.listen(3000, () => {
        console.log('Server running on port 3000');
    });
};

startServer().catch(err => {
    console.error('Failed to start server:', err);
});
