const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
    roomNumber: { type: Number, required: true },
    status: { type: String, enum: ["Available", "Unavailable"], default: "Available" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' , default: null}
}, { timestamps: true });

module.exports = mongoose.model("rooms", roomSchema);