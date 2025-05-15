const express = require("express");
const router = express.Router();
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
require('dotenv').config();

router.post('/login', asyncHandler(async(req, res)=>{
    const { userName, password } = req.body;
    
    if (!userName || !password) {
        res.status(400);
        throw new Error("All fields are mandatory!");
    }

    if (
        userName === process.env.ADMIN_USERNAME &&
        password === process.env.ADMIN_PASSWORD
    ) {
        const accessToken = jwt.sign(
            {
                user: {
                    userName,
                    role: "admin"
                }
            },
            process.env.SECRET_KEY,
            { expiresIn: "1h" }
        );
        res.status(200).json({ accessToken });
        localStorage.setItem('token', accessToken);
    } else {
        res.status(400);
        throw new Error("Invalid admin credentials!");
    }
}));
module.exports = router;
