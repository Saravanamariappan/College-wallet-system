const contract = require("../../db");

exports.studentPayVendor = async (req, res) => {
  try {
    const { studentWallet, vendorWallet, amount } = req.body;

    const tx = await contract.studentSpend(
      studentWallet,
      vendorWallet,
      amount
    );

    await tx.wait();

    res.json({
      message: "Payment successful",
      txHash: tx.hash,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBalance = async (req, res) => {
  try {
    const balance = await contract.getBalance(req.params.address);
    res.json({ balance: balance.toString() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getTransactions = async (req, res) => {
  try {
    const { wallet } = req.params;

    // Read Transfer events
    const filter = contract.filters.Transfer(wallet, null);
    const sent = await contract.queryFilter(filter);

    const filter2 = contract.filters.Transfer(null, wallet);
    const received = await contract.queryFilter(filter2);

    const txs = [...sent, ...received]
      .map(tx => ({
        from: tx.args.from,
        to: tx.args.to,
        amount: tx.args.value.toString(),
        txHash: tx.transactionHash,
        blockNumber: tx.blockNumber,
      }))
      .sort((a, b) => b.blockNumber - a.blockNumber);

    res.json(txs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
