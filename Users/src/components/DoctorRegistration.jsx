import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getWeb3, getContract } from "../utils/blockchain";
import "../css/common.css";

const DoctorRegistration = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    specialization: "",
    email: "",
    phoneNumber: "",
  });

  const [account, setAccount] = useState(null);
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  // Connect MetaMask wallet and set account
  const connectWallet = async () => {
    try {
      const web3 = await getWeb3();
      if (!web3) {
        setStatus("Please install MetaMask.");
        return;
      }
      const accounts = await web3.eth.getAccounts();
      if (!accounts.length) {
        setStatus("Please connect your MetaMask wallet.");
        return;
      }
      setAccount(accounts[0]);
      setStatus("Wallet connected: " + accounts[0]);
    } catch (err) {
      setStatus("Failed to connect wallet.");
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit registration transaction with proper async/await and gas estimation
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!account) {
      setStatus("Connect your wallet first!");
      return;
    }
    setStatus("Submitting transaction...");
    try {
      const web3 = await getWeb3();
      const contract = await getContract(web3);

      // Estimate gas to catch errors early and help MetaMask prompt reliably
      const gas = await contract.methods
        .registerDoctor(
          form.firstName,
          form.lastName,
          form.specialization,
          form.email,
          form.phoneNumber
        )
        .estimateGas({ from: account });

      // Send transaction and await confirmation to trigger MetaMask popup
      await contract.methods
        .registerDoctor(
          form.firstName,
          form.lastName,
          form.specialization,
          form.email,
          form.phoneNumber
        )
        .send({ from: account, gas });

      setStatus("Registration successful!");
      navigate("/doctor/dashboard");
    } catch (error) {
      console.error(error);
      setStatus("Registration failed. " + (error.message || ""));
    }
  };

  return (
    <div className="registration-container">
      <h2>Doctor Registration</h2>
      {!account ? (
        <button className="btn-connect" onClick={connectWallet}>
          Connect MetaMask Wallet
        </button>
      ) : (
        <p>Connected account: {account}</p>
      )}

      <form onSubmit={handleSubmit}>
        <input
          name="firstName"
          placeholder="First Name"
          onChange={handleChange}
          required
        />
        <input
          name="lastName"
          placeholder="Last Name"
          onChange={handleChange}
          required
        />
        <input
          name="specialization"
          placeholder="Specialization"
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          name="phoneNumber"
          placeholder="Phone Number"
          onChange={handleChange}
          required
        />
        <button type="submit" className="btn-submit">
          Register Doctor
        </button>
      </form>
      <p className="status-message">{status}</p>
    </div>
  );
};

export default DoctorRegistration;
