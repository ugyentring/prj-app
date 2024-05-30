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
    <div>
      <h2>Transactions</h2>
      <ul>
        {transactions.map((transaction, index) => (
          <li key={index}>
            <p>From: {transaction.sender}</p>
            <p>To: {transaction.reciever}</p>
            <p>Amount: {ethers.utils.formatEther(transaction.amount)} ETH</p>
            <p>Message: {transaction.message}</p>
            <p>
              Timestamp:{" "}
              {new Date(transaction.timestamp * 1000).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Transaction;
