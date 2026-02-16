// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract KGISLCollegeToken {

    /* ================= METADATA ================= */
    string public name = "KGISL College Token";
    string public symbol = "KGCT";
    uint8 public decimals = 18;
    uint256 public totalSupply;

    /* ================= ROLES ================= */
    address public admin;
    address public backend;

    /* ================= STORAGE ================= */
    mapping(address => uint256) public balanceOf;
    mapping(address => bool) public isStudent;
    mapping(address => bool) public isVendor;

    /* ================= EVENTS ================= */
    event Mint(address indexed to, uint256 amount);
    event Transfer(address indexed from, address indexed to, uint256 amount);
    event StudentRegistered(address student);
    event VendorRegistered(address vendor);

    /* ================= MODIFIERS ================= */
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }

    modifier onlyBackend() {
        require(msg.sender == backend, "Only backend");
        _;
    }

    /* ================= CONSTRUCTOR ================= */
    constructor(address _backend) {
        require(_backend != address(0), "Invalid backend");
        admin = msg.sender;
        backend = _backend;
    }

    /* ================= ADMIN FUNCTIONS ================= */

    function registerStudent(address student) external onlyAdmin {

        require(student != address(0), "Invalid address");
        require(!isStudent[student], "Already student");

        isStudent[student] = true;

        emit StudentRegistered(student);
    }

    function registerVendor(address vendor) external onlyAdmin {

        require(vendor != address(0), "Invalid address");
        require(!isVendor[vendor], "Already vendor");

        isVendor[vendor] = true;

        emit VendorRegistered(vendor);
    }

    /* ADMIN MINT NEW TOKENS */
    function mint(address student, uint256 amount) external onlyAdmin {

        require(isStudent[student], "Not student");
        require(amount > 0, "Invalid amount");

        uint256 tokens = amount * (10 ** decimals);

        balanceOf[student] += tokens;
        totalSupply += tokens;

        emit Mint(student, tokens);
    }

    /* ADMIN SEND EXISTING TOKENS */
    function adminSendToStudent(
        address student,
        uint256 amount
    ) external onlyAdmin {

        require(isStudent[student], "Not student");
        require(amount > 0, "Invalid amount");

        uint256 tokens = amount * (10 ** decimals);

        require(balanceOf[admin] >= tokens, "Admin insufficient balance");

        balanceOf[admin] -= tokens;
        balanceOf[student] += tokens;

        emit Transfer(admin, student, tokens);
    }

    /* ================= STUDENT → VENDOR ================= */

    function studentSpend(
        address student,
        address vendor,
        uint256 amount
    ) external onlyBackend {

        require(isStudent[student], "Invalid student");
        require(isVendor[vendor], "Invalid vendor");

        uint256 tokens = amount * (10 ** decimals);

        require(balanceOf[student] >= tokens, "Insufficient balance");

        balanceOf[student] -= tokens;
        balanceOf[vendor] += tokens;

        emit Transfer(student, vendor, tokens);
    }

    /* ================= VENDOR → ADMIN ================= */

    function vendorPayAdmin(
        address vendor,
        uint256 amount
    ) external onlyBackend {

        require(isVendor[vendor], "Invalid vendor");

        uint256 tokens = amount * (10 ** decimals);

        require(balanceOf[vendor] >= tokens, "Insufficient balance");

        balanceOf[vendor] -= tokens;
        balanceOf[admin] += tokens;

        emit Transfer(vendor, admin, tokens);
    }

    /* ================= VIEW ================= */

    function getBalance(address user) external view returns (uint256) {
        return balanceOf[user];
    }

}
