const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Transaction", function () {
  let Transaction;
  let transaction;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    Transaction = await ethers.getContractFactory("Transaction");
    [owner, addr1, addr2] = await ethers.getSigners();
    transaction = await Transaction.deploy();
    await transaction.deployed();
  });

  it("Should start with zero transaction count", async function () {
    expect(await transaction.getTransactionCount()).to.equal(0);
  });

  it("Should add a transaction to the blockchain", async function () {
    const tx = await transaction.connect(addr1).addToBlockchain(
      addr2.address,
      ethers.utils.parseEther("1.0"),
      "Test Transaction"
    );
    await tx.wait();

    const transactionCount = await transaction.getTransactionCount();
    expect(transactionCount).to.equal(1);

    const allTransactions = await transaction.getAllTransactions();
    expect(allTransactions.length).to.equal(1);
    expect(allTransactions[0].sender).to.equal(addr1.address);
    expect(allTransactions[0].receiver).to.equal(addr2.address);
    expect(allTransactions[0].amount.toString()).to.equal(ethers.utils.parseEther("1.0").toString());
    expect(allTransactions[0].message).to.equal("Test Transaction");
  });

  it("Should emit a Transfer event when a transaction is added", async function () {
    await expect(
      transaction.connect(addr1).addToBlockchain(
        addr2.address,
        ethers.utils.parseEther("1.0"),
        "Test Transaction"
      )
    )
      .to.emit(transaction, "Transfer")
      .withArgs(
        addr1.address,
        addr2.address,
        ethers.utils.parseEther("1.0"),
        "Test Transaction",
        await ethers.provider.getBlockNumber() // block timestamp is more accurate than block number
      );
  });

  it("Should return all transactions", async function () {
    await transaction.connect(addr1).addToBlockchain(
      addr2.address,
      ethers.utils.parseEther("1.0"),
      "First Transaction"
    );

    await transaction.connect(addr2).addToBlockchain(
      addr1.address,
      ethers.utils.parseEther("2.0"),
      "Second Transaction"
    );

    const allTransactions = await transaction.getAllTransactions();
    expect(allTransactions.length).to.equal(2);

    expect(allTransactions[0].sender).to.equal(addr1.address);
    expect(allTransactions[0].receiver).to.equal(addr2.address);
    expect(allTransactions[0].amount.toString()).to.equal(ethers.utils.parseEther("1.0").toString());
    expect(allTransactions[0].message).to.equal("First Transaction");

    expect(allTransactions[1].sender).to.equal(addr2.address);
    expect(allTransactions[1].receiver).to.equal(addr1.address);
    expect(allTransactions[1].amount.toString()).to.equal(ethers.utils.parseEther("2.0").toString());
    expect(allTransactions[1].message).to.equal("Second Transaction");
  });
});
