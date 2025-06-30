import React, { useState } from "react";
import "../css/PatientRegistration.css";
import { useNavigate } from "react-router-dom";
import { getWeb3, getContract } from "../utils/blockchain";

const PatientRegistration = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    email: "",
    gender: "",
    patientAddress: "",
    phoneNumber: "",
    bloodGroup: "",
    insuranceProvider: "",
    policyNumber: "",
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
      console.error(err);
      setStatus("Failed to connect wallet.");
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

      console.log("Using account:", account);
      console.log("Form Data:", form);
      console.log("Contract address:", contract.options.address);

      await contract.methods
        .registerPatient(
          form.firstName,
          form.lastName,
          form.dateOfBirth,
          form.email,
          form.gender,
          form.patientAddress,
          form.phoneNumber,
          form.bloodGroup,
          form.insuranceProvider,
          form.policyNumber
        )
        .send({ from: account });

      setStatus("Registration successful!");
      navigate("/patient/dashboard");
    } catch (error) {
      console.error("Error during registration:", error);
      setStatus("Registration failed. " + (error.message || ""));
    }
  };

  return (
    <div className="registration-container">
      <h2>Patient Registration</h2>

      {!account ? (
        <button className="connect-wallet-btn" onClick={connectWallet}>
          Connect MetaMask Wallet
        </button>
      ) : (
        <p className="connected-status">Connected account: {account}</p>
      )}

      <form onSubmit={handleSubmit} className="registration-form">
        <div className="form-columns">
          <div className="form-column">
            <input name="firstName" placeholder="First Name" onChange={handleChange} required />
            <input type="date" name="dateOfBirth" onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
            <select name="gender" onChange={handleChange} required>
              <option value="">Select Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
            <input name="bloodGroup" placeholder="Blood Group" onChange={handleChange} required />
          </div>

          <div className="form-column">
            <input name="lastName" placeholder="Last Name" onChange={handleChange} required />
            <input name="patientAddress" placeholder="Physical Address" onChange={handleChange} required />
            <input name="phoneNumber" placeholder="Phone Number" onChange={handleChange} required />
            <input name="insuranceProvider" placeholder="Insurance Provider" onChange={handleChange} />
            <input name="policyNumber" placeholder="Policy Number" onChange={handleChange} />
          </div>
        </div>

        <button type="submit" className="submit-btn">Register Patient</button>
      </form>

      <p className="status-message">{status}</p>
    </div>
  );
};

export default PatientRegistration;
