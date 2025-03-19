const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../model/userSchema");
const bcrypt = require("bcryptjs");
const { sign } = require("jsonwebtoken");

const registerUser = asyncHandler(async(req, res)=>{
    const {userName, email, password} = req.body;
    if(!userName || !email || !password){
        res.status(400);
        throw new Error("All fields are mandatory!");
    }
    const userAvailable = await User.findOne({email});
    if(userAvailable){
        res.status(400);
        throw new Error("User is already Registered!");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("hashed password : ", hashedPassword);
    const user = User.create({
        userName,
        email,
        password: hashedPassword,
    })
    if(user){
        res.status(201).json({userName: user.userName, email: user.email});
    }
    else{
        res.status(400).json("The data is incorrect");
    }
});

const loginUser = asyncHandler(async(req, res)=>{
    const {email, password} = req.body;
    if(!email || !password){
        res.status(400);
        throw new Error("All fields are mandatory!");
    }
    const user = await User.findOne({email});
    if(!user){
        res.status(400).json("email not found");
    }
    if(await bcrypt.compare(password, user.password)){
        const accessToken = jwt.sign({
            user:{
                userName: user.name,
                email: user.email,
                password: user.password,
            },
        },
        process.env.SECRET_KEY,
        {expiresIn: "1h"},
        );
        res.status(200).json({accessToken});
    }
    else{
        req.status(400);
        throw new Error("Email or Password is incorrect!");
    }
});

const userInfo = asyncHandler(async(req, res)=>{
    res.json(req.user);
});

module.exports = {registerUser, loginUser, userInfo};
