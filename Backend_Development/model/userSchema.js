const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    userName: {
        type: String,
        required: [true, "Please enter the user name"]
    },
    email: {
        type: String,
        required: [true, "Please Enter the Email"]
    },

    password: {
        type: String,
        required: [true, "Please Enter the password"]
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);