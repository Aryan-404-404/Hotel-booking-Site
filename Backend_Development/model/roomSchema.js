const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
    roomNumber: { type: Number, required: true },
    status: { type: String, enum: ["Available", "Unavailable"], default: "Available" },
    roomType: { type: String, enum: ["Standard", "Deluxe", "Suite", "Executive"], default: "Standard"}
}, { timestamps: true });

module.exports = mongoose.model("rooms", roomSchema);