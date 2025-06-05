import React, { useEffect, useState } from "react";
import { getWeb3, getContract } from "../utils/blockchain";
import Navbar from "./Navbar";
import "../css/patient.css";

const DoctorDetails = () => {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDoctors() {
      try {
        const web3 = await getWeb3();
        if (!web3) {
          setError("Please install MetaMask.");
          setLoading(false);
          return;
        }

        const accounts = await web3.eth.getAccounts();
        if (!accounts.length) {
          setError("Please connect MetaMask wallet.");
          setLoading(false);
          return;
        }
        setAccount(accounts[0]);

        const contractInstance = await getContract(web3);
        setContract(contractInstance);

        const doctorAddresses = await contractInstance.methods.getAllRegisteredDoctors().call();

        if (!doctorAddresses.length) {
          setError("No doctors registered yet.");
          setLoading(false);
          return;
        }

        const doctorDetailsList = await Promise.all(
          doctorAddresses.map(async (addr) => {
            try {
              const details = await contractInstance.methods.getDoctorDetails(addr).call();
              return { ...details, walletAddress: addr };
            } catch (err) {
              console.error("Error fetching doctor details for", addr, err);
              return null;
            }
          })
        );

        setDoctors(doctorDetailsList.filter(Boolean));
        setLoading(false);
      } catch (err) {
        console.error("Failed to load doctors:", err);
        setError("Failed to load doctors.");
        setLoading(false);
      }
    }
    loadDoctors();
  }, []);

  const applyForMeeting = async (doctorAddress) => {
    if (!contract || !account) {
      alert("Connect your wallet first.");
      return;
    }
    try {
      await contract.methods.requestConsultation(doctorAddress).send({ from: account });
      alert("Meeting request sent successfully.");
    } catch (err) {
      console.error("Error sending meeting request:", err);
      alert("Failed to send meeting request.");
    }
  };

  if (loading) return <p className="loading">Loading doctors...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <>
      <Navbar role="patient" />
      <div className="patient-dashboard">
        <h2>Available Doctors</h2>
        {doctors.length === 0 ? (
          <p>No doctors available.</p>
        ) : (
          <ul>
            {doctors.map((doc, idx) => (
              <li key={idx} className="doctor-details">
                <strong>Dr. {doc.firstName} {doc.lastName}</strong> - {doc.specialization}
                <button
                  className="btn-apply"
                  onClick={() => applyForMeeting(doc.walletAddress)}
                >
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

export default DoctorDetails;
