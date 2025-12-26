import { useState } from "react";

export default function SendTokens({ studentWallet }) {
  const [vendorWallet, setVendorWallet] = useState("");
  const [amount, setAmount] = useState("");

  const send = async () => {
    await fetch("/api/blockchain/student-pay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentWallet,
        vendorWallet,
        amount,
      }),
    });

    alert("Payment Successful");
  };

  return (
    <div>
      <input
        placeholder="Vendor Wallet Address"
        onChange={e => setVendorWallet(e.target.value)}
      />
      <input
        placeholder="Amount"
        onChange={e => setAmount(e.target.value)}
      />
      <button onClick={send}>Pay Vendor</button>
    </div>
  );
}
