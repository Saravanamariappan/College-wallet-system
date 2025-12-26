// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract KGISLCollegeToken {

    string public name = "KGISL College Token";
    string public symbol = "KGCT";
    uint8 public decimals = 18;
    uint public totalSupply;

    address public admin;
    address public backend;

    mapping(address => uint) public balanceOf;
    mapping(address => bool) public isStudent;
    mapping(address => bool) public isVendor;

    event Transfer(address indexed from, address indexed to, uint value);
    event Mint(address indexed to, uint value);
    event StudentRegistered(address student);
    event VendorRegistered(address vendor);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }

    modifier onlyBackend() {
        require(msg.sender == backend, "Only backend");
        _;
    }

    constructor(address _backend) {
        admin = msg.sender;
        backend = _backend;
    }

    function registerStudent(address student) external onlyAdmin {
        require(student != address(0), "Invalid address");
        isStudent[student] = true;
        emit StudentRegistered(student);
    }

    function registerVendor(address vendor) external onlyAdmin {
        require(vendor != address(0), "Invalid address");
        isVendor[vendor] = true;
        emit VendorRegistered(vendor);
    }

    function mint(address student, uint amount) external onlyAdmin {
        require(isStudent[student], "Not student");
        uint tokenAmount = amount * (10 ** decimals);
        balanceOf[student] += tokenAmount;
        totalSupply += tokenAmount;
        emit Mint(student, tokenAmount);
        emit Transfer(address(0), student, tokenAmount);
    }

    function studentSpend(
        address student,
        address vendor,
        uint amount
    ) external onlyBackend {
        require(isStudent[student], "Invalid student");
        require(isVendor[vendor], "Invalid vendor");

        uint tokenAmount = amount * (10 ** decimals);
        require(balanceOf[student] >= tokenAmount, "Insufficient balance");

        balanceOf[student] -= tokenAmount;
        balanceOf[vendor] += tokenAmount;

        emit Transfer(student, vendor, tokenAmount);
    }

    function getBalance(address user) external view returns (uint) {
        return balanceOf[user];
    }
}
