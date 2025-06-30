import React, { useEffect, useState } from "react";
import "../css/DoctorDashboard.css";
import { getWeb3, getContract } from "../utils/blockchain";
import Navbar from "./Navbar";
import doctorImg from "../images/patient1.png";

function DoctorDashboard() {
  const [, setAccount] = useState(null);
  const [doctor, setDoctor] = useState(null);
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
        setDoctor(details);
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
      <div className="container-doctordashboard">
        <div className="header-doctordashboard">
          <h2>Welcome Dr. {doctor.firstName} {doctor.lastName}</h2>
        </div>

        <div className="card-doctordashboard-layout">
          <div className="details-doctordashboard">
            <p><strong>Specialization:</strong> {doctor.specialization}</p>
            <p><strong>Email:</strong> {doctor.email}</p>
            <p><strong>Phone:</strong> {doctor.phoneNumber}</p>
            <p><strong>Address:</strong> {doctor.licensenumber}</p>
            <p><strong>Years of Experience:</strong> {doctor.YearsExperience}</p>
            <p><strong>Medical License Number:</strong> {doctor.Doctoraddress}</p>
          </div>
          <div className="image-doctordashboard">
            <img src={doctorImg} alt="Doctor" />
          </div>
        </div>
      </div>
    </>
  );
}

export default DoctorDashboard;
