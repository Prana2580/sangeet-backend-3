require('dotenv').config();
const express = require("express");
const session = require('express-session');
const connectDB = require('./config/db');
const Music = require('./models/Music');
const app = express()
const port = process.env.PORT || 3000

require("./config/passport");

connectDB()

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}))


app.use("/auth", require("./routes/auth"));


function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/auth/google');
}

app.get("/dashboard", isAuthenticated, (req, res) => {
    res.send(`Welcome ${req.user.displayName}!`);
});

app.get("/",(req,res)=>{
    res.send("Hello World")
})

app.get("/api/musics",async(req,res)=>{
    try {
        const musics = await Music.find();
        res.status(202).json(musics);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

app.listen(port,()=>{
    console.log("Server is running on port 3001")
})