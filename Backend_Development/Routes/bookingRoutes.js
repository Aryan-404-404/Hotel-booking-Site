const express = require("express");
const router = express.Router();

const {
    getAllBookings,
    getBookingById,
    createBooking,
    updateBooking,
    deleteBooking,
    updateField
} = require("../Controllers/BookingController");

const validateToken = require("../middlewares/validateToken");

router.get('/bookings', validateToken, getAllBookings);
router.get('/booking/:id', validateToken, getBookingById);
router.post('/bookings', validateToken, createBooking);
router.put('/bookings/:id', validateToken, updateBooking);
router.delete('/bookings/:id', validateToken, deleteBooking);
router.patch('/bookings/:id',validateToken ,updateField)
// router.delete('/filter', validateToken, filterRooms);

module.exports = router;