const asyncHandler = require("express-async-handler");
const Booking = require("../model/bookingSchema");
const Room = require("../model/roomSchema");
const { checkout } = require("../Routes/userRoutes");
const { findByIdAndUpdate } = require("../model/roomSchema");
const sendMail = require('../Mail');

const createBooking = asyncHandler(async (req, res) => {
    const { checkIn, checkOut, persons, status, room } = req.body;

    if (!checkIn || !checkOut || !persons) {
        return res.status(400).json({ message: "All fields (checkIn, checkOut, persons) are required!" });
    }
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    if (checkInDate > checkOutDate) {
        return res.status(400).json({ message: "Check-out date must be after check-in date!" });
    }
    const newBooking = new Booking({
        checkIn,
        checkOut,
        persons,
        status,
        user: req.user._id,
        room
    });
    const savedBooking = await newBooking.save();
    await Room.findByIdAndUpdate(room, { status: "Unavailable" })
    await savedBooking.populate('user');
    
    console.log('Sending email to ', savedBooking.user.email);
    await sendMail(
        savedBooking.user.email,
        'Booking Confirmed ✅',
        `
        <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
          <h2 style="color: #2E8B57;">Booking Confirmed!</h2>
          <p>Hi <strong>${savedBooking.user.userName}</strong>,</p>
          <p>Your room is booked from <strong>${new Date(savedBooking.checkIn).toLocaleDateString()}</strong> to <strong>${new Date(savedBooking.checkOut).toLocaleDateString()}</strong>.</p>
          <p>Details:</p>
          <ul>
            <li><strong>Guests:</strong> ${savedBooking.persons}</li>
            <li><strong>Status:</strong> ${savedBooking.status}</li>
          </ul>
          <p>Thank you for choosing us!</p>
        </div>
        `
      );
    res.status(201).json(savedBooking);
});

const getAllBookings = asyncHandler(async (req, res) => {
    if (req.user.role == 'admin') {
        const bookings = await Booking.find().populate('user', 'userName email').populate('room', 'roomNumber status roomType').sort({ createdAt: -1 });
        if (!bookings.length) {
            res.status(404);
            throw new Error("Bookings not found");
        }
        res.status(200).json(bookings);
    } else {
        const bookings = await Booking.find({ user: req.user._id }).populate('user', 'userName email').populate('room', 'roomNumber status roomType').sort({ createdAt: -1 });
        if (!bookings.length) {
            res.status(404);
            throw new Error("Bookings not found");
        }
        res.status(200).json(bookings);
    }
});

const getBookingById = asyncHandler(async (req, res) => {
    const booking = await Booking.findById(req.params.id).populate('user', 'userName email').populate('room', 'roomNumber status roomType');
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
    if (req.body.status === "Cancelled") {
        await Room.findByIdAndUpdate(booking.room, { status: "Available" });
    } else if (req.body.status === "Confirmed") {
        await Room.findByIdAndUpdate(booking.room, { status: "Unavailable" });
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

const updateField = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        // Update the booking
        const updatedBooking = await Booking.findByIdAndUpdate(
          id,
          { status },
          { new: true }  // Return the updated document
        );
        
        if (!updatedBooking) {
          return res.status(404).json({ message: 'Booking not found' });
        }
        
        // Only send back the data you need, not the entire MongoDB document
        const cleanedBooking = {
          _id: updatedBooking._id,
          status: updatedBooking.status,
          // Include other fields you need but omit any circular references
        };
        
        return res.status(200).json(cleanedBooking);
      } catch (error) {
        console.error('Error updating booking:', error);
        return res.status(500).json({ message: 'Internal server error' });
      }
})

module.exports = {
    createBooking,
    getAllBookings,
    getBookingById,
    updateBooking,
    deleteBooking,
    updateField
};
