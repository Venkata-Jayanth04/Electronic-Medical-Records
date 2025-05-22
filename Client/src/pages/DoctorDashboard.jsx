import React, { useEffect, useState } from "react";
import { initWeb3, web3, contract } from "../utils/web3";
import { uploadToIPFS } from "../utils/ipfs";
import Navbar from "../components/Navbar";

export default function DoctorDashboard() {
  const [doctor, setDoctor] = useState({});
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [prescriptionFile, setPrescriptionFile] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchDoctorData = async () => {
      await initWeb3();
      const accounts = await web3.eth.getAccounts();

      const doctorDetails = await contract.methods.getDoctor(accounts[0]).call();
      const docMeetings = await contract.methods.getDoctorMeetings(accounts[0]).call();

      setDoctor({
        name: doctorDetails[0],
        email: doctorDetails[1],
        specialty: doctorDetails[2],
      });

      setMeetings(docMeetings);
    };

    fetchDoctorData();
  }, []);

  const handleVerify = async (index) => {
    try {
      const accounts = await web3.eth.getAccounts();
      await contract.methods.acceptMeeting(index).send({ from: accounts[0] });
      setMessage("✅ Meeting verified!");
    } catch (err) {
      console.error(err);
      setMessage("❌ Could not verify meeting.");
    }
  };

  const handleUpload = async () => {
    if (!selectedPatient || !prescriptionFile) {
      setMessage("Please select a patient and choose a file.");
      return;
    }

    try {
      setLoading(true);
      const ipfsHash = await uploadToIPFS(prescriptionFile);
      const accounts = await web3.eth.getAccounts();
      await contract.methods.uploadPrescription(selectedPatient, ipfsHash).send({ from: accounts[0] });
      setMessage("✅ Prescription uploaded!");
    } catch (err) {
      console.error(err);
      setMessage("❌ Upload failed.");
    } finally {
      setLoading(false);
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
    marginTop: "10px",
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "8px 16px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: "20px", fontFamily: "Segoe UI", maxWidth: "800px", margin: "0 auto" }}>
        <h2>Doctor Dashboard</h2>

        <div style={cardStyle}>
          <p><strong>Name:</strong> {doctor.name}</p>
          <p><strong>Email:</strong> {doctor.email}</p>
          <p><strong>Specialty:</strong> {doctor.specialty}</p>
        </div>

        <div style={cardStyle}>
          <h3>Appointments</h3>
          {meetings.length === 0 ? (
            <p>No meetings yet.</p>
          ) : (
            meetings.map((m, i) => (
              <div key={i} style={{ marginBottom: "15px" }}>
                <p><strong>Patient:</strong> {m.patient}</p>
                <p><strong>Description:</strong> {m.description}</p>
                <p><strong>Time:</strong> {m.time}</p>
                <p><strong>Status:</strong> {m.isVerified ? "Verified ✅" : "Pending ❌"}</p>
                <PatientFileLink patientAddress={m.patient} />
                {!m.isVerified && (
                  <button onClick={() => handleVerify(i)} style={buttonStyle}>
                    Verify Meeting
                  </button>
                )}
              </div>
            ))
          )}
        </div>

        <div style={cardStyle}>
          <h3>Upload Prescription</h3>
          <input
            placeholder="Enter Patient Address"
            value={selectedPatient}
            onChange={(e) => setSelectedPatient(e.target.value)}
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          />
          <input
            type="file"
            onChange={(e) => setPrescriptionFile(e.target.files[0])}
            style={{ marginBottom: "10px" }}
          />
          <button
            onClick={handleUpload}
            disabled={loading}
            style={buttonStyle}
          >
            {loading ? "Uploading..." : "Upload Prescription"}
          </button>
          {message && <p style={{ marginTop: "10px", color: message.includes("✅") ? "green" : "red" }}>{message}</p>}
        </div>
      </div>
    </>
  );
}

const PatientFileLink = ({ patientAddress }) => {
  const [fileHash, setFileHash] = useState("");

  useEffect(() => {
    const fetchPatient = async () => {
      const details = await contract.methods.getPatient(patientAddress).call();
      setFileHash(details[2]);
    };
    fetchPatient();
  }, [patientAddress]);

  return fileHash ? (
    <p>
      <strong>Patient Record:</strong>{" "}
      <a href={`https://gateway.pinata.cloud/ipfs/${fileHash}`} target="_blank" rel="noreferrer">
        🔗 View File
      </a>
    </p>
  ) : (
    <p><em>No record uploaded by patient.</em></p>
  );
};
