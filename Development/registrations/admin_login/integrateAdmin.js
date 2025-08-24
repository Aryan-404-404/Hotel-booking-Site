const messageBox = document.getElementById('message-box');
import config from "../../config.js";

document.getElementById('admin-login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const userName = document.getElementById('admin-username').value;
    const password = document.getElementById('admin-password').value;
    try {
        const res = await fetch(config.apiUrl + `/admin/login`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({ userName, password })
        })
        const data = await res.json();
        if (res.ok) {
            messageBox.innerText = "Admin Login Successful";
            localStorage.setItem('token', data.accessToken);
            localStorage.setItem('user', JSON.stringify(data.user));
            window.location.href = '../../admin_page/admin.html';
        }
        else {
            messageBox.innerText = data.message || "Login Failed as admin!";
        }
    } catch (e) {
        showMessage("Something went wrong!");
        console.error(e);
    }
})

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