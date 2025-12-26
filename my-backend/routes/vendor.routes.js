const express = require("express");

module.exports = (db) => {
  const router = express.Router();

  router.get("/:vendorId", (req, res) => {
    db.query(
      "SELECT vendor_id, name, wallet_address, balance FROM vendors WHERE vendor_id=?",
      [req.params.vendorId],
      (err, results) => {
        if (err) return res.status(500).json({ message: "DB error" });
        if (results.length === 0)
          return res.status(404).json({ message: "Vendor not found" });

        res.json(results[0]);
      }
    );
  });

  return router;
};
