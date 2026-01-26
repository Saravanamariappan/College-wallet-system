import { expect } from "chai";
import { ethers } from "hardhat";
describe("KGISLCollegeToken", function () {
  let Token;
  let token;
  let admin, backend, student, vendor, outsider;

  beforeEach(async function () {
    [admin, backend, student, vendor, outsider] = await ethers.getSigners();

    Token = await ethers.getContractFactory("KGISLCollegeToken");
    token = await Token.connect(admin).deploy(backend.address);
    await token.waitForDeployment();
  });

  /* ================= DEPLOYMENT ================= */

  it("should set admin and backend correctly", async function () {
    expect(await token.admin()).to.equal(admin.address);
    expect(await token.backend()).to.equal(backend.address);
  });

  it("should start with zero total supply", async function () {
    expect(await token.totalSupply()).to.equal(0);
  });

  /* ================= ADMIN CONTROLS ================= */

  it("admin can register student", async function () {
    await token.registerStudent(student.address);
    expect(await token.isStudent(student.address)).to.equal(true);
  });

  it("admin can register vendor", async function () {
    await token.registerVendor(vendor.address);
    expect(await token.isVendor(vendor.address)).to.equal(true);
  });

  it("non-admin cannot register student", async function () {
    await expect(
      token.connect(outsider).registerStudent(student.address)
    ).to.be.revertedWith("Only admin");
  });

  /* ================= MINTING ================= */

  it("admin can mint tokens to student", async function () {
    await token.registerStudent(student.address);
    await token.mint(student.address, 100);

    const balance = await token.balanceOf(student.address);
    expect(balance).to.equal(ethers.parseEther("100"));
  });

  it("cannot mint to non-student", async function () {
    await expect(
      token.mint(student.address, 50)
    ).to.be.revertedWith("Not student");
  });

  /* ================= STUDENT → VENDOR ================= */

  it("backend can transfer tokens from student to vendor", async function () {
    await token.registerStudent(student.address);
    await token.registerVendor(vendor.address);
    await token.mint(student.address, 100);

    await token
      .connect(backend)
      .studentSpend(student.address, vendor.address, 40);

    expect(await token.balanceOf(student.address))
      .to.equal(ethers.parseEther("60"));

    expect(await token.balanceOf(vendor.address))
      .to.equal(ethers.parseEther("40"));
  });

  it("student cannot spend directly (backend only)", async function () {
    await expect(
      token.studentSpend(student.address, vendor.address, 10)
    ).to.be.revertedWith("Only backend");
  });

  /* ================= VENDOR → ADMIN ================= */

  it("backend can move vendor funds to admin", async function () {
    await token.registerStudent(student.address);
    await token.registerVendor(vendor.address);
    await token.mint(student.address, 100);

    await token
      .connect(backend)
      .studentSpend(student.address, vendor.address, 50);

    await token
      .connect(backend)
      .vendorPayAdmin(vendor.address, 20);

    expect(await token.balanceOf(vendor.address))
      .to.equal(ethers.parseEther("30"));

    expect(await token.balanceOf(admin.address))
      .to.equal(ethers.parseEther("20"));
  });

  /* ================= FAILURE CASES ================= */

  it("should fail if student has insufficient balance", async function () {
    await token.registerStudent(student.address);
    await token.registerVendor(vendor.address);

    await expect(
      token
        .connect(backend)
        .studentSpend(student.address, vendor.address, 10)
    ).to.be.revertedWith("Insufficient balance");
  });
});