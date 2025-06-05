import React, { useEffect, useState } from "react";
import { getWeb3, getContract } from "../utils/blockchain";
import Navbar from "./Navbar";
import "../css/doctor.css";

const DoctorDashboard = () => {
  const [account, setAccount] = useState(null);
  const [doctorDetails, setDoctorDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDoctor() {
      try {
        const web3 = await getWeb3();
        if (!web3) throw new Error("Please install MetaMask.");
        const accounts = await web3.eth.getAccounts();
        if (!accounts.length) throw new Error("Please connect MetaMask wallet.");
        setAccount(accounts[0]);

        const contract = await getContract(web3);
        const details = await contract.methods.doctors(accounts[0]).call();
        if (!details.isRegistered) throw new Error("You are not registered as a doctor.");
        setDoctorDetails(details);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to load doctor details.");
        setLoading(false);
      }
    }
    loadDoctor();
  }, []);

  if (loading) return <p className="loading">Loading doctor dashboard...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <>
      <Navbar role="doctor" />
      <div className="doctor-dashboard">
        <h2>Welcome Dr. {doctorDetails.firstName} {doctorDetails.lastName}</h2>
        <img
          src="/images/doctor-placeholder.png"
          alt="Doctor"
          className="profile-image"
        />
        <p><strong>Specialization:</strong> {doctorDetails.specialization}</p>
        <p><strong>Email:</strong> {doctorDetails.email}</p>
        <p><strong>Phone:</strong> {doctorDetails.phoneNumber}</p>
      </div>
    </>
  );
};

export default DoctorDashboard;
