import { showAlert } from "./alert.js"


const registerForm = document.querySelector('.register-form');

registerForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const username = document.getElementById('fname').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    const metaMaskAddress = document.getElementById("m-address").value

    // You can add more validation here before sending data to the server

    const userData = {
        metaMaskAddress,
        username,
        email,
        password,
        passwordConfirm,
    };
    console.log(userData)
    signup(userData)

});

const signup = async (userdata) => {
    try {
        const res = await axios({
            method: 'POST',
            url: 'http://localhost:4001/defiToken/v1/users',
            data: userdata,

        })

        console.log(res.data.data.user)

        if (res.data.status === "Success") {
            showAlert('success', 'Account Created successfully')

            window.setTimeout(() => {
                location.assign('login.html')
            }, 1500)
        }
    }
    catch (err) {

        let message =
            typeof err.response !== 'undefined'
                ? err.response.data.message
                : err.message

        showAlert('error', 'Error : ', message)

    }
}