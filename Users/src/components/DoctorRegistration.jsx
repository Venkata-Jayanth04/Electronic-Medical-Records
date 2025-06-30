import React, { useState } from "react";
import "../css/DoctorRegistration.css";
import { useNavigate } from "react-router-dom";
import { getWeb3, getContract } from "../utils/blockchain";

const DoctorRegistration = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    specialization: "",
    email: "",
    phoneNumber: "",
    licenseNumber: "",
    experienceYears: "",
    address: "",
  });

  const [account, setAccount] = useState(null);
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

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

      await contract.methods
        .registerDoctor(
          form.firstName,
          form.lastName,
          form.specialization,
          form.email,
          form.phoneNumber,
          form.licenseNumber,
          form.experienceYears,
          form.address,
          form.dateOfBirth
        )
        .send({ from: account });

      setStatus("Registration successful!");
      navigate("/doctor/dashboard");
    } catch (error) {
      console.error(error);
      setStatus("Registration failed. " + (error.message || ""));
    }
  };

  return (
    <div className="doctor-container">
      <h2 className="form-title">Doctor Registration</h2>

      {!account ? (
        <button className="wallet-btn" onClick={connectWallet}>
          Connect MetaMask Wallet
        </button>
      ) : (
        <p className="connected-text">Connected account: {account}</p>
      )}

      <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-columns">
          <div className="form-column">
            <label>First Name</label>
            <input name="firstName" onChange={handleChange} required />

            <label>Last Name</label>
            <input name="lastName" onChange={handleChange} required />

            <label>Date of Birth</label>
            <input type="date" name="dateOfBirth" onChange={handleChange} required />

            <label>Email</label>
            <input type="email" name="email" onChange={handleChange} required />

            <label>Address</label>
            <input name="address" onChange={handleChange} />
          </div>

          <div className="form-column">
            <label>Phone Number</label>
            <input name="phoneNumber" onChange={handleChange} required />

            <label>Specialization</label>
            <input name="specialization" onChange={handleChange} required />

            <label>Medical License Number</label>
            <input name="licenseNumber" onChange={handleChange} required />

            <label>Years of Experience</label>
            <input name="experienceYears" onChange={handleChange} required />
          </div>
        </div>

        <button type="submit" className="submit-btn">
          Register Doctor
        </button>
        <p className="status-text">{status}</p>
      </form>
    </div>
  );
};

export default DoctorRegistration;
