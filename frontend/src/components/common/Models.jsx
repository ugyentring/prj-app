import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { contractAbi, contractAddress } from "../../constants/constant.js";

const Models = () => {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
    }
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
      }
    };
  });

  async function addToBlockchain() {
    try {
      if (!provider) {
        console.error("Ethereum provider is not initialized");
        return;
      }

      const receiver = document.getElementById("walletAddress").value;
      const amountEth = document.getElementById("amount").value;
      const amountWei = ethers.utils.parseEther(amountEth);
      const message = document.getElementById("message").value;

      const signer = provider.getSigner();

      const contractInstance = new ethers.Contract(
        contractAddress,
        contractAbi,
        signer
      );
      const transaction = await contractInstance.addToBlockchain(
        receiver,
        amountWei,
        message
      );

      await transaction.wait();
      navigate("/");

      console.log("Transaction successful!");
    } catch (error) {
      console.error("Error executing addToBlockchain:", error);
    }
  }

  //connect metamask wallet
  async function connectToMetamask() {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        console.log("Metamask Connected : " + address);
        setIsConnected(true);
      } catch (err) {
        console.error(err);
      }
    } else {
      console.error("Metamask is not detected in the browser");
    }
  }

  // Handling account change
  function handleAccountsChanged(accounts) {
    if (accounts.length > 0 && account !== accounts[0]) {
      setAccount(accounts[0]);
    } else {
      setIsConnected(false);
      setAccount(null);
    }
  }

  return (
    <div className="mt-20 flex flex-col gap-5 text-black max-w-3xl mx-auto">
      <div className="bg-indigo-600 rounded-xl px-20 py-10 flex flex-col gap-5 items-center mt-20">
        <form className="flex flex-col w-full">
          <input
            type="text"
            id="walletAddress"
            placeholder="Enter the wallet address"
            required
            className="mb-5 p-3 border rounded-md outline-none"
          />
          <input
            type="number"
            id="amount"
            placeholder="Amount in wei"
            required
            className="mb-5 p-3 border rounded-md outline-none"
          />
          <input
            type="text"
            id="message"
            placeholder="Enter your message"
            required
            className="mb-5 p-3 border rounded-md outline-none"
          />
        </form>
      </div>
      <div className="flex flex-col justify-center items-center">
        {!isConnected && (
          <button
            onClick={connectToMetamask}
            className="bg-blue-800 rounded-md py-2 px-4 text-white text-base mb-5"
          >
            Connect Wallet
          </button>
        )}
        {isConnected && (
          <button
            onClick={addToBlockchain}
            className="bg-green-700 rounded-md py-2 px-4 text-white"
          >
            Send Amount
          </button>
        )}
      </div>
    </div>
  );
};

export default Models;
