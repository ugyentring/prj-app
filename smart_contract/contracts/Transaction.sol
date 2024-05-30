// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

contract Transaction {
    uint256 transactionCount;

    event Transfer(
        address from,
        address reciever,
        uint amt,
        string message,
        uint256 timestamp
    );

    struct TransferStruct {
        address sender;
        address reciever;
        uint amount;
        string message;
        uint256 timestamp;
    }

    TransferStruct[] transactions;

    function addToBlockchain(
        address payable receiver,
        uint amount,
        string memory message
    ) public payable {
        require(
            msg.value == amount,
            "Sent value must match the specified amount"
        );

        transactionCount += 1;
        transactions.push(
            TransferStruct(
                msg.sender,
                receiver,
                amount,
                message,
                block.timestamp
            )
        );

        receiver.transfer(amount);

        emit Transfer(msg.sender, receiver, amount, message, block.timestamp);
    }

    function getAllTransactions()
        public
        view
        returns (TransferStruct[] memory)
    {
        return transactions;
    }

    function getTransactionCount() public view returns (uint256) {
        return transactionCount;
    }
}
