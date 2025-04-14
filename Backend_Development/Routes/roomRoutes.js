const express = require('express');
const verifyAdmin = require('../middlewares/varifyAdmin');
const validateToken = require("../middlewares/validateToken");
const { createRoom, getAllRooms, getRoom, updateRoom, deleteRoom } = require("../Controllers/roomControllers");

const router = express.Router();

router.post('/',validateToken, verifyAdmin, createRoom);
router.get('/',validateToken, getAllRooms);
router.get('/:id',validateToken, getRoom);
router.put('/:id',validateToken, verifyAdmin, updateRoom);
router.delete('/:id',validateToken, verifyAdmin, deleteRoom);

module.exports = router;