import React, { useEffect, useState } from "react";
import '../css/DoctorReports.css';
import { getWeb3, getContract } from "../utils/blockchain";
import Navbar from "./Navbar";

function DoctorReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadReports() {
      try {
        const web3 = await getWeb3();
        if (!web3) throw new Error("Please install MetaMask.");

        const accounts = await web3.eth.getAccounts();
        if (!accounts.length) throw new Error("Please connect MetaMask wallet.");

        const doctorAddress = web3.utils.toChecksumAddress(accounts[0]);
        const contract = await getContract(web3);

        const patientsRaw = await contract.methods.getAllRegisteredPatients().call();
        const allReports = [];

        for (const patientAddrRaw of patientsRaw) {
          const patientAddr = web3.utils.toChecksumAddress(patientAddrRaw);
          if (!web3.utils.isAddress(patientAddr)) continue;

          const approved = await contract.methods.isApproved(patientAddr, doctorAddress).call();
          if (approved) {
            const hashes = await contract.methods.getPatientReports(patientAddr, doctorAddress).call();
            if (hashes && hashes.length > 0) {
              const patientDetails = await contract.methods.patients(patientAddr).call();
              hashes.forEach((hash) => {
                allReports.push({
                  patientName: `${patientDetails.firstName} ${patientDetails.lastName}`,
                  ipfsHash: hash,
                  patientAddress: patientAddr
                });
              });
            }
          }
        }

        setReports(allReports);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load reports.");
        setLoading(false);
      }
    }

    loadReports();
  }, []);

  if (loading) return <p className="loading">Loading reports...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <>
      <Navbar role="doctor" />
      <div className="container-doctorreports">
        <h2 className="title-doctorreports">Reports Sent by Patients</h2>
        {reports.length === 0 ? (
          <p>No reports available.</p>
        ) : (
          <ul className="report-list">
            {reports.map((report, idx) => (
              <li key={idx} className="report-card">
                <strong>Patient:</strong> {report.patientName} <br />
                <a
                  href={`https://ipfs.io/ipfs/${report.ipfsHash}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  View Report (IPFS)
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

export default DoctorReports;
