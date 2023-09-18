const mongoose = require('mongoose');

const connectToDB = async () => {
    try {
        if (process.env.NODE_ENV === 'development') {
            await mongoose.connect(process.env.MONGO_LOCALHOST);
            console.log('connected to fileManager_db.');
        }

    } catch (err) {
        console.log('faild to connect to the database: \n', err);
    }
}

module.exports = connectToDB;