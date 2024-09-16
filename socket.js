const http = require("http")
const {Server} = require("socket.io")

const express = require("express")
const app = express();
const server = http.createServer(app)
const io = new Server(server ,{
    cors:{
        origin:["*"],
        methods:["GET","POST"]
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
