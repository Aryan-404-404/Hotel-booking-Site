const express = require('express');
const Room = require('../model/roomSchema');
const asyncHandler = require("express-async-handler");

createRoom = asyncHandler(async(req, res) => {
    try {
        const newRoom = new Room(req.body);
        const savedRoom = await newRoom.save();
        res.status(201).json(savedRoom);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET ALL ROOMS
getAllRooms =  asyncHandler(async (req, res) => {
    try {
        const rooms = await Room.find().populate('user', '-password -__v');;
        res.status(200).json(rooms);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET SINGLE ROOM
getRoom =  asyncHandler(async (req, res) => {
    try {
        const room = await Room.findById(req.params.id).populate('user', '-password -__v');;
        if (!room) return res.status(404).json({ message: "Room not found" });
        res.status(200).json(room);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE ROOM
updateRoom =  asyncHandler(async (req, res) => {
    try {
        const updatedRoom = await Room.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        if (!updatedRoom) return res.status(404).json({ message: "Room not found" });
        res.status(200).json(updatedRoom);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE ROOM
deleteRoom =  asyncHandler(async (req, res) => {
    try {
        const deletedRoom = await Room.findByIdAndDelete(req.params.id);
        if (!deletedRoom) return res.status(404).json({ message: "Room not found" });
        res.status(200).json({ message: "Room has been deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = {
    createRoom,
    getAllRooms,
    getRoom,
    updateRoom,
    deleteRoom
}