const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    persons: { type: Number, required: true },
    room: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
    status: { type: String, enum: ["pending", "confirmed", "canceled"], default: "pending" }
}, { timestamps: true });

module.exports = mongoose.model("Booking", roomSchema);