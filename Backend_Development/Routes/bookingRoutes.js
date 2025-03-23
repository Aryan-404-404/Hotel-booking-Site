const express = require("express");
const router = express.Router();

const {
    getAllBookings,
    getBookingById,
    createBooking,
    updateBooking,
    deleteBooking
} = require("../Controllers/BookingController");

const validateToken = require("../middlewares/validateToken");

router.get('/bookings', validateToken, getAllBookings);
router.get('/booking/:id', validateToken, getBookingById);
router.post('/bookings', validateToken, createBooking);
router.put('/bookings/:id', validateToken, updateBooking);
router.delete('/bookings/:id', validateToken, deleteBooking);

module.exports = router;