const mongoose = require('mongoose');

const connectToDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_LOCALHOST);
        console.log('connected to fileManager_db.');
    } catch (err) {
        console.log('faild to connect to the database: \n', err);
    }
}

module.exports = connectToDB;