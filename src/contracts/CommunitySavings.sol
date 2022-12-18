// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

contract CommunitySaving {
    uint256 public totalBalance;
    address public owner;

    uint256 public userLength;

    mapping(address => uint256) public userBalances;
    Transaction[] public transactions;

    struct Transaction {
        address addr;
        int256 amount; //+ve for credit, -ve for debit
        uint256 timestamp;
    }

    constructor() {
        owner = msg.sender;
    }

    receive() external payable {
        uint256 amount = msg.value;

        // update transactions
        _createTransactionRecord(msg.sender, int256(amount));

        // update user balance
        _updateUserBalances(msg.sender, amount);

        // increment total balance
        totalBalance += amount;
    }

    function getTransactions() public view returns (Transaction[] memory) {
        return transactions;
    }

    function getUserCount() public view returns (uint256) {
        return userLength;
    }

    function getAmountSavedByUser() public view returns (uint256) {
        return userBalances[msg.sender];
    }

    function withdraw(uint256 amount, address payable destAddr) public {
        require(amount <= totalBalance, "Insufficient funds");
        require(msg.sender == owner, "Only owner can withdraw");

        // transfer amount to destination
        destAddr.transfer(amount);

        // update transactions
        _createTransactionRecord(msg.sender, -int256(amount));

        // decrement total balance
        totalBalance -= amount;
    }

    function _createTransactionRecord(address userAddr, int256 amount) private {
        Transaction memory newTransaction = Transaction(
            userAddr,
            amount,
            block.timestamp
        );
        transactions.push(newTransaction);
    }

    function _updateUserBalances(address userAddr, uint256 amount) private {
        uint256 initial = userBalances[userAddr];

        if (initial == 0) {
            // user hasn't saved before

            userLength += 1;
            userBalances[userAddr] = amount;
        } else {
            // user has saved before

            uint256 newAmount = initial + amount;
            userBalances[userAddr] = newAmount;
        }
    }
}
