const express = require("express")
const jwt = require("jsonwebtoken")
 exports.auth = async(req,res,next)=>{
    try {
        const token = req.cookies.token ;
       // console.log("token" ,token);
        if(!token){
            return res.status(400).json({
                message:"Token not found,User not authenticated please login"
            })
        }
        const decode= await jwt.verify(token,process.env.JWT_SECRET);
        if(!decode){
            return res.status(400).json({
                message:"Invalid Token"
            })
        }
        
        req.id = decode.userid;
        next();

    } catch (error) {
        console.log(error);
        console.log(error.message);
        return res.status(401).json({
            message:"Error while authentication",
            response:error.message,
        })
    }
 }