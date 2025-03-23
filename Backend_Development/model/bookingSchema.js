const mongoose = require("mongoose");

const bookingSchema = mongoose.Schema({
    userID:{
        type: mongoose.Schema.Types.ObjectId
    },
    checkIn:{
        type: Date,
        required: [true]
    },
    checkOut:{
        type: Date,
        required: [true]
    },
    persons:{
        type: Number,
        required: [true]
    },
    status:{
        type: "String",
        enum: ["Confirmed", "Pending", "Canceled"], default: "pending",
    }
}, { timestamps: true });

module.exports = mongoose.model("booking", bookingSchema);