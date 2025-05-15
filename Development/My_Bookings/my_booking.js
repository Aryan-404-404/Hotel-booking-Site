import config from '../config.js';
const token = localStorage.getItem('token');
if (!token) {
    alert("Please sign in first");
    window.location.href = "../registrations/Sign_in_Page/sign_in.html";
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const res = await fetch(config.apiUrl + `/book/bookings`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                "Content-Type": "application/json",
            }
        });
        if (res.ok) {
            const data = await res.json();
            const userData = data[0].user;

            document.getElementById('user-name').textContent = userData.userName;
            document.getElementById('user-avatar').textContent = userData.userName.charAt(0);
            document.getElementById('user-email').textContent = userData.email;

            renderBookings(data);

            const filterButtons = document.querySelectorAll('.filter-btn');
            filterButtons.forEach(button => {
                button.addEventListener('click', function () {
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    this.classList.add('active');
                    const status = this.dataset.filter;
                    if (status === 'all') {
                        renderBookings(data);
                    } else {
                        const filtered = data.filter(b => b.status === status);
                        renderBookings(filtered);
                    }
                });
            });
        }
        else {
            alert('Failed to fetch bookings!')

        }
    } catch {
        alert('Server error');
    }


    // Format date for display
    function formatDate(dateString) {
        const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }

    // Calculate number of nights
    function calculateNights(checkIn, checkOut) {
        const oneDay = 24 * 60 * 60 * 1000;
        const startDate = new Date(checkIn);
        const endDate = new Date(checkOut);
        return Math.round(Math.abs((startDate - endDate) / oneDay));
    }

    // Render bookings list
    function renderBookings(bookings) {
        const bookingsList = document.getElementById('bookings-list');

        if (bookings.length === 0) {
            bookingsList.innerHTML = `
                <div class="empty-state">
                    <h3>No bookings found</h3>
                    <p>You don't have any bookings matching your criteria.</p>
                </div>
            `;
            return;
        }

        bookingsList.innerHTML = '';

        bookings.forEach(booking => {
            const nights = calculateNights(booking.checkIn, booking.checkOut);

            const bookingCard = document.createElement('div');
            bookingCard.className = 'booking-card';
            bookingCard.innerHTML = `
                <div class="booking-info">
                    <div class="booking-dates">
                        <div class="date-group">
                            <div class="date-label">Check In</div>
                            <div class="date-value">${formatDate(booking.checkIn)}</div>
                        </div>
                        <div class="date-group">
                            <div class="date-label">Check Out</div>
                            <div class="date-value">${formatDate(booking.checkOut)}</div>
                        </div>
                        <div class="date-group">
                            <div class="date-label">Duration</div>
                            <div class="date-value">${nights} night${nights !== 1 ? 's' : ''}</div>
                        </div>
                    </div>
                    <div class="booking-details">
                        <div class="detail-item">
                            <span class="detail-icon">👤</span>
                            <span>${booking.persons} ${booking.persons > 1 ? 'persons' : 'person'}</span>
                        </div>
                    </div>
                </div>
                
                <div class="room-info">
                    <div class="room-header">
                        <div class="room-name">Room ${booking.room.roomNumber}</div>
                    </div>
                    <div class="room-details">
                        <p>${booking.room.roomType} Room</p>
                    </div>
                </div>
                
                <div class="booking-status">
                    <div class="status-badge status-${booking.status.toLowerCase()}">${booking.status}</div>
                    <button class="action-btn">View Details</button>
                </div>
            `;

            bookingsList.appendChild(bookingCard);
        });
    }


    // Simulate API fetch delay
    setTimeout(() => {
        renderBookings(bookingsData);
    }, 1000);
});