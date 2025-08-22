
require('dotenv').config();
const mongoose = require('mongoose');

const connectionToDB = async() =>{
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Successfully connected to MongoDB.');

    }catch(error){
        console.log('MongoDB connection failed with error!!', error);
        //Used when something went wrong and the program can't continue. It signals to the operating system or a parent process that an unhandled error occurred.
        process.exit(1)

    }
}

module.exports = connectionToDB