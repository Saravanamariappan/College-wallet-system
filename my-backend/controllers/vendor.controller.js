const db = require("../db");

exports.getVendor = async (req, res) => {
  const { vendor_id } = req.params;

  const [rows] = await db.promise().query(
    "SELECT * FROM vendors WHERE vendor_id = ?",
    [vendor_id]
  );

  res.json(rows[0]);
};
