 // Sample room data with unsplash images
 const roomData = [
    {
        id: 1,
        name: "Deluxe King Room",
        type: "deluxe",
        price: 199,
        priceUnit: "per night",
        image: "https://source.unsplash.com/600x400/?hotel,room,luxury",
        description: "Spacious room with a king-sized bed and city view.",
        features: ["King Bed", "City View", "Free WiFi", "Mini Bar", "Room Service"]
    },
    {
        id: 2,
        name: "Standard Twin Room",
        type: "standard",
        price: 149,
        priceUnit: "per night",
        image: "https://source.unsplash.com/600x400/?hotel,twin,room",
        description: "Comfortable room with two twin beds.",
        features: ["Twin Beds", "Free WiFi", "TV", "Air Conditioning"]
    },
    {
        id: 3,
        name: "Executive Suite",
        type: "executive",
        price: 299,
        priceUnit: "per night",
        image: "https://source.unsplash.com/600x400/?hotel,suite,executive",
        description: "Luxurious suite with separate living area and premium amenities.",
        features: ["King Bed", "Separate Living Area", "Ocean View", "Free WiFi", "Mini Bar", "Room Service", "Bathtub"]
    },
    {
        id: 4,
        name: "Family Suite",
        type: "suite",
        price: 349,
        priceUnit: "per night",
        image: "https://source.unsplash.com/600x400/?hotel,family,suite",
        description: "Spacious suite perfect for families, with two bedrooms.",
        features: ["Two Bedrooms", "King Bed", "Twin Beds", "Family Area", "Free WiFi", "Mini Bar", "Room Service"]
    },
    {
        id: 5,
        name: "Budget Single Room",
        type: "standard",
        price: 99,
        priceUnit: "per night",
        image: "https://source.unsplash.com/600x400/?hotel,single,room",
        description: "Cozy room for solo travelers.",
        features: ["Single Bed", "Free WiFi", "TV", "Air Conditioning"]
    },
    {
        id: 6,
        name: "Panoramic View Suite",
        type: "suite",
        price: 399,
        priceUnit: "per night",
        image: "https://source.unsplash.com/600x400/?hotel,panoramic,luxury",
        description: "Luxury suite with panoramic views of the city and premium amenities.",
        features: ["King Bed", "Panoramic View", "Free WiFi", "Mini Bar", "Room Service", "Premium Toiletries", "Bathtub"]
    }
];

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
document.getElementById('check-in').addEventListener('change', function() {
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
searchForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const destination = document.getElementById('destination').value;
    const checkIn = document.getElementById('check-in').value;
    const checkOut = document.getElementById('check-out').value;
    const guests = document.getElementById('guests').value;
    const roomType = document.getElementById('room-type').value;
    
    // Filter rooms based on room type
    let filteredRooms = roomData;
    if (roomType !== 'any') {
        filteredRooms = roomData.filter(room => room.type === roomType);
    }
    
    // Display results
    displayRooms(filteredRooms, destination, checkIn, checkOut, guests);
});

// Display rooms function
function displayRooms(rooms, destination, checkIn, checkOut, guests) {
    roomList.innerHTML = '';
    
    if (rooms.length === 0) {
        resultsMessage.textContent = 'No rooms found matching your criteria. Please try different options.';
        return;
    }
    
    resultsMessage.textContent = `${rooms.length} rooms found${destination ? ' in ' + destination : ''} for ${checkIn} to ${checkOut} (${guests} guests)`;
    
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
        button.addEventListener('click', function() {
            const roomId = this.getAttribute('data-room-id');
            openBookingModal(roomId, checkIn, checkOut, guests);
        });
    });
}

// Open booking modal
function openBookingModal(roomId, checkIn, checkOut, guests) {
    const room = roomData.find(room => room.id == roomId);
    
    if (!room) return;
    
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
}

// Close modal when X is clicked
closeModal.addEventListener('click', function() {
    modal.style.display = 'none';
});

// Close modal when clicking outside of modal content
window.addEventListener('click', function(event) {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Booking form submission
bookingForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Generate a random booking reference
    const randomRef = Math.random().toString(36).substring(2, 10).toUpperCase();
    bookingReference.textContent = `REF-${randomRef}`;
    
    // Hide booking form and show confirmation
    bookingForm.style.display = 'none';
    confirmation.style.display = 'block';
    
    // In a real application, you would send the booking data to a server here
    console.log('Booking submitted:', {
        roomId: this.getAttribute('data-room-id'),
        checkIn: this.getAttribute('data-check-in'),
        checkOut: this.getAttribute('data-check-out'),
        nights: this.getAttribute('data-nights'),
        totalPrice: this.getAttribute('data-total'),
        name: document.getElementById('full-name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        specialRequests: document.getElementById('special-requests').value
    });
});

// Initial load - simulate a search to show all rooms
window.addEventListener('load', function() {
    const checkIn = document.getElementById('check-in').value;
    const checkOut = document.getElementById('check-out').value;
    const guests = document.getElementById('guests').value;
    
    displayRooms(roomData, '', checkIn, checkOut, guests);
});







