const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config()


if(!process.env.MONGODB_URI) {
    throw new Error("please provide MONGODB_URI in the .env filw ");
}

async function connectDB() {
    try {
         await mongoose.connect(process.env.MONGODB_URI)
         console.log("connect DB");
    }catch(error) {
        console.log("Mongodb connect error",error);
        process.exit(1)
    }
}




module.exports = connectDB;

