const asyncHandler = require("express-async-handler");
const Booking = require("../model/bookingSchema");
const { checkout } = require("../Routes/userRoutes");

const createBooking = asyncHandler(async (req, res) => {
    const { checkIn, checkOut, persons, status } = req.body;

    if (!checkIn || !checkOut || !persons) {
        return res.status(400).json({ message: "All fields (checkIn, checkOut, persons) are required!" });
    }
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    if (checkInDate > checkOutDate) {
        return res.status(400).json({ message: "Check-out date must be after check-in date!" });
    }
    const newBooking = new Booking({ checkIn, checkOut, persons, status });
    const savedBooking = await newBooking.save();
    res.status(201).json(savedBooking);
});

const getAllBookings = asyncHandler(async (req, res) => {
    const bookings = await Booking.find();
    if (!bookings) {
        res.status(404);
        throw new Error("Bookings not found");
    }
    res.status(200).json(bookings);
});

const getBookingById = asyncHandler(async (req, res) => {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
        res.status(404);
        throw new Error("Booking not found");
    }
    res.status(200).json(booking);
});

const updateBooking = asyncHandler(async (req, res) => {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
        res.status(404);
        throw new Error("Booking not found");
    }
    const updatedBooking = await Booking.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
    if (!updatedBooking) {
        res.status(404);
        throw new Error("Booking not found");
    }
    res.status(200).json(updatedBooking);
});

const deleteBooking = asyncHandler(async (req, res) => {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
        res.status(404);
        throw new Error("Booking not found");
    }
    res.status(200).json({ message: "Booking deleted successfully" });
});

module.exports = {
    createBooking,
    getAllBookings,
    getBookingById,
    updateBooking,
    deleteBooking
};
