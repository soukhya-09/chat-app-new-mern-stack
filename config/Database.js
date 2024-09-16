const mongoose = require("mongoose")
require("dotenv").config()
const URL = process.env.MONGO_URL

const database = async ()=>{
    await mongoose.connect(URL)
     .then(()=>{
        console.log("Database connected successfully");
     })
     .catch((error)=>{
        console.log("ERROR WHILE CONNECTING TO DATABASE");
        console.log(error.message);
        console.log(error);
     })
}
module.exports= database