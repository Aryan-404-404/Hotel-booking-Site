const roomData = [
    {
        id: "67fbe11f4a7e0fd2c94bb419",
        name: "Deluxe King Room",
        type: "deluxe",
        price: 199,
        priceUnit: "per night",
        image: "../resources/img1.avif",
        description: "Spacious room with a king-sized bed and city view.",
        features: ["King Bed", "City View", "Free WiFi", "Mini Bar", "Room Service"]
    },
    {
        id: "67fbe12c4a7e0fd2c94bb41b",
        name: "Standard Twin Room",
        type: "standard",
        price: 149,
        priceUnit: "per night",
        image: "../resources/img4.avif",
        description: "Comfortable room with two twin beds.",
        features: ["Twin Beds", "Free WiFi", "TV", "Air Conditioning"]
    },
    {
        id: "67fbe1314a7e0fd2c94bb41d",
        name: "Standard Twin Room",
        type: "standard",
        price: 299,
        priceUnit: "per night",
        image: "../resources/img5.avif",
        description: "Luxurious suite with separate living area and premium amenities.",
        features: ["King Bed", "Separate Living Area", "Ocean View", "Free WiFi", "Mini Bar", "Room Service", "Bathtub"]
    },
    {
        id: "67fbe1374a7e0fd2c94bb41f",
        name: "Standard Twin Room",
        type: "standard",
        price: 349,
        priceUnit: "per night",
        image: "../resources/img6.avif",
        description: "Spacious suite perfect for families, with two bedrooms.",
        features: ["Two Bedrooms", "King Bed", "Twin Beds", "Family Area", "Free WiFi", "Mini Bar", "Room Service"]
    },
    {
        id: "67fbe13d4a7e0fd2c94bb421",
        name: "Standard Single Room",
        type: "standard",
        price: 199,
        priceUnit: "per night",
        image: "../resources/img2.webp",
        description: "Cozy room for solo travelers.",
        features: ["Single Bed", "Free WiFi", "TV", "Air Conditioning"]
    }
];
import config from '../config.js';
const token = localStorage.getItem('token');
if (!token) {
    alert("Please sign in first");
    window.location.href = "../registrations/Sign_in_Page/sign_in.html";
}
// DOM Elements
const searchForm = document.getElementById('search-form');
const roomList = document.getElementById('room-list');
const resultsMessage = document.getElementById('results-message');
const modal = document.getElementById('booking-modal');
const closeModal = document.querySelector('.close');
const modalRoomDetails = document.getElementById('modal-room-details');
const bookingForm = document.getElementById('booking-form');
const confirmation = document.getElementById('confirmation');
const bookingReference = document.getElementById('booking-reference');
const loadingAnimation = document.getElementById('loading-animation');
const submitButton = bookingForm.querySelector('button[type="submit"]');


// Set minimum dates for check-in and check-out
const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

document.getElementById('check-in').min = formatDate(today);
document.getElementById('check-out').min = formatDate(tomorrow);

// Initialize check-in and check-out dates
document.getElementById('check-in').value = formatDate(today);
document.getElementById('check-out').value = formatDate(tomorrow);

// Format date to YYYY-MM-DD for input[type="date"]
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Check-in date change event
document.getElementById('check-in').addEventListener('change', function () {
    const checkInDate = new Date(this.value);
    const checkOutDate = new Date(document.getElementById('check-out').value);

    // If check-out date is before or equal to check-in date, update it
    if (checkOutDate <= checkInDate) {
        const newCheckOutDate = new Date(checkInDate);
        newCheckOutDate.setDate(newCheckOutDate.getDate() + 1);
        document.getElementById('check-out').value = formatDate(newCheckOutDate);
    }

    // Update min attribute of check-out
    const nextDay = new Date(checkInDate);
    nextDay.setDate(nextDay.getDate() + 1);
    document.getElementById('check-out').min = formatDate(nextDay);
});

// Search form submission
searchForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const checkIn = document.getElementById('check-in').value;
    const checkOut = document.getElementById('check-out').value;
    const guests = document.getElementById('guests').value;
    const roomType = document.getElementById('room-type').value;

    // Filter rooms based on room type
    let filteredRooms = roomData;
    if (roomType !== 'any') {
        filteredRooms = roomData.filter(room =>
            room.type && room.type.toLowerCase() === roomType.toLowerCase()
        );
    }

    // Display results
    displayRooms(filteredRooms, checkIn, checkOut, guests);
});

// Display rooms function
function displayRooms(rooms, checkIn, checkOut, guests) {
    roomList.innerHTML = '';

    if (rooms.length === 0) {
        resultsMessage.textContent = 'No rooms found matching your criteria. Please try different options.';
        return;
    }

    resultsMessage.textContent = `${rooms.length} rooms found for ${checkIn} to ${checkOut} (${guests} guests)`;

    rooms.forEach(room => {
        const roomCard = document.createElement('div');
        roomCard.className = 'room-card';

        roomCard.innerHTML = `
            <div class="room-image" style="background-image: url('${room.image}')"></div>
            <div class="room-details">
                <h3 class="room-name">${room.name}</h3>
                <div class="room-price">$${room.price} <span>${room.priceUnit}</span></div>
                <p>${room.description}</p>
                <div class="room-features">
                    ${room.features.map(feature => `<span class="feature">${feature}</span>`).join('')}
                </div>
                <button class="btn book-btn" data-room-id="${room.id}">Book Now</button>
            </div>
        `;

        roomList.appendChild(roomCard);
    });

    // Add event listeners to Book Now buttons
    document.querySelectorAll('.book-btn').forEach(button => {
        button.addEventListener('click', function () {
            const roomId = this.getAttribute('data-room-id');
            openBookingModal(roomId, checkIn, checkOut, guests);
        });
    });
}

// Open booking modal
function openBookingModal(roomId, checkIn, checkOut, guests) {
    const room = roomData.find(room => room.id == roomId);

    if (!room) {
        alert('Room not found!');
        return;
    }

    // Calculate total price
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.round((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    const totalPrice = room.price * nights;

    // Update modal content
    modalRoomDetails.innerHTML = `
        <div class="modal-room-image" style="background-image: url('${room.image}'); height: 200px; background-size: cover; background-position: center; margin-bottom: 15px;"></div>
        <h3>${room.name}</h3>
        <p>${room.description}</p>
        <div class="booking-details">
            <p><strong>Check-in:</strong> ${checkIn}</p>
            <p><strong>Check-out:</strong> ${checkOut}</p>
            <p><strong>Guests:</strong> ${guests}</p>
            <p><strong>Nights:</strong> ${nights}</p>
            <p><strong>Price per night:</strong> $${room.price}</p>
            <p><strong>Total price:</strong> $${totalPrice}</p>
        </div>
    `;

    // Reset booking form and hide confirmation
    bookingForm.reset();
    bookingForm.style.display = 'block';
    confirmation.style.display = 'none';

    // Show modal
    modal.style.display = 'flex';

    // Store room details for form submission
    bookingForm.setAttribute('data-room-id', room.id);
    bookingForm.setAttribute('data-check-in', checkIn);
    bookingForm.setAttribute('data-check-out', checkOut);
    bookingForm.setAttribute('data-nights', nights);
    bookingForm.setAttribute('data-total', totalPrice);
    bookingForm.setAttribute('data-guests', guests);
}


// Close modal when clicking outside of modal content
window.addEventListener('click', function (event) {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Booking form submission
bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    loadingAnimation.style.display = 'block';
    submitButton.disabled = true;

    const roomId = bookingForm.getAttribute('data-room-id');
    const checkIn = bookingForm.getAttribute('data-check-in');
    const checkOut = bookingForm.getAttribute('data-check-out');
    const persons = bookingForm.getAttribute('data-guests');

    const bookingData = {
        room: roomId,
        checkIn,
        checkOut,
        persons
    };

    try {
        const res = await fetch(config.apiUrl+`/book/bookings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(bookingData),
        });

        let data;
        try {
            data = await res.json();
        } catch (err) {
            alert('Error: Invalid server response');
            return;
        }
        if (res.ok) {
            bookingForm.reset();
            bookingForm.style.display = 'none';
            confirmation.style.display = 'block';
        } else {
            alert('Error: ' + (data.message || 'An unexpected error occurred'));
        }
    } catch (err) {
        alert('Server error');
    }finally {
        loadingAnimation.style.display = 'none';
        submitButton.disabled = false;
    }
});


// Initial load - simulate a search to show all rooms
window.addEventListener('load', function () {
    const checkIn = document.getElementById('check-in').value;
    const checkOut = document.getElementById('check-out').value;
    const guests = document.getElementById('guests').value;

    displayRooms(roomData, checkIn, checkOut, guests);
});







