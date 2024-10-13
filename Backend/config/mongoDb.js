const mongoose = require('mongoose');

const mongoDb = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB successfully');
    } catch (error) {
        console.error('Error in MongoDB connection:', error);
    }
};

module.exports = mongoDb;
