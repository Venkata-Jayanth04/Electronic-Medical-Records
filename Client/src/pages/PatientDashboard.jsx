import React, { useEffect, useState } from "react";
import { initWeb3, web3, contract } from "../utils/web3";
import { uploadToIPFS } from "../utils/ipfs";
import Navbar from "../components/Navbar";

export default function PatientDashboard() {
  const [patient, setPatient] = useState({});
  const [prescriptions, setPrescriptions] = useState([]);
  const [recordFile, setRecordFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      await initWeb3();
      const accounts = await web3.eth.getAccounts();

      const patientDetails = await contract.methods.getPatient(accounts[0]).call();
      const prescList = await contract.methods.getPrescriptions(accounts[0]).call();

      setPatient({
        name: patientDetails[0],
        email: patientDetails[1],
        fileHash: patientDetails[2],
      });

      setPrescriptions(prescList);
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleUpload = async () => {
    if (!recordFile) {
      setMessage("❗ Please select a file to upload.");
      return;
    }

    try {
      setMessage("Uploading to IPFS...");
      const ipfsHash = await uploadToIPFS(recordFile);
      const accounts = await web3.eth.getAccounts();
      await contract.methods.uploadRecord(ipfsHash).send({ from: accounts[0] });
      setMessage("✅ File uploaded successfully.");
      window.location.reload();
    } catch (err) {
      console.error(err);
      setMessage("❌ Upload failed.");
    }
  };

  const cardStyle = {
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "15px",
    marginBottom: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    backgroundColor: "#fff",
  };

  const buttonStyle = {
    padding: "10px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: "20px", fontFamily: "Segoe UI", maxWidth: "800px", margin: "0 auto" }}>
        <h2>Patient Dashboard</h2>

        <div style={cardStyle}>
          <p><strong>Name:</strong> {patient.name}</p>
          <p><strong>Email:</strong> {patient.email}</p>
        </div>

        <div style={cardStyle}>
          <h3>Upload New Medical Record</h3>
          <input
            type="file"
            onChange={(e) => setRecordFile(e.target.files[0])}
            style={{ marginBottom: "10px" }}
          />
          <button onClick={handleUpload} style={buttonStyle}>
            Upload File
          </button>
          {message && <p style={{ color: message.includes("✅") ? "green" : "red" }}>{message}</p>}
        </div>

        <div style={cardStyle}>
          <h3>My Uploaded Medical Record</h3>
          {patient.fileHash ? (
            <a
              href={`https://gateway.pinata.cloud/ipfs/${patient.fileHash}`}
              target="_blank"
              rel="noreferrer"
            >
              🔗 View Medical Record
            </a>
          ) : (
            <p>No record uploaded yet.</p>
          )}
        </div>

        <div style={cardStyle}>
          <h3>Prescriptions from Doctors</h3>
          {loading ? (
            <p>Loading...</p>
          ) : prescriptions.length === 0 ? (
            <p>No prescriptions yet.</p>
          ) : (
            <ul>
              {prescriptions.map((hash, i) => (
                <li key={i}>
                  <a
                    href={`https://gateway.pinata.cloud/ipfs/${hash}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    📄 Prescription {i + 1}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
