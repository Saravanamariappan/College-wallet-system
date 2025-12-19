// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract StudentWallet {
    address public owner;
    uint256 public balance;

    constructor() {
        owner = msg.sender;
    }

    function addFunds() public payable {
        balance += msg.value;
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function withdraw(uint256 amount) public {
        require(msg.sender == owner, "Only owner can withdraw");
        require(amount <= address(this).balance, "Insufficient balance");

        payable(owner).transfer(amount);
    }
}
