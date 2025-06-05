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

  const connectWallet = async () => {
    const web3 = await getWeb3();
    if (!web3) {
      setStatus("Please install MetaMask.");
      return;
    }
    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);
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
          form.phoneNumber
        )
        .send({ from: account });
      setStatus("Registration successful!");
      navigate("/doctor/dashboard");
    } catch (error) {
      console.error(error);
      setStatus("Registration failed.");
    }
  };

  return (
    <div className="registration-container">
      <h2>Doctor Registration</h2>
      {!account ? (
        <button className="btn-connect" onClick={connectWallet}>Connect MetaMask Wallet</button>
      ) : (
        <p>Connected account: {account}</p>
      )}

      <form onSubmit={handleSubmit}>
        <input name="firstName" placeholder="First Name" onChange={handleChange} required />
        <input name="lastName" placeholder="Last Name" onChange={handleChange} required />
        <input name="specialization" placeholder="Specialization" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input name="phoneNumber" placeholder="Phone Number" onChange={handleChange} required />
        <button type="submit" className="btn-submit">Register Doctor</button>
      </form>
      <p className="status-message">{status}</p>
    </div>
  );
};

export default DoctorRegistration;
