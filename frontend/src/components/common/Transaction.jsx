import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { contractAbi, contractAddress } from "../../constants/constant.js";
import { RiExchangeLine } from "react-icons/ri";

const Transaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

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
      }
      setLoading(false);
    };

    fetchTransactions();
  }, []);

  const shorten = (addr) =>
    addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";

  return (
    <div className="flex flex-col gap-4">
      <div className="nn-card p-6 flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
          <RiExchangeLine className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">
            Transactions
          </h1>
          <p className="text-sm text-slate-500">
            All on-chain awards across the network.
          </p>
        </div>
      </div>

      {loading && (
        <div className="nn-card p-10 text-center text-slate-500 text-sm">
          Loading transactions...
        </div>
      )}

      {!loading && transactions.length === 0 && (
        <div className="nn-card p-10 text-center">
          <p className="font-semibold text-slate-900">No transactions yet</p>
          <p className="text-sm text-slate-500 mt-1">
            Awards sent on-chain will appear here.
          </p>
        </div>
      )}

      <ul className="grid gap-3">
        {transactions.map((transaction, index) => (
          <li key={index} className="nn-card p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="nn-chip">
                {ethers.utils.formatEther(transaction.amount)} ETH
              </span>
              <span className="text-xs text-slate-500">
                {new Date(transaction.timestamp * 1000).toLocaleString()}
              </span>
            </div>
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400 font-semibold mb-1">
                  From
                </p>
                <p
                  className="font-mono text-slate-700"
                  title={transaction.sender}
                >
                  {shorten(transaction.sender)}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400 font-semibold mb-1">
                  To
                </p>
                <p
                  className="font-mono text-slate-700"
                  title={transaction.reciever}
                >
                  {shorten(transaction.reciever)}
                </p>
              </div>
            </div>
            {transaction.message && (
              <div className="mt-3 pt-3 border-t border-slate-100">
                <p className="text-xs uppercase tracking-wide text-slate-400 font-semibold mb-1">
                  Message
                </p>
                <p className="text-slate-700 text-sm">{transaction.message}</p>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Transaction;
