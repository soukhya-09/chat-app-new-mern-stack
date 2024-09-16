const mongoose = require("mongoose")



const Conversation = new mongoose.Schema({
participants:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
   
}],
messages:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Message',
   
}],


},{timestamps:true})


module.exports = mongoose.model("Conversation",Conversation)