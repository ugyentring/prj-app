import { showAlert } from "./alert.js";

let userToken;

if (document.cookie) {
    try {
        const decodedCookie = decodeURIComponent(document.cookie);
        const jsonStartIndex = decodedCookie.indexOf('{');
        const jsonString = decodedCookie.substring(jsonStartIndex);
        userToken = JSON.parse(jsonString);
    } catch (error) {
        console.error('Error parsing JSON:', error);
        userToken = {};
    }
} else {
    userToken = {};
}

if (Object.keys(userToken).length !== 0) {
    document.querySelector('.Btn').style.display = "flex";
}


if(userToken.email !== "tandin56@gmail.com"){
    document.getElementById("event-nav").style.display = "none";
}

const logout = async () => {
    try {
        const res = await axios({
            method: 'GET',
            url: "http://localhost:4001/defiToken/v1/users/logout"
        });
        if (res.data.status === "success") {
            // Delay the reload for a short time
            setTimeout(() => {
                location.reload(true);
            }, 1000);
        }
    } catch (err) {
        showAlert('error', 'Error: Error logging out! Try again');
    }
}

function deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

// Usage
document.querySelector('.Btn').addEventListener("click", () => {
    deleteCookie('token');
    // You can directly call logout here as well if needed
        logout();
});
