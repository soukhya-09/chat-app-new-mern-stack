const http = require("http")
const {Server} = require("socket.io")

const express = require("express")
const app = express();
const server = http.createServer(app)
const io = new Server(server ,{
    cors:{
<<<<<<< HEAD
      origin: "http://localhost:3000", 
      methods: ["GET", "POST"],  
      credentials: true  
=======
          origin: "http://localhost:3000", 
      methods: ["GET", "POST"],  
      credentials: true 
>>>>>>> 17824c3f9d3235a1fe7175c9c3665d340dd7fea8
    }
})
const getreceiveridrealtime = (receiver_id)=>{
    return usermap[receiver_id];
}
const usermap = {};
io.on("connection",(socket)=>{
console.log("user connected", socket.id);
const userid = socket.handshake.query.userid
  if(userid!== undefined){usermap[userid] = socket.id}


   io.emit("getonlineusers", Object.keys(usermap))


  socket.on("disconnect",()=>{
    console.log(" user disconnected", socket.id);
    delete usermap[userid];
    io.emit("getonlineusers", Object.keys(usermap))
  })
})



module.exports ={io,server,app,getreceiveridrealtime}
