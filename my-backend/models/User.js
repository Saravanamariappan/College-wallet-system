const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  collegeId: String,
  role: {
    type: String,
    enum: ["student", "vendor", "admin"],
  },
  walletAddress: String,
});

module.exports = mongoose.model("User", userSchema);
