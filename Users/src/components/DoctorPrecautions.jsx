import React, { useEffect, useState } from "react";
import { getWeb3, getContract } from "../utils/blockchain";
import { uploadFileToPinata } from "../utils/pinata";
import Navbar from "./Navbar";

const DoctorPrecautions = () => {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [patients, setPatients] = useState([]);
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    async function loadPatients() {
      const web3 = await getWeb3();
      if (!web3) {
        setStatus("Please install MetaMask.");
        return;
      }
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);
      const contractInstance = await getContract(web3);
      setContract(contractInstance);

      const allPatients = await contractInstance.methods.getAllRegisteredPatients().call();
      const approvedPatients = [];
      for (const patientAddr of allPatients) {
        const approved = await contractInstance.methods.isApproved(patientAddr, accounts[0]).call();
        if (approved) {
          const details = await contractInstance.methods.patients(patientAddr).call();
          approvedPatients.push({ address: patientAddr, firstName: details.firstName, lastName: details.lastName });
        }
      }
      setPatients(approvedPatients);
    }
    loadPatients();
  }, []);

  const sendPrescription = async (patientAddress) => {
    if (!contract || !account) {
      setStatus("Connect wallet first.");
      return;
    }
    if (!file) {
      setStatus("Please select a prescription file.");
      return;
    }
    setStatus("Uploading prescription to IPFS...");
    try {
      const ipfsHash = await uploadFileToPinata(file);
      setStatus("Sending prescription hash on-chain...");
      await contract.methods.sendPrescription(patientAddress, ipfsHash).send({ from: account });
      setStatus("Prescription sent successfully.");
      setFile(null);
    } catch (err) {
      console.error(err);
      setStatus("Failed to send prescription.");
    }
  };

  return (
    <>
      <Navbar role="doctor" />
      <div style={{ padding: "20px" }}>
        <h2>Send Prescription / Precautions</h2>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          style={{ marginBottom: "10px" }}
        />
        <ul>
          {patients.length === 0 && <li>No approved patients available.</li>}
          {patients.map((patient) => (
            <li key={patient.address}>
              {patient.firstName} {patient.lastName}
              <button style={{ marginLeft: "10px" }} onClick={() => sendPrescription(patient.address)}>
                Send
              </button>
            </li>
          ))}
        </ul>
        <p>{status}</p>
      </div>
    </>
  );
};

export default DoctorPrecautions;
