import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { contractAbi, contractAddress } from "../../constants/constant.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const Models = ({ isOpen, onClose }) => {
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

  function handleAccountsChanged(accounts) {
    if (accounts.length > 0 && account !== accounts[0]) {
      setAccount(accounts[0]);
    } else {
      setIsConnected(false);
      setAccount(null);
    }
  }

  return (
    <dialog id="send_eth_modal" className="modal" open={isOpen}>
      <div className="modal-box bg-white border rounded-md border-gray-300 shadow-md p-6">
        <div className="flex justify-end">
          <button className="btn btn-clear" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        {!isConnected ? (
          <>
            <h3 className="font-bold text-lg mb-4">Connect Wallet</h3>
            <button
              onClick={connectToMetamask}
              className="bg-blue-800 rounded-md py-2 px-4 text-white text-base mb-5"
            >
              Connect Wallet
            </button>
          </>
        ) : (
          <>
            <h3 className="font-bold text-lg mb-4">Send ETH</h3>
            <form
              className="flex flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                addToBlockchain();
              }}
            >
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
                placeholder="Amount in ETH"
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
              <button
                type="submit"
                className="bg-green-700 rounded-md py-2 px-4 text-white"
              >
                Send
              </button>
            </form>
          </>
        )}
      </div>
      <form method="dialog" className="modal-backdrop"></form>
    </dialog>
  );
};

export default Models;
