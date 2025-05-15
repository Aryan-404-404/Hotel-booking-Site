const mongoose = require("mongoose");

const bookingSchema = mongoose.Schema({
    checkIn: {
        type: Date,
        required: [true, "Check-in date is required"]
    },
    checkOut: {
        type: Date,
        required: [true, "Check-out date is required"]
    },
    persons: {
        type: Number,
        required: [true, "Number of persons is required"]
    },
    status:{
        type: String,
        enum: ["Confirmed", "Pending", "Canceled"], default: "Pending",
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    room:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'rooms',
        default: null
    }
}, { timestamps: true });

module.exports = mongoose.model("booking", bookingSchema);