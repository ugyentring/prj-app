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
    addToBlockchain();
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

  async function addToBlockchain(receiver, amount, message) {
    try {
      if (!provider) {
        console.error("Ethereum provider is not initialized");
        return;
      }
      const signer = provider.getSigner();

      const contractInstance = new ethers.Contract(
        contractAddress,
        contractAbi,
        signer
      );
      const transaction = await contractInstance.addToBlockchain(
        receiver,
        amount,
        message
      );

      await transaction.wait();

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
    <div className="mt-10 flex flex-col gap-5 text-black">
      <div className="bg-indigo-600 rounded-xl px-20 py-10 flex flex-col gap-5 items-center mx-4">
        <form className="flex flex-col">
          <input
            type="text"
            placeholder="Enter the wallet address"
            required
            style={{
              marginBottom: "10px",
              padding: "5px",
              border: "none",
              outline: "none",
              borderRadius: "2px",
            }}
          />
          <input
            type="number"
            placeholder="Enter the amount"
            required
            style={{
              marginBottom: "10px",
              padding: "5px",
              border: "none",
              outline: "none",
              borderRadius: "2px",
            }}
          />
          <input
            type="text"
            placeholder="Enter your message"
            required
            style={{
              marginBottom: "10px",
              padding: "5px",
              border: "none",
              outline: "none",
              borderRadius: "2px",
            }}
          />
        </form>
      </div>
      <div className="flex flex-col justify-center items-center">
        {!isConnected && (
          <button
            onClick={connectToMetamask}
            className="bg-blue-800 rounded-md py-1 w-30 text-white px-2"
          >
            Connect Wallet
          </button>
        )}

        <br />
        <button className="bg-green-700 rounded-md py-1 w-30 text-white px-3">
          Send Amount
        </button>
      </div>
    </div>
  );
};

export default Models;
