// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

contract CommunitySaving {
    uint256 public totalBalance;
    address public owner;

    mapping(address => uint256) public amountSavedByUsers;
    Transaction[] public transactions;

    struct Transaction {
        address addr;
        int256 amount; //+ve for credit, -ve for debit
    }

    constructor() {
        owner = msg.sender;
    }

    receive() external payable {
        uint256 amount = msg.value;

        // update transactions
        _createTransactionRecord(msg.sender, int256(amount));

        // update user balance
        _updateAmountSavedByUsers(msg.sender, amount);

        // increment total balance
        totalBalance += amount;
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
        Transaction memory newTransaction = Transaction(userAddr, amount);
        transactions.push(newTransaction);
    }

    function _updateAmountSavedByUsers(address userAddr, uint256 amount)
        private
    {
        uint256 initial = amountSavedByUsers[userAddr];

        uint256 newAmount = initial + amount;
        amountSavedByUsers[userAddr] = newAmount;
    }
}
