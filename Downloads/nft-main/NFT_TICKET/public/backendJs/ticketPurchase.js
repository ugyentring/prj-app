import { showAlert } from "./alert.js"

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


// Declare variables within the scope of the script
var ticketCounts;
var ticketID;
const loadEvents = async () => {
    try {
        const res = await axios({
            method: 'get',
            url: 'http://localhost:4001/defiToken/v1/events',
        });

        load(res.data.data);
    } catch (err) {
        let message =
            typeof err.response !== 'undefined'
                ? err.response.data.message
                : err.message;

        console.error(message);
    }
};

const load = (data) => {
    const firstEvent = data[0];
    if (firstEvent) {
        // Update the global variables
        ticketCounts = firstEvent.ticketCount - 1;
        ticketID = firstEvent._id;

        document.querySelector("#ticketName").innerHTML = firstEvent.ticketName;
        document.querySelector("#ticketPrice").innerHTML = `${firstEvent.price} Eth`;
    }
};

const updateTicket = async () => {
    try {
        const res = await axios({
            method: 'PATCH',
            url: `http://localhost:4001/defiToken/v1/events/${ticketID}`,
            data: {
                ticketCount: ticketCounts,
            },
        });
        if (res.data.status === "Success") {
            console.log("Updated ticket");
        }
    } catch (err) {
        let message =
            typeof err.response !== 'undefined'
                ? err.response.data.message
                : err.message;

        console.error(message);
    }
};

loadEvents();




const purchaseTicket = async () => {
    try {
        var ticketId = 1;
        var buyerId = userToken._id;
        var ticketName = document.getElementById("ticketName").innerHTML;
        var ticketCount = parseInt(document.querySelector(".ticket-count").value);
        var email = userToken.email;

        // Validate ticket count
        if (ticketCount <= 0) {
            showAlert('error', 'Ticket count must be greater than zero');
            return;  // Exit the function if validation fails
        }

        const ticketData = {
            buyerId,
            ticketName,
            ticketCount,
            ticketId,
            email
        };

        console.log(ticketData);

        const res = await axios({
            method: 'post',
            url: 'http://localhost:4001/defiToken/v1/tickets',
            data: ticketData
        });

        // Check if App.purchaseTicket() was successful
        if (res.data.status === "Success") {
            App.purchaseTicket();
            showAlert('success', 'Ticket Bought');
            updateTicket();
            // setTimeout(() => {
            //     location.assign('ticket.html');
            // }, 1500);
        } else {
            showAlert('error', 'Failed to purchase ticket');
        }
    } catch (error) {
        console.error('Error creating ticket:', error.message);
    }
};



document.getElementById("ticketPurchase").addEventListener("click", () => {
    if (Object.keys(userToken).length !== 0) {
        purchaseTicket()
    } else {
        window.location.href = "login.html";

    }
})


const App = {
    web3Provider: null,
    contracts: {},
    account: null,

    init: async () => {
        if (typeof window.ethereum !== 'undefined') {
            App.web3Provider = window.ethereum;
            web3 = new Web3(window.ethereum);
            await window.ethereum.enable(); // Request account access if not already granted
        } else {
            App.web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:7111');
            web3 = new Web3(App.web3Provider);
        }
        // Get the user's Ethereum accounts
        const accounts = await web3.eth.getAccounts();

        App.account = accounts[0];
        console.log(App.account)
        await App.initContract();
        await App.getTicketDetails();
        await App.getBuyerDetails();

    },
    initWeb3: async () => {
        if (typeof web3 !== 'undefined') {
            // Use the injected web3 provided by MetaMask or other wallet
            App.web3Provider = web3.currentProvider;
            web3 = new Web3(App.web3Provider);
        } else {
            // Fallback to a local development provider if not available
            App.web3Provider = new Web3.providers.HttpProvider('http://127.0.0.7111'); // Update with your local Ethereum node URL
            web3 = new Web3(App.web3Provider);
        }

        // Get the user's Ethereum accounts
        const accounts = await web3.eth.getAccounts();
        App.account = accounts[0]; // Use the first account as the default account
    },

    initContract: async () => {
        try {
            // Load DonationToken.json
            const response = await fetch('NFT_TICKET.json');
            if (!response.ok) {
                throw new Error(`Failed to fetch DonationToken.json. Status: ${response.status}`);
            }

            const data = await response.json();
            const TicketTokenArtifact = data;

            App.contracts.NFT_TICKET = TruffleContract(TicketTokenArtifact);
            App.contracts.NFT_TICKET.setProvider(App.web3Provider);

            console.log('Contract initialized successfully.');
        } catch (err) {
            console.error('Error initializing contract:', err);
        }
    },

    purchaseTicket: async () => {
        try {
            var ticketPrice = 0.001
            const digiToken = await App.contracts.NFT_TICKET.deployed();
            const ticketCount = await digiToken.ticketCount.call();
            document.querySelector("#ticketCount").innerHTML = ` ${ticketCount.words[0]} `;
            const result = await digiToken.purchaseTicket(ticketCount.words[0], {
                from: App.account,
                value: web3.utils.toWei(ticketPrice.toString(), 'ether') // Convert to wei
            });
            console.log("Purchased Ticket. Transaction: " + result.transactionHash);
        } catch (error) {
            console.error("Error :", error.message);
        }
    },

    transferTicket: async () => {
        try {
            var tokenId = 2
            var toAddress = document.getElementById("Recevier-Address").value
            const digiToken = await App.contracts.NFT_TICKET.deployed();

            const result = await digiToken.transferTicket(toAddress, tokenId, {
                from: App.account,
            })
            console.log(
                `Transferred Ticket ${tokenId} to ${toAddress}. Transaction: ${result.transactionHash}`
            );
        } catch (error) {
            console.error("Error :", error.message);
        }
    },
    getTicketDetails: async () => {
        try {
            const digiToken = await App.contracts.NFT_TICKET.deployed();

            const ticketCount = await digiToken.ticketCount.call();
            document.querySelector("#ticketCount").innerHTML = ` ${ticketCount.words[0]} `;

            for (var i = 1; i <= ticketCount.words[0]; i++) {
                const result = await digiToken.getTicketDetails(i, {
                    from: App.account,
                })
                console.log(
                    `Details for Ticket ${i}:`,
                    result[0],
                    result[1],
                    result[2]
                );
            }

        } catch (detailsError) {
            console.error("Error getting ticket details:", detailsError.message);
        }
    },
    getBuyerDetails: async () => {
        try {
            const digiToken = await App.contracts.NFT_TICKET.deployed();

            const ticketCount = await digiToken.ticketCount.call();
            document.querySelector("#ticketCount").innerHTML = ` ${ticketCount.words[0]} `;

            for (var i = 1; i <= ticketCount.words[0]; i++) {
                const result = await digiToken.getBuyerInfo(i);
                if(result === App.account){
                    document.querySelector("#buy-ticket-box").style.display = "none";
                    break;
                }else if(result !== App.account){
                    document.querySelector("#userTicket").style.display = "none";
                }
            }

        } catch (detailsError) {
            console.error("Error getting ticket details:", detailsError.message);
        }
    },

}


const loadTickets = async () => {
    try {
        const res = await axios({
            method: 'GET',
            url: 'http://localhost:4001/defiToken/v1/tickets',
        })

        loadTicketData(res.data.data)

    }
    catch (err) {

        let message =
            typeof err.response !== 'undefined'
                ? err.response.data.message
                : err.message

        console.log(message)
    }
}

function loadTicketData(data) {
    data.forEach(data => {
        if (userToken._id === data.buyerId) {
            const ticketContainer = document.querySelector("#userTicket")

            ticketContainer.innerHTML += `
            <div class="event-tickets" >
            <div
                class="ticket-row flex flex-column flex-lg-row justify-content-lg-between align-items-lg-center">
                <div class="ticket-type flex flex-column flex-lg-row align-items-lg-center">
                    <h3 class="entry-title" id="userTicketName">${data.ticketName}</h3>

                    <span class="mt-2 mt-lg-0"> <span style="color: black;"
                            id="UserTicketCount"> Ticket Count : </span> ${data.ticketCount}</span>
                    <span class="mt-2 mt-lg-0"> <span style="color: black;"
                            id="UserTicketID">
                            Ticket ID : </span> ${data.ticketId}</span>

                </div>
                <input type="text" placeholder="Recevier Address" id="Recevier-Address">    
                <!-- ticket-type -->
                <input type="submit" name="" value="Transfer" id="ticketTransfer"
                    class="btn mt-2 mb-2 mt-lg-0 mb-lg-0"><!-- btn -->

            </div><!-- ticket-row -->
        </div>
                                        
                                        `
        }
    });
    document.getElementById("ticketTransfer").addEventListener("click", (e) => {
        e.preventDefault();
        App.transferTicket();
    })

}

window.addEventListener('load', () => {
    loadTickets();
    App.init();


});

