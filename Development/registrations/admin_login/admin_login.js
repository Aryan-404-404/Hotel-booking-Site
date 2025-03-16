// DOM Elements
const adminLoginForm = document.getElementById('admin-login-form');
const messageBox = document.getElementById('message-box');

// Admin credentials (in a real application, these would be stored securely on the server)
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';

// Handle admin login form submission
adminLoginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = document.getElementById('admin-username').value;
    const password = document.getElementById('admin-password').value;
    
    // Check admin credentials
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        showMessage('Admin login successful! Redirecting to admin dashboard...', false);
        
        // In a real application, you would redirect to an admin dashboard
        setTimeout(() => {
            alert('Welcome to the Admin Dashboard!');
            // window.location.href = 'admin-dashboard.html';
        }, 2000);
        
        // Reset form
        adminLoginForm.reset();
    } else {
        showMessage('Invalid admin credentials. Please try again.', true);
    }
});

// Display message to user
function showMessage(message, isError) {
    messageBox.textContent = message;
    messageBox.classList.remove('hidden');
    
    if (isError) {
        messageBox.classList.add('error');
        messageBox.classList.remove('message');
    } else {
        messageBox.classList.add('message');
        messageBox.classList.remove('error');
    }
}