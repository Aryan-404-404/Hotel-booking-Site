const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken")

const validateToken = asyncHandler( async(req, res, next)=>{
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if(!authHeader && !authHeader.startsWith("Bearer")){
        res.status(401);
        throw new Error("User is not authorized! Please Sign-in first!")
    }
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded)=>{
        if(err){
            res.status(400);
            throw new Error("User is not authorized!  Please Sign-in first!")
        }
        req.user = decoded.user;
        next();
    })
})

module.exports = validateToken;