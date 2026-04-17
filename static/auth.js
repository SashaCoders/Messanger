const registerForm = document.getElementById('register-form');
registerForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const {login, password, passwordRepeat} = registerForm;
    if (password.value !== passwordRepeat.value){
        return alert('passwords not repeat');
    }
    const user = JSON.stringify({
        login: login.value,
        password: password.value,
    });
    const  xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/register');
    xhr.send(user);
    xhr.onload = () => alert(xhr.response);
});