import React, { useEffect, useState } from "react";
import { getWeb3, getContract } from "../utils/blockchain";
import Navbar from "./Navbar";
import "../css/dashboard.css";

const PatientPrescriptions = () => {
  const [account, setAccount] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPrescriptions() {
      try {
        const web3 = await getWeb3();
        if (!web3) throw new Error("Please install MetaMask.");
        const accounts = await web3.eth.getAccounts();
        if (!accounts.length) throw new Error("Please connect MetaMask wallet.");
        const patientAddress = web3.utils.toChecksumAddress(accounts[0]);
        setAccount(patientAddress);

        const contract = await getContract(web3);
        const doctorsRaw = await contract.methods.getAllRegisteredDoctors().call();

        const allPrescriptions = [];

        for (const doctorAddrRaw of doctorsRaw) {
          const doctorAddr = web3.utils.toChecksumAddress(doctorAddrRaw);
          if (!web3.utils.isAddress(doctorAddr)) continue;

          const approved = await contract.methods.isApproved(patientAddress, doctorAddr).call();
          if (approved) {
            // Use the new getter function!
            const hashes = await contract.methods.getDoctorPrescriptions(doctorAddr, patientAddress).call();
            if (hashes && hashes.length > 0) {
              const doctorDetails = await contract.methods.doctors(doctorAddr).call();
              hashes.forEach(hash => {
                allPrescriptions.push({
                  doctorName: `Dr. ${doctorDetails.firstName} ${doctorDetails.lastName}`,
                  ipfsHash: hash,
                  doctorAddress: doctorAddr
                });
              });
            }
          }
        }

        setPrescriptions(allPrescriptions);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to load prescriptions.");
        setLoading(false);
      }
    }
    loadPrescriptions();
  }, []);

  if (loading) return <p className="dashboard-container">Loading prescriptions...</p>;
  if (error) return <p className="dashboard-container" style={{ color: "red" }}>{error}</p>;

  return (
    <>
      <Navbar role="patient" />
      <div className="dashboard-container">
        <h2>Prescriptions Sent by Doctors</h2>
        {prescriptions.length === 0 ? (
          <p>No prescriptions available.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {prescriptions.map((presc, idx) => (
              <li key={idx} className="list-item">
                <strong>Doctor:</strong> {presc.doctorName} <br />
                <a href={`https://ipfs.io/ipfs/${presc.ipfsHash}`} target="_blank" rel="noreferrer">
                  View Prescription (IPFS)
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default PatientPrescriptions;
