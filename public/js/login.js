function tryLogin(){
    sessionStorage.clear();
    var _username = document.getElementById('username').value;
    var _password = document.getElementById('password').value;
    api.getUser(_username).then((User) => {
        if(_password==User.password){
            sessionStorage.clear();
            sessionStorage.setItem("username",_username);
            sessionStorage.setItem("password",_password);
            window.location.href = "http://localhost:8989/home";
            return;
        }
        else alert("password is wrong, try again")
    });
}
function tryRegister(){
    var _username = document.getElementById('username').value;
    var _password = document.getElementById('password').value;
    var _password2 = document.getElementById('confirm-password').value;
    if(_password!=_password2) alert("The two passwords do not match");
    else if(_username.includes(" ")||_username==""||_password==""||_password.includes(" ")) alert("Username or password not valid, dont put spaces or blank boxes");
    else{
        user={
            username:_username,
            password:_password
        }   
        api.addUser(user).then((User)=>{
            if(!User) alert("username already taken, choose another name");
            else{
                
                sessionStorage.clear();
                sessionStorage.setItem("username",_username);
                sessionStorage.setItem("password",_password);
                window.location.href = "http://localhost:8989/home";
            }
        });
    }
    
}

function checkStorage(){
    var _username = sessionStorage.getItem("username");
    var _password = sessionStorage.getItem("password");
    sessionStorage.removeItem("id")
    if(_username){
        
        api.getUser(_username).then((User) => {
            if(_password!=User.password){
                sessionStorage.clear();
                window.location.href = "http://localhost:8989/home/login";
            }
            else
            {
                document.getElementById('profile-link').href = '/home/profile/'+_username;
            }
        });
        return ;
    }
    sessionStorage.clear();
    window.location.href = "http://localhost:8989/home/login";
}
function renderGamePref(){
    let div=document.querySelector(".choose-match");
    div.style.display="grid";
}
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector("#showpsw").addEventListener("change",(e)=>{
        if(e.target.checked)document.querySelector("#password").type="text"
        else document.querySelector("#password").type="password"
    })
});