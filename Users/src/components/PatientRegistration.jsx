import React, { useState } from "react";
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
      console.error(error);
      setStatus("Registration failed.");
    }
  };

  return (
    <div className="registration-container">
      <h2>Patient Registration</h2>
      {!account ? (
        <button onClick={connectWallet}>Connect MetaMask Wallet</button>
      ) : (
        <p>Connected account: {account}</p>
      )}

      <form onSubmit={handleSubmit}>
        {/* Input fields similar to previous example */}
        <input name="firstName" placeholder="First Name" onChange={handleChange} required />
        <input name="lastName" placeholder="Last Name" onChange={handleChange} required />
        <input type="date" name="dateOfBirth" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <select name="gender" onChange={handleChange} required>
          <option value="">Select Gender</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>
        <input name="patientAddress" placeholder="Physical Address" onChange={handleChange} required />
        <input name="phoneNumber" placeholder="Phone Number" onChange={handleChange} required />
        <input name="bloodGroup" placeholder="Blood Group" onChange={handleChange} required />
        <input name="insuranceProvider" placeholder="Insurance Provider" onChange={handleChange} />
        <input name="policyNumber" placeholder="Policy Number" onChange={handleChange} />
        <button type="submit">Register Patient</button>
      </form>
      <p>{status}</p>
    </div>
  );
};

export default PatientRegistration;