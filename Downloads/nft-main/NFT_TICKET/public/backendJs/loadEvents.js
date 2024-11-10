const loadEvents = async () => {
    try {
        const res = await axios({
            method: 'get',
            url: 'http://localhost:4001/defiToken/v1/events',
        })

        load(res.data.data)

    }
    catch (err) {

        let message =
            typeof err.response !== 'undefined'
                ? err.response.data.message
                : err.message

        console.log(message)
    }
}

const load = (data) => {
    const firstEvent = data[0];

    if (firstEvent) {
        const startDateString = firstEvent.startDate;
        const endDateString = firstEvent.endDate;

        const startDate = new Date(startDateString);
        const endDate = new Date(endDateString);

        // Update countdown with new dates
        updateCountdown(startDate, endDate);
        // Display event details
        document.querySelector('.event-name').innerHTML = firstEvent.eventName;
        document.querySelector('#end-Date').innerHTML = endDateString;
        document.querySelector("#ticketName").innerHTML = firstEvent.ticketName;

    }
}

const updateCountdown = (startDate, endDate) => {
    const countdownElements = document.querySelectorAll('.countdown-holder div');

    function calculateTimeDifference() {
        const now = new Date();
        const timeDifference = endDate - now;

        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

        countdownElements[0].innerText = days;
        countdownElements[1].innerText = hours;
        countdownElements[2].innerText = minutes;
        countdownElements[3].innerText = seconds;
    }

    setInterval(calculateTimeDifference, 1000);
    calculateTimeDifference();
}

loadEvents();


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

console.log(userToken)

document.getElementById("purchaseTicket").addEventListener("click", async () => {
    if (Object.keys(userToken).length !== 0) {
        window.location.href = "ticket.html";
    } else {
        window.location.href = "login.html";
    }
    console.log("click");
});