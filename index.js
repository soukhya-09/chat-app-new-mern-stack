const express = require("express");
const {app,server} = require("./socket")
const cors = require("cors");
const cookieparser = require("cookie-parser");

require("dotenv").config();

// CORS configuration
app.use(cors({
    credentials: true,
    origin: "https://mern-chat-app-lhm1.onrender.com" 
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser());


const route = require("./routes/Routes");
app.use("/api/v1", route);



 




 
const PORT = process.env.PORT || 4000;
const database = require("./config/Database");

server.listen(PORT, () => {
    database();
    console.log(`Server running at ${PORT}`);
});

