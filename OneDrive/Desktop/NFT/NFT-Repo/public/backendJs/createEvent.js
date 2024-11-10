import { showAlert } from "./alert.js"

const createEvent = async () => {
    try {
        const eventPhotoInput = document.getElementById('event-Photo');
        const eventPhotoFile = eventPhotoInput.files[0];

        const eventDetails = new FormData();
        eventDetails.append('startDate', document.getElementById('start-Date').value);
        eventDetails.append('endDate', document.getElementById('end-Date').value);
        eventDetails.append('eventName', document.getElementById('event-Name').value);
        eventDetails.append('eventDescription', document.querySelector('textarea').value);
        eventDetails.append('ticketName', document.getElementById('ticket-Name').value);
        eventDetails.append('ticketCount', parseInt(document.getElementById('ticket-Number').value));
        eventDetails.append('price', parseInt(document.getElementById('ticket-Price').value));
        eventDetails.append('phoneNumber', 1234567);
        eventDetails.append('email', "itandindorji1@gmail.com");
        eventDetails.append('photo', eventPhotoFile);

        console.log(eventDetails);

        const res = await axios.post('http://localhost:4001/defiToken/v1/events', eventDetails);

        console.log(res.data.data.event);

        if (res.data.status === "Success") {
            showAlert('success', 'Event Created successfully');
            await App.mintToken();
            // window.setTimeout(() => {
            //     location.assign('/event')
            // }, 1500)
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

document.querySelector('.createEvent-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    createEvent();
});


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
        await App.initContract();

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

    toggleMintEnabled: async () => {
        try {
            const digiToken = await App.contracts.NFT_TICKET.deployed();
            const result = await digiToken
                .toggleIsMintEnabled({ from: App.account })
            console.log("Toggled Mint Enabled. Transaction: " + result.transactionHash);
        } catch (toggleError) {
            console.error("Error toggling mint enabled:", toggleError.message);
        }
    },

    mintToken: async () => {
        try {
            const NUM_TICKETS = parseInt(document.getElementById("ticket-Number").value);
            console.log(NUM_TICKETS)

            const digiToken = await App.contracts.NFT_TICKET.deployed();
            // await App.toggleMintEnabled();

            for (let i = 0; i < NUM_TICKETS; i++) {
                console.log("Minting")

                try {
                    const result = await digiToken
                        .mint({ from: App.account })


                    console.log("Minted Ticket. Transaction: " + result.transactionHash);
                } catch (mintError) {
                    console.error("Error minting ticket:", mintError.message);
                }
            }
        } catch (error) {
            console.error("Error :", error.message);
        }
    },
}

window.addEventListener('load', () => {
    App.init();
    console.log(App.contracts)
});
