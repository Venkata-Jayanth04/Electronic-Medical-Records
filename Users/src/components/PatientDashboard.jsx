import React, { useEffect, useState } from "react";
import "../css/PatientDashboard.css";
import { getWeb3, getContract } from "../utils/blockchain";
import Navbar from "./Navbar";
import patientImg from "../images/patient1.png"; // ✅ Use your own image path

function PatientDashboard() {
  const [, setAccount] = useState(null);
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPatient() {
      try {
        const web3 = await getWeb3();
        if (!web3) throw new Error("Please install MetaMask.");
        const accounts = await web3.eth.getAccounts();
        if (!accounts.length) throw new Error("Please connect MetaMask wallet.");
        setAccount(accounts[0]);

        const contract = await getContract(web3);
        const details = await contract.methods.patients(accounts[0]).call();
        if (!details.isRegistered) throw new Error("You are not registered as a patient.");
        setPatient(details);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to load patient details.");
        setLoading(false);
      }
    }
    loadPatient();
  }, []);

  if (loading) return <p className="loading">Loading patient dashboard...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <>
      <Navbar role="patient" />
      <div className="container-patientdashboard">
        <div className="header-patientdashboard">
          <h2>
            Welcome {patient.firstName} {patient.lastName}
          </h2>
        </div>

        <div className="card-patientdashboard-layout">
          <div className="details-patientdashboard">
            <p><strong>Date of Birth:</strong> {patient.dateOfBirth}</p>
            <p><strong>Email:</strong> {patient.email}</p>
            <p><strong>Gender:</strong> {patient.gender}</p>
            <p><strong>Address:</strong> {patient.patientAddress}</p>
            <p><strong>Phone:</strong> {patient.phoneNumber}</p>
            <p><strong>Blood Group:</strong> {patient.bloodGroup}</p>
            <p><strong>Insurance:</strong> {patient.insuranceProvider}</p>
            <p><strong>Policy Number:</strong> {patient.policyNumber}</p>
          </div>
          <div className="image-patientdashboard">
            <img src={patientImg} alt="Patient" />
          </div>
        </div>
      </div>
    </>
  );
}

export default PatientDashboard;
