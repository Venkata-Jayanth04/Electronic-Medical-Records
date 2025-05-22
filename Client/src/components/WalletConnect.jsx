import React, { useState, useEffect } from "react";
import Web3 from "web3";

export default function WalletConnect({ onConnected }) {
  const [account, setAccount] = useState(null);
  const [networkError, setNetworkError] = useState(null);

  const LOCALHOST_CHAIN_ID = "0x539"; // Hex of 1337

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask not detected!");
      return;
    }

    try {
      const chainId = await window.ethereum.request({ method: "eth_chainId" });
      if (chainId !== LOCALHOST_CHAIN_ID) {
        setNetworkError("Wrong network! Switching to Localhost 8545...");
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: LOCALHOST_CHAIN_ID }],
        });
      }

      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setAccount(accounts[0]);
      setNetworkError(null);
      onConnected(accounts[0]);
    } catch (err) {
      console.error(err);
      setNetworkError("Failed to connect wallet.");
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        setAccount(accounts[0] || null);
      });
    }
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "10px" }}>
      {!account ? (
        <button onClick={connectWallet} style={btnStyle}>Connect MetaMask</button>
      ) : (
        <p style={{ color: "#4CAF50" }}>Connected: {account.slice(0, 6)}...{account.slice(-4)}</p>
      )}
      {networkError && <p style={{ color: "red" }}>{networkError}</p>}
    </div>
  );
}

const btnStyle = {
  padding: "10px 20px",
  backgroundColor: "#FF6F00",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};
