import { showAlert } from "./alert.js"

const login = async (email, password) => {
    try {
        const res = await axios({
            method: 'POST',
            url: 'http://localhost:4001/defiToken/v1/users/login',
            data: {
                email,
                password,
            },

        })

        console.log(res.data.data.user)

        if (res.data.status === "Success") {
            showAlert('success', 'Logged in successfully')

            window.setTimeout(() => {
                location.assign('ticket.html')
            }, 1500)

            var obj = res.data.data.user

            document.cookie = `token=${encodeURIComponent(JSON.stringify(obj))}`;
            // console.log(obj) 
        }
    }
    catch (err) {

        let message =
            typeof err.response !== 'undefined'
                ? err.response.data.message
                : err.message

        showAlert('error', 'Error : incorrect email or password', message)

    }
}

document.querySelector('.login-form').addEventListener('submit', (e) => {
    e.preventDefault()
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value

    console.log(email, password)
    login(email, password)

})


