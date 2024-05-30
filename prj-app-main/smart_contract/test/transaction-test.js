const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Transaction", function () {
  let Transaction;
  let transaction;
  let owner;
  let addr1;

  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    Transaction = await ethers.getContractFactory("Transaction");
    [owner, addr1] = await ethers.getSigners();

    // To deploy our contract
    transaction = await Transaction.deploy();
    await transaction.deployed();
  });

  describe("Transactions", function () {
    it("Should initialize with zero transactions", async function () {
      expect(await transaction.getTransactionCount()).to.equal(0);
    });

    it("Should add a transaction to the blockchain", async function () {
      await transaction.addToBlockchain(addr1.address, 100, "First transaction");

      const transactions = await transaction.getAllTransactions();
      expect(transactions.length).to.equal(1);
      expect(transactions[0].sender).to.equal(owner.address);
      expect(transactions[0].reciever).to.equal(addr1.address);
      expect(transactions[0].amount).to.equal(100);
      expect(transactions[0].message).to.equal("First transaction");
    });

    it("Should emit Transfer event when adding a transaction", async function () {
      await expect(transaction.addToBlockchain(addr1.address, 100, "First transaction"))
        .to.emit(transaction, "Transfer")
        .withArgs(owner.address, addr1.address, 100, "First transaction", await ethers.provider.getBlock('latest').then(block => block.timestamp));
    });

    it("Should return the correct number of transactions", async function () {
      await transaction.addToBlockchain(addr1.address, 100, "First transaction");
      await transaction.addToBlockchain(addr1.address, 200, "Second transaction");

      expect(await transaction.getTransactionCount()).to.equal(2);
    });
  });
});
