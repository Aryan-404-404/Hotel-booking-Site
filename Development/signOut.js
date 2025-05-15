const user = JSON.parse(localStorage.getItem('user'));
const button = document.getElementById('signIn');

if(button){
    if(!user){
        button.textContent = 'Sign In';
        button.onclick=()=>{
            window.location.href = "./registrations/Sign_in_Page/sign_in.html";
        }
    }
    else{
        button.textContent = 'Sign Out';
        button.onclick=()=>{
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            button.textContent = 'Sign In'
            button.onclick=()=>{
                window.location.href = "./registrations/Sign_in_Page/sign_in.html";
            }
            window.location.reload();
        }
    }
}