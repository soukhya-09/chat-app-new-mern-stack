const express = require("express");
const { register, login, logout, getallusers, sendmessage,getmessages } = require("../controllers/Usercontrol");
const { auth } = require("../Auth/auth");


const route = express.Router();
route.post("/register",register)
route.post("/login",login)
route.get("/logout",logout)
route.get("/getallusers",auth,getallusers);

route.post("/sendmessage/:id",auth,sendmessage)
route.get("/getmessages/:id",auth,getmessages)
module.exports = route  