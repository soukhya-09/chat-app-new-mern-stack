const User = require("../models/User");
const Conversation = require("../models/Conversation")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const cookie = require("cookie-parser");
const Message = require("../models/Message");
const {io , getreceiveridrealtime} = require("../socket")

require("dotenv").config();

exports.register = async(req,res)=>{
    try {
        
        const {username,password,confirmpassword,gender,fullname} = req.body;
if(!fullname || !username ||!password ||!confirmpassword ||!gender){
    return res.status(400).json({
        
        message:"All Fields are necessary , please enter full details"
    })
}
if(password !== confirmpassword ){
    return res.status(400).json({
        message:"Password and Confirm password does not match"
    })
}
const userdata= await User.findOne({username:username});
if(userdata){
    return res.status(400).json({
        message:"User already Exists"
    })
}
const hashpassword = await bcrypt.hash(password,10);
const profilepic = gender==='Male'?"https://avatar.iran.liara.run/public/boy":"https://avatar.iran.liara.run/public/girl"
await User.create({
    fullname,
    password:hashpassword,
    gender,
    profilepicture:profilepic,
    username,
})

return res.status(200).json({
    message:"User created successfully",
    success:true
})
    } catch (error) {
        console.log(error);
        console.log(error.message);
    }
}


exports.login = async(req,res)=>{
    try { 
        

        const {username,password} = req.body;
        if( !username ||!password ){
            return res.status(400).json({
                success:false,
                message:"All Fields are necessary , please enter full details"
            })
        }
        const user = await User.findOne({username:username});
        if(!user){
            return res.status(400).json({
                success:false,
                message:"User not found , Please signup"
            })
        }
        const checkpass = await bcrypt.compare(password,user.password);
        if(!checkpass){
            return res.status(400).json({
                success:false,
                message:"Password is Incorrect "
            })
        }

    const token = await jwt.sign({
        userid:user._id,
        username:user.username,
    },process.env.JWT_SECRET,{
        expiresIn:"12h"
    })
    user.password = undefined
return res.status(200).cookie("token",token,{maxAge:1*24*60*60*1000,httpOnly:true,sameSite:"strict"}).json({
    success:true,
    message:"Logged in Successfully",
    user:user
})
    } catch (error) {
        console.log(error);
        
    }
}



exports.logout = (req,res)=>{
    try {
        return res.status(200).cookie("token","",{maxAge:0}).json({
            message:"Logged out successfully"
        })
    } catch (error) {
        console.log(error);
    }
}


exports.getallusers = async(req,res)=>{
    try {
        const loggeduser = req.id;
        const otherusers = await User.find({_id:{$ne:loggeduser}}).select("-password");
        return res.status(200).json({
            message:"Successfully fetched all other users",
            users:otherusers
        })
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message:"unable to get all users"
        })
    }
}

exports.sendmessage = async(req,res)=>{
   
    try {
      const senderid = req.id;
      const receiverid = req.params.id;
       const {message } = req.body;
       console.log(senderid,receiverid,message);
       let conversation  = await Conversation.findOne({
          participants:{$all:[senderid,receiverid]}
       })
       if(!conversation){
        conversation = await Conversation.create({
            participants:[senderid,receiverid]
        })
       }
       
       

       const newmessage = await Message.create({
        senderId:senderid,
        receiverId:receiverid,
        message:message
       })
      
       if(newmessage){
        conversation.messages.push(newmessage._id);
       
       
       }
       const realtimereceiverid = getreceiveridrealtime(receiverid);
       console.log("real time  id" ,realtimereceiverid);
       if (realtimereceiverid) {
        io.to(realtimereceiverid).emit("newmessage", {
           
            newmessage: newmessage,
           
        });
    }
       await conversation.save()
       return res.status(200).json({
        success:true,
        message:newmessage
        
       })
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message:"not sent"
           })
    }
}

exports.getmessages = async(req,res)=>{
    try {
        const senderId = req.id;
        const receiverId=req.params.id;
        const conversation = await Conversation.findOne({
            participants:{$all:[senderId,receiverId]}
        }).populate("messages");
    ;
    return res.status(200).json({
        message:"got messages",
        conversation:conversation
    })
    } catch ( error) {
        return res.status(400).json({
            message:"not found  messages",
            error:error,
            
        })
    }
}

