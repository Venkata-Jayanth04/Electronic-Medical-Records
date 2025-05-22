// src/pages/RegisterPatient.jsx
import React, { useState } from "react";
import { initWeb3, contract, web3 } from "../utils/web3";
import Navbar from "../components/Navbar";

export default function RegisterPatient() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const register = async () => {
    if (!name || !email) {
      setMessage("Please fill out both fields.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      await initWeb3();
      const accounts = await web3.eth.getAccounts();
      await contract.methods.registerPatient(name, email).send({ from: accounts[0] });

      setMessage("✅ Patient Registered Successfully!");
      setName("");
      setEmail("");
    } catch (error) {
      console.error(error);
      setMessage("❌ Registration failed. Please check MetaMask and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.title}>Register as a Patient</h2>
        <div style={styles.formBox}>
          <input
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
          />
          <input
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />
          <button onClick={register} disabled={loading} style={styles.button}>
            {loading ? "Registering..." : "Register"}
          </button>
          {message && <p style={{ ...styles.message, color: message.includes("✅") ? "green" : "red" }}>{message}</p>}
        </div>
      </div>
    </>
  );
}

const styles = {
  container: {
    padding: "30px",
    maxWidth: "400px",
    margin: "0 auto",
    fontFamily: "Segoe UI, sans-serif",
    textAlign: "center",
  },
  title: {
    color: "#4CAF50",
    marginBottom: "20px",
  },
  formBox: {
    backgroundColor: "#f9f9f9",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "14px",
  },
  button: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: "pointer",
  },
  message: {
    marginTop: "15px",
    fontWeight: "bold",
  },
};
