import React, { useEffect, useState } from "react";
import { getWeb3, getContract } from "../utils/blockchain";
import { uploadFileToPinata } from "../utils/pinata";
import Navbar from "./Navbar";

const PatientReports = () => {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [file, setFile] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    async function loadDoctors() {
      try {
        const web3 = await getWeb3();
        if (!web3) {
          setStatus("Please install MetaMask.");
          return;
        }
        const accounts = await web3.eth.getAccounts();
        if (!accounts.length) {
          setStatus("Please connect MetaMask wallet.");
          return;
        }
        setAccount(accounts[0]);
        const contractInstance = await getContract(web3);
        setContract(contractInstance);

        const allDoctors = await contractInstance.methods.getAllRegisteredDoctors().call();
        const approvedDoctors = [];

        for (const doctorAddrRaw of allDoctors) {
          const doctorAddr = web3.utils.toChecksumAddress(doctorAddrRaw);
          if (!web3.utils.isAddress(doctorAddr)) continue;

          // Check if doctor is approved by patient (account)
          const approved = await contractInstance.methods.isApproved(accounts[0], doctorAddr).call();
          if (approved) {
            const details = await contractInstance.methods.getDoctorDetails(doctorAddr).call();
            approvedDoctors.push({
              address: doctorAddr,
              firstName: details.firstName,
              lastName: details.lastName,
            });
          }
        }
        setDoctors(approvedDoctors);
        if (approvedDoctors.length > 0) setSelectedDoctor(approvedDoctors[0].address);
      } catch (err) {
        console.error(err);
        setStatus("Failed to load doctors.");
      }
    }
    loadDoctors();
  }, []);

  const sendReport = async () => {
    if (!contract || !account) {
      setStatus("Connect wallet first.");
      return;
    }
    if (!file) {
      setStatus("Please select a report file.");
      return;
    }
    if (!selectedDoctor) {
      setStatus("Please select a doctor.");
      return;
    }
    setStatus("Uploading report to IPFS...");
    try {
      const ipfsHash = await uploadFileToPinata(file);
      setStatus("Sending report hash on-chain...");
      await contract.methods.sendReport(selectedDoctor, ipfsHash).send({ from: account });
      setStatus("Report sent successfully.");
      setFile(null);
    } catch (err) {
      console.error(err);
      setStatus("Failed to send report.");
    }
  };

  return (
    <>
      <Navbar role="patient" />
      <div style={{ padding: "20px" }}>
        <h2>Send Health Report</h2>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          style={{ marginBottom: "10px" }}
        />
        <br />
        <label htmlFor="doctorSelect">Select Doctor: </label>
        <select
          id="doctorSelect"
          value={selectedDoctor}
          onChange={(e) => setSelectedDoctor(e.target.value)}
          style={{ marginBottom: "10px", padding: "5px", minWidth: "200px" }}
        >
          {doctors.map((doctor) => (
            <option key={doctor.address} value={doctor.address}>
              Dr. {doctor.firstName} {doctor.lastName}
            </option>
          ))}
        </select>
        <br />
        <button onClick={sendReport} disabled={!file || !selectedDoctor}>
          Send Report
        </button>
        <p>{status}</p>
      </div>
    </>
  );
};

export default PatientReports;
