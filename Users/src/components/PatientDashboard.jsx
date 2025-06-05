import React, { useEffect, useState } from "react";
import { getWeb3, getContract } from "../utils/blockchain";
import Navbar from "./Navbar";

const PatientDashboard = () => {
  const [account, setAccount] = useState(null);
  const [patientDetails, setPatientDetails] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const web3 = await getWeb3();
        if (!web3) throw new Error("Please install MetaMask.");
        const accounts = await web3.eth.getAccounts();
        if (!accounts.length) throw new Error("Please connect MetaMask wallet.");
        setAccount(accounts[0]);

        const contract = await getContract(web3);

        // Load patient details
        const details = await contract.methods.patients(accounts[0]).call();
        if (!details.isRegistered) throw new Error("You are not registered as a patient.");
        setPatientDetails(details);

        // Load all doctors
        const doctorAddresses = await contract.methods.getAllRegisteredDoctors().call();
        const doctorDetailsList = await Promise.all(
          doctorAddresses.map(async (addr) => {
            const doc = await contract.methods.getDoctorDetails(addr).call();
            return { ...doc, walletAddress: addr };
          })
        );
        setDoctors(doctorDetailsList);

        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to load data.");
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return <p>Loading patient dashboard...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <>
      <Navbar role="patient" />
      <div style={{ padding: "20px" }}>
        <h2>Welcome, {patientDetails.firstName}!</h2>
        <p><strong>Blood Group:</strong> {patientDetails.bloodGroup}</p>
        <p><strong>Date of Birth:</strong> {patientDetails.dateOfBirth}</p>
        <p><strong>Phone:</strong> {patientDetails.phoneNumber}</p>

        <h3>Available Doctors</h3>
        {doctors.length === 0 ? (
          <p>No doctors available</p>
        ) : (
          <ul>
            {doctors.map((doc, idx) => (
              <li key={idx}>
                Dr. {doc.firstName} {doc.lastName} - {doc.specialization}
                <button style={{ marginLeft: "10px" }} onClick={() => alert(`Apply for meeting with Dr. ${doc.firstName}`)}>
                  Apply for Meeting
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default PatientDashboard;
