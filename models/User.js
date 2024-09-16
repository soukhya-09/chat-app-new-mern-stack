const mongoose = require("mongoose")



const User = new mongoose.Schema({
fullname:{
    type:String,
    required:true
},
username:{
    type:String,
    required:true,
    unique:true,
},
password:{
    type:String,
    required:true,
   
},
profilepicture:{
    type:String,
    
}
,
gender:{
    type:String,
    enum:["Male","Female"],
    required:true
}


},{timestamps:true})


module.exports = mongoose.model("User",User)