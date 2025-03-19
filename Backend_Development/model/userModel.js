const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    email:{
        type: String,
        required: [true, "Please Enter the user Name"]
    },
    
    password:{
        type: String,
        required: [true, "Please Enter the password"]
    },
});