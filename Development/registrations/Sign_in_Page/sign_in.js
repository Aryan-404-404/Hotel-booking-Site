const loginTab = document.getElementById('login-tab');
const registerTab = document.getElementById('register-tab');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const messageBox = document.getElementById('message-box');

// switch tabs
registerTab.addEventListener('click' , async() => { 
    loginTab.classList.remove('active');
    registerTab.classList.add('active');
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
    messageBox.classList.add('hidden');
});

loginTab.addEventListener('click' , async() => { 
    loginTab.classList.add('active');
    registerTab.classList.remove('active');
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
    messageBox.classList.add('hidden');
});

document.getElementById("register-form").addEventListener('submit' , async(Event) => { 
    Event.preventDefault();   
    await registerUser();
});

document.getElementById("login-form").addEventListener('submit' , async(Event) => { 
    Event.preventDefault();   
    await loginUser();
});

// register user
async function registerUser(){
    const userData = {
        userName: document.getElementById('register-username').value ,
        email: document.getElementById('register-email').value , 
        password: document.getElementById('register-password').value
    }

    try{
            const response = await fetch('http://localhost:5001/user/register' , {
            method: "POST" , 
            headers: {"Content-Type": "application/json"} , 
            body: JSON.stringify(userData)
        });

        const data = await response.json();

        if(!response.ok){
            throw new Error(data.message || "registration failed");
        }

        showmessage("registration successfull " , false);
    }
    catch(error){
        showmessage(error.message , true);
    }  
}

// login User
async function loginUser(){
    const credentials = {
        email: document.getElementById('login-email').value,
        password: document.getElementById('login-password').value
    }

    try{
        const response = await fetch('http://localhost:5001/user/login' , {
            method: "POST" , 
            headers: {"Content-Type": " application/json"} , 
            body: json.stringify(credentials) 
        });

        const data = response.json();
        
        if(!response.ok){
            throw new Error(data.message , " login failed");
        }

        showmessage("login successfully redirecting..." , false);
        setTimeout( ()=> {
            window.location.href = "Development/index.html";
        } , 2000);
    }
    catch(error){ 
        showmessage(error.message, true);
    }
}


async function showmessage(Message , Error){
    messageBox.textContent = Message;
    messageBox.classList.remove('hidden');

    if(Error){
        messageBox.classList.add('error');
        messageBox.classList.remove('message');
    }else{
        messageBox.classList.remove('error');
        messageBox.classList.add('message');
    }
}