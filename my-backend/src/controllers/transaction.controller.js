import {db }from "../config/db.js";


/* CREATE */
export const createTransaction = async (req, res) => {
  try {
    const { studentAddress, vendorAddress, amount, txHash } = req.body;

    if (!studentAddress || !vendorAddress || !amount || !txHash) {
      return res.status(400).json({ error: "Missing data" });
    }

    const explorerLink = `https://amoy.polygonscan.com/tx/${txHash}`;

    await db.execute(
      `INSERT INTO transactions
       (student_wallet, vendor_wallet, amount, tx_hash, explorer_link, status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        studentAddress,
        vendorAddress,
        amount,
        txHash,
        explorerLink,
        "SUCCESS",
      ]
    );

    res.json({
      message: "Transaction stored successfully",
      txHash,
      verifyLink: explorerLink,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* STUDENT HISTORY */
export const getStudentTransactions = async (req, res) => {
  const { address } = req.params;

  const [rows] = await db.execute(
    `SELECT 
      id,
      student_wallet AS studentWallet,
      vendor_wallet AS vendorWallet,
      amount,
      tx_hash AS txHash,
      status,
      created_at AS createdAt
     FROM transactions
     WHERE student_wallet = ? OR vendor_wallet = ?
     ORDER BY created_at DESC`,
    [address, address]
  );

  res.json(rows);
};

/* VENDOR HISTORY */
export const getVendorTransactions = async (req, res) => {
  const { address } = req.params;

  const [rows] = await db.execute(
    `SELECT 
      id,
      student_wallet AS studentWallet,
      vendor_wallet AS vendorWallet,
      amount,
      tx_hash AS txHash,
      status,
      created_at AS createdAt
     FROM transactions
     WHERE vendor_wallet = ?
     ORDER BY created_at DESC`,
    [address]
  );

  res.json(rows);
};
