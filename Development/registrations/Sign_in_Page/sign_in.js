    // DOM Elements
    const loginTab = document.getElementById('login-tab');
    const registerTab = document.getElementById('register-tab');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const messageBox = document.getElementById('message-box');
    
    // Local storage keys
    const USERS_KEY = 'registeredUsers';
    
    // Initialize users array in local storage if it doesn't exist
    if (!localStorage.getItem(USERS_KEY)) {
        localStorage.setItem(USERS_KEY, JSON.stringify([]));
    }
    
    // Switch between login and register tabs
    loginTab.addEventListener('click', () => {
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
        messageBox.classList.add('hidden');
    });
    
    registerTab.addEventListener('click', () => {
        registerTab.classList.add('active');
        loginTab.classList.remove('active');
        registerForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
        messageBox.classList.add('hidden');
    });
    
    // Handle login form submission
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        
        // Get registered users from local storage
        const users = JSON.parse(localStorage.getItem(USERS_KEY));
        
        // Find user
        const user = users.find(user => user.username === username && user.password === password);
        
        if (user) {
            showMessage('Login successful! Welcome back, ' + username, false);
            // Reset form
            loginForm.reset();
        } else {
            showMessage('Invalid username or password. Please try again or register.', true);
        }
    });
    
    // Handle register form submission
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const username = document.getElementById('register-username').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;
        
        // Validate passwords match
        if (password !== confirmPassword) {
            showMessage('Passwords do not match.', true);
            return;
        }
        
        // Get registered users from local storage
        const users = JSON.parse(localStorage.getItem(USERS_KEY));
        
        // Check if username already exists
        if (users.some(user => user.username === username)) {
            showMessage('Username already taken. Please choose another.', true);
            return;
        }
        
        // Add new user
        users.push({ username, email, password });
        
        // Save updated users array to local storage
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
        
        showMessage('Registration successful! You can now sign in.', false);
        
        // Reset form
        registerForm.reset();
        
        // Switch to login tab
        setTimeout(() => {
            loginTab.click();
        }, 2000);
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