let bookings = [];
let currentPage = 1;
const itemsPerPage = 10;
import config from '../config.js';
const token = localStorage.getItem('token');

document.getElementById('signOut').addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    window.location.href = '../registrations/Sign_in_Page/sign_in.html';
});

document.addEventListener("DOMContentLoaded", () => {
  loadBookings();
  document.getElementById("refreshBtn").addEventListener("click", loadBookings);

  document.addEventListener("change", e => {
    if (e.target.classList.contains("status-select")) {
      const id = e.target.dataset.id;
      const btn = document.querySelector(`.save-btn[data-id="${id}"]`);
      btn.disabled = false;
      btn.classList.add("btn-primary");
    }
  });

  document.addEventListener("click", e => {
    if (e.target.closest(".save-btn")) {
      const btn = e.target.closest(".save-btn");
      const id = btn.dataset.id;
      const newStatus = document.querySelector(`.status-select[data-id="${id}"]`).value;
      saveStatus(id, newStatus);
    }
  });

  document.addEventListener("click", e=>{
    if(e.target.closest(".delete-btn")){
      const btn = e.target.closest(".delete-btn");
      const id = btn.dataset.id;
      deleteBooking(id);
    }
  })
});

function loadBookings() {
  document.getElementById("loading").style.display = "block";
  document.getElementById("bookingsTableBody").innerHTML = "";

  fetch(config.apiUrl+`/book/bookings`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      "Content-Type": "application/json",
    }
  })
    .then(res => {
      if (!res.ok) throw new Error(`Error: ${res.status} ${res.statusText}`);
      return res.json();
    })
    .then(data => {
      bookings = data;
      // Log the structure of the first booking to debug ID issues
      if (bookings.length > 0) {
        console.log("First booking structure:", bookings[0]);
        console.log("ID type:", typeof bookings[0]._id);
      }
      
      if (bookings.length === 0) {
        document.getElementById("bookingsTableBody").innerHTML = "<tr><td colspan='8'>No bookings found.</td></tr>";
      } else {
        renderStats();
        renderTable();
      }
      document.getElementById("loading").style.display = "none";
    })
    .catch(err => {
      console.error(err);
      document.getElementById("loading").style.display = "none";
      alert("Failed to load bookings. Please try again later.");
    });
}

function saveStatus(id, status) {
  const btn = document.querySelector(`.save-btn[data-id="${id}"]`);
  btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i>`;
  
  if (!token) {
    alert("You are not authorized to perform this action.");
    return;
  }
  
  // Log the exact URL and request data
  const url = config.apiUrl+`/book/bookings/${id}`;
  
  fetch(url, {
    method: "PATCH",
    headers: {
      'Authorization': `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  })
    .then(res => {
      // Log the response status
      console.log("Response status:", res.status, res.statusText);
      
      if (!res.ok) {
        // Get the response text to see error details
        return res.text().then(text => {
          console.error("Error response text:", text);
          throw new Error(`Server Error: ${res.status} ${res.statusText} - ${text}`);
        });
      }
      return res.json();
    })
    .then(updatedBooking => {
      console.log("Server successfully returned updated booking:", updatedBooking);
      
      // Update the booking in the local array
      const bookingIndex = bookings.findIndex(b => String(b._id) === String(id));
      console.log("Booking index in local array:", bookingIndex);
      
      if (bookingIndex !== -1) {
        bookings[bookingIndex].status = status;
        renderStats();
      } else {
        console.warn("Booking not found in local array. Reloading all bookings.");
        loadBookings();
      }
      
      btn.innerHTML = `<i class="fas fa-save"></i>`;
      btn.disabled = true;
      btn.classList.remove("btn-primary");
      showToast("Status updated!");
    })
    .catch(err => {
      console.error("PATCH request failed:", err);
      btn.innerHTML = `<i class="fas fa-save"></i>`;
      alert("Failed to update status. Please try again later.");
    });
}

function deleteBooking(id){
  const btn = document.querySelector(`.delete-btn[data-id="${id}"]`);

  if(!token){
    alert("You are not authorized to perform this action.");
    return;
  }
  const url = config.apiUrl+`/book/bookings/${id}`;
  
  fetch(url, {
    method: "DELETE",
    headers: {
      'Authorization': `Bearer ${token}`,
      "Content-Type": "application/json",
    }
  })
    .then(res => {
      if (!res.ok) {
        alert('Unable to delete the booking!')
      }
      else{
        showToast("Booking deleted!");
        btn.closest('tr').remove();
      }
    })
    .catch(err => {
      console.error(err);
      alert("Failed to delete the booking. Please try again later.");
    });
}

function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.style.display = "block";
  setTimeout(() => (toast.style.display = "none"), 3000);
}

function renderStats() {
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("todayCheckins").textContent = bookings.filter(b => b.checkIn === today).length;
  document.getElementById("confirmedBookings").textContent = bookings.filter(b => b.status === "confirmed").length;
  document.getElementById("pendingBookings").textContent = bookings.filter(b => b.status === "pending").length;
  document.getElementById("canceledBookings").textContent = bookings.filter(b => b.status === "canceled").length;
}

function renderTable() {
  const start = (currentPage - 1) * itemsPerPage;
  const end = Math.min(start + itemsPerPage, bookings.length);
  const paginatedData = bookings.slice(start, end);

  document.getElementById("paginationInfo").textContent = `${start + 1}-${end}`;
  document.getElementById("totalBookings").textContent = bookings.length;
  renderPagination(Math.ceil(bookings.length / itemsPerPage));

  const rows = paginatedData.map(booking => {
    // Debug log for each booking ID
    console.log(`Rendering booking: ${booking._id}`);
    
    // Handle potential missing data with optional chaining and nullish coalescing
    const userName = booking.user?.userName || "Guest not specified";
    const roomNumber = booking.room?.roomNumber || "Room not assigned";
    const checkInDate = formatDate(booking.checkIn);
    const checkOutDate = formatDate(booking.checkOut);
    
    // Make sure we have the persons data in the expected format
    const adults = booking.persons?.adults || 1;
    const children = booking.persons?.children || 0;
    const guestsInfo = formatGuests(adults, children);
    
    // Make sure to convert the ID to string to avoid type mismatches
    const bookingId = String(booking._id);
    
    return `
      <tr>
        <td>${userName}</td>
        <td>${roomNumber}</td>
        <td>${checkInDate}</td>
        <td>${checkOutDate}</td>
        <td>${guestsInfo}</td>
        <td>
          <select class="status-select" data-id="${bookingId}">
            <option value="pending" ${booking.status === "pending" ? "selected" : ""}>Pending</option>
            <option value="confirmed" ${booking.status === "confirmed" ? "selected" : ""}>Confirmed</option>
            <option value="canceled" ${booking.status === "canceled" ? "selected" : ""}>Canceled</option>
          </select>
        </td>
        <td>
          <button class="btn btn-sm save-btn" data-id="${bookingId}" disabled>
            <i class="fas fa-save"></i>
          </button>
          <button class="btn btn-sm delete-btn" data-id="${bookingId}">
            <i class="fa-solid fa-trash"></i>
          </button>
        </td>
      </tr>
    `;
  }).join("");

  document.getElementById("bookingsTableBody").innerHTML = rows;
}

function formatDate(dateStr) {
  if (!dateStr) return "N/A";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch (e) {
    console.error("Invalid date format:", dateStr);
    return "Invalid Date";
  }
}

function formatGuests(adults, children) {
  adults = parseInt(adults) || 1;
  children = parseInt(children) || 0;
  
  let str = `${adults} Adult${adults > 1 ? "s" : ""}`;
  if (children > 0) str += `, ${children} Child${children > 1 ? "ren" : ""}`;
  return str;
}

function renderPagination(totalPages) {
  const container = document.getElementById("paginationButtons");
  container.innerHTML = "";

  const makeBtn = (text, disabled, clickFn, active = false) => {
    const btn = document.createElement("button");
    btn.className = `page-btn ${active ? "active" : ""}`;
    btn.disabled = disabled;
    btn.innerHTML = text;
    btn.addEventListener("click", clickFn);
    return btn;
  };

  container.appendChild(makeBtn('<i class="fas fa-chevron-left"></i>', currentPage === 1, () => {
    currentPage--;
    renderTable();
  }));

  const pages = [currentPage - 1, currentPage, currentPage + 1].filter(p => p >= 1 && p <= totalPages);
  pages.forEach(p => {
    container.appendChild(makeBtn(p, false, () => {
      currentPage = p;
      renderTable();
    }, p === currentPage));
  });

  container.appendChild(makeBtn('<i class="fas fa-chevron-right"></i>', currentPage === totalPages, () => {
    currentPage++;
    renderTable();
  }));
}