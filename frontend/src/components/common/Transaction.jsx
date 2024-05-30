import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { contractAbi, contractAddress } from "../../constants/constant.js";

const Transaction = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const contractInstance = new ethers.Contract(
            contractAddress,
            contractAbi,
            signer
          );
          const transactions = await contractInstance.getAllTransactions();
          setTransactions(transactions);
        } catch (error) {
          console.error("Error fetching transactions:", error);
        }
      } else {
        console.error("Ethereum provider is not detected");
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div className="container mx-auto">
      <h2 className="font-bold text-2xl flex justify-between items-center p-4 border-b border-gray-700 bg-gradient-to-r from-green-700 to-green-900 text-white">
        Transactions
      </h2>
      <ul className="space-y-4">
        {transactions.map((transaction, index) => (
          <li key={index} className="p-4 border rounded-lg shadow-md bg-white">
            <p className="text-gray-700">
              <span className="font-bold">From:</span> {transaction.sender}
            </p>
            <p className="text-gray-700">
              <span className="font-bold">To:</span> {transaction.reciever}
            </p>
            <p className="text-gray-700">
              <span className="font-bold">Amount:</span>{" "}
              {ethers.utils.formatEther(transaction.amount)} ETH
            </p>
            <p className="text-gray-700">
              <span className="font-bold">Message:</span> {transaction.message}
            </p>
            <p className="text-gray-700">
              <span className="font-bold">Timestamp:</span>{" "}
              {new Date(transaction.timestamp * 1000).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Transaction;
