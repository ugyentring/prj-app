require('dotenv').config();
const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");

const NODE_API_KEY = process.env.PROJECT_ID;
const ALCHEMY_API_KEY = process.env.ALCHEMY_ID;
const MNEMONIC = process.env.MNEMONIC;
const OWNER_ADDRESS = process.env.OWNER_ADDRESS;
const NETWORK = process.env.NETWORK;
const NFT_CONTRACT_ADDRESS = process.env.NFT_CONTRACT_ADDRESS;
const isInfura = !!process.env.INFURA_KEY;
const NUM_TICKETS = 100;

if (!MNEMONIC || !NODE_API_KEY || !OWNER_ADDRESS || !NETWORK) {
  console.error(
    "Please set a mnemonic, Alchemy/Infura key, owner, network, and contract address."
  );
  return;
}

const NFT_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_proxyRegistryAddress",
        "type": "address"
      }
    ],
    "stateMutability": "payable",
    "type": "constructor",
    "payable": true
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "approved",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "Approval",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "operator",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "approved",
        "type": "bool"
      }
    ],
    "name": "ApprovalForAll",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "_fromTokenId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "_toTokenId",
        "type": "uint256"
      }
    ],
    "name": "BatchMetadataUpdate",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "_tokenId",
        "type": "uint256"
      }
    ],
    "name": "MetadataUpdate",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "buyer",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "string",
        "name": "eventID",
        "type": "string"
      }
    ],
    "name": "TicketMinted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "buyer",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "seller",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "TicketPurchased",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "receiver",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "TicketTransfered",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "Transfer",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "baseTokenURI",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "contractURI",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "currentEventID",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "name": "eventIDToTokenCounter",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "eventIDToTokenIds",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "getApproved",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "isMintEnabled",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "maxSupply",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "maxSupplyForCurrentEvent",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "ownerOf",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "proxyRegistryAddress",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "safeTransferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      }
    ],
    "name": "safeTransferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "operator",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "approved",
        "type": "bool"
      }
    ],
    "name": "setApprovalForAll",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes4",
        "name": "interfaceId",
        "type": "bytes4"
      }
    ],
    "name": "supportsInterface",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "ticketBuyers",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "ticketCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "ticketPrice",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "tokenIdToDetails",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "eventId",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "tokenUri",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "transferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "toggleIsMintEnabled",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_maxSupply",
        "type": "uint256"
      }
    ],
    "name": "setMaxSupply",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "mint",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function",
    "payable": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "getBuyerInfo",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "purchaseTicket",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function",
    "payable": true
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "transferTicket",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "getTicketDetails",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_tokenId",
        "type": "uint256"
      }
    ],
    "name": "tokenURI",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "getContractURI",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "operator",
        "type": "address"
      }
    ],
    "name": "isApprovedForAll",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
];

async function toggleMintEnabled() {
  const network =
    NETWORK === "mainnet" || NETWORK === "live" ? "mainnet" : "Sepolia";
  const alchemyURL = isInfura
    ? "https://" + network + ".infura.io/v3/" + NODE_API_KEY
    : "https://eth-" + network + ".g.alchemy.com/v2/" + ALCHEMY_API_KEY;
  try {
    const provider = new HDWalletProvider(MNEMONIC, alchemyURL);
    const web3Instance = new Web3(provider);
    const nftContract = new web3Instance.eth.Contract(
      NFT_ABI,
      NFT_CONTRACT_ADDRESS,
      { gasLimit: "1000000" }
    );

    const result = await nftContract.methods
      .toggleIsMintEnabled()
      .send({ from: OWNER_ADDRESS });

    console.log("Toggled Mint Enabled. Transaction: " + result.transactionHash);
  } catch (toggleError) {
    console.error("Error toggling mint enabled:", toggleError.message);
  }
}

async function purchaseTicketFunction(tokenId) {
  const network =
    NETWORK === "mainnet" || NETWORK === "live" ? "mainnet" : "Sepolia";
  const alchemyURL = isInfura
    ? "https://" + network + ".infura.io/v3/" + NODE_API_KEY
    : "https://eth-" + network + ".g.alchemy.com/v2/" + ALCHEMY_API_KEY;
  try {
    const provider = new HDWalletProvider(MNEMONIC, alchemyURL);
    const web3Instance = new Web3(provider);
    const nftContract = new web3Instance.eth.Contract(
      NFT_ABI,
      NFT_CONTRACT_ADDRESS,
      { gasLimit: "1000000" }
    );
    const result = await nftContract.methods
      .purchaseTicket(tokenId)
      .send({ from: OWNER_ADDRESS, value: ticketPrice });

    console.log("Purchased Ticket. Transaction: " + result.transactionHash);
  } catch (purchaseTicketError) {
    console.error("Error purchasing ticket:", purchaseTicketError.message);
  }
}

async function getBuyerInfoFunction(tokenId) {
  const network =
    NETWORK === "mainnet" || NETWORK === "live" ? "mainnet" : "Sepolia";
  const alchemyURL = isInfura
    ? "https://" + network + ".infura.io/v3/" + NODE_API_KEY
    : "https://eth-" + network + ".g.alchemy.com/v2/" + ALCHEMY_API_KEY;
  try {
    const provider = new HDWalletProvider(MNEMONIC, alchemyURL);
    const web3Instance = new Web3(provider);
    const nftContract = new web3Instance.eth.Contract(
      NFT_ABI,
      NFT_CONTRACT_ADDRESS,
      { gasLimit: "1000000" }
    );
    const buyerInfo = await nftContract.methods.getBuyerInfo(tokenId).call();

    console.log(`Buyer Info for Token ID ${tokenId}: ${buyerInfo}`);
  } catch (getBuyerInfoError) {
    console.error("Error getting buyer info:", getBuyerInfoError.message);
  }
}
async function transferTicketFunction(toAddress, tokenId) {
  const network =
    NETWORK === "mainnet" || NETWORK === "live" ? "mainnet" : "Sepolia";
  const alchemyURL = isInfura
    ? "https://" + network + ".infura.io/v3/" + NODE_API_KEY
    : "https://eth-" + network + ".alchemyapi.io/v2/" + ALCHEMY_API_KEY;

  try {
    const provider = new HDWalletProvider(MNEMONIC, alchemyURL);
    const web3Instance = new Web3(provider);
    const nftContract = new web3Instance.eth.Contract(
      NFT_ABI,
      NFT_CONTRACT_ADDRESS,
      { gasLimit: "1000000" }
    );

    const result = await nftContract.methods
      .transferTicket(toAddress, tokenId)
      .send({ from: OWNER_ADDRESS });

    console.log(
      `Transferred Ticket ${tokenId} to ${toAddress}. Transaction: ${result.transactionHash}`
    );
  } catch (transferError) {
    console.error("Error transferring ticket:", transferError.message);
  }
}

async function getTicketDetailsFunction(tokenId) {
  const network =
    NETWORK === "mainnet" || NETWORK === "live" ? "mainnet" : "Sepolia";
  const alchemyURL = isInfura
    ? "https://" + network + ".infura.io/v3/" + NODE_API_KEY
    : "https://eth-" + network + ".alchemyapi.io/v2/" + ALCHEMY_API_KEY;

  try {
    const provider = new HDWalletProvider(MNEMONIC, alchemyURL);
    const web3Instance = new Web3(provider);
    const nftContract = new web3Instance.eth.Contract(
      NFT_ABI,
      NFT_CONTRACT_ADDRESS,
      { gasLimit: "1000000" }
    );

    const details = await nftContract.methods
      .getTicketDetails(tokenId)
      .call();

    console.log(
      `Details for Ticket ${tokenId}:`,
      details[0], 
      details[1], 
      details[2]  
    );
  } catch (detailsError) {
    console.error("Error getting ticket details:", detailsError.message);
  }
}

async function main() {
  const network =
    NETWORK === "mainnet" || NETWORK === "live" ? "mainnet" : "Sepolia";
  const alchemyURL = isInfura
    ? "https://" + network + ".infura.io/v3/" + NODE_API_KEY
    : "https://eth-" + network + ".g.alchemy.com/v2/" + ALCHEMY_API_KEY;

  try {
    const provider = new HDWalletProvider(MNEMONIC, alchemyURL);
    const web3Instance = new Web3(provider);

    const nftContract = new web3Instance.eth.Contract(
      NFT_ABI,
      NFT_CONTRACT_ADDRESS,
      { gasLimit: "1000000" }
    );
    await toggleMintEnabled();
    // await purchaseTicketFunction(TOKEN_ID_TO_PURCHASE);
    // await getTicketDetailsFunction(TOKEN_ID_DETAILS);
    // await transferTicketFunction(TO_ADDRESS, TOKEN_ID_TO_TRANSFER);
    // await getBuyerInfoFunction(TOKEN_ID_TO_GET_BUYER_INFO);

    for (let i = 0; i < NUM_TICKETS; i++) {
      try {
        const result = await nftContract.methods
          .mint()
          .send({ from: OWNER_ADDRESS });

        console.log("Minted Ticket. Transaction: " + result.transactionHash);
      } catch (mintError) {
        console.error("Error minting ticket:", mintError.message);
      }
    }
  } catch (error) {
    console.error("Error connecting to Alchemy:", error.message);
  }
}

// Handle unhandled promise rejections globally
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

main();
