import React, { useEffect, useState } from "react";
import { getWeb3, getContract } from "../utils/blockchain";
import Navbar from "./Navbar";

const PatientDetails = () => {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [patientRequests, setPatientRequests] = useState([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRequests() {
      try {
        const web3 = await getWeb3();
        if (!web3) throw new Error("Please install MetaMask.");
        const accounts = await web3.eth.getAccounts();
        if (!accounts.length) throw new Error("Please connect MetaMask wallet.");
        setAccount(accounts[0]);

        const contractInstance = await getContract(web3);
        setContract(contractInstance);

        const allPatients = await contractInstance.methods.getAllRegisteredPatients().call();

        const requests = [];
        for (const patientAddr of allPatients) {
          const key = web3.utils.soliditySha3(patientAddr, accounts[0]);
          const consultation = await contractInstance.methods.requests(key).call();
          if (consultation.exists && !consultation.approvedByDoctor) {
            const details = await contractInstance.methods.patients(patientAddr).call();
            requests.push({ address: patientAddr, firstName: details.firstName, lastName: details.lastName });
          }
        }
        setPatientRequests(requests);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to load patient requests.");
        setLoading(false);
      }
    }
    loadRequests();
  }, []);

  const acceptRequest = async (patientAddress) => {
    setStatus("Accepting request...");
    try {
      await contract.methods.doctorApproveConsultation(patientAddress).send({ from: account });
      setStatus("Request accepted.");
      setPatientRequests(patientRequests.filter((p) => p.address !== patientAddress));
    } catch (err) {
      console.error(err);
      setStatus("Failed to accept request.");
    }
  };

  const rejectRequest = async (patientAddress) => {
    setStatus("Rejecting request...");
    try {
      await contract.methods.doctorRejectConsultation(patientAddress).send({ from: account });
      setStatus("Request rejected.");
      setPatientRequests(patientRequests.filter((p) => p.address !== patientAddress));
    } catch (err) {
      console.error(err);
      setStatus("Failed to reject request.");
    }
  };

  if (loading) return <p>Loading patient requests...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <>
      <Navbar role="doctor" />
      <div style={{ padding: "20px" }}>
        <h2>Patient Meeting Requests</h2>
        {patientRequests.length === 0 ? (
          <p>No pending requests.</p>
        ) : (
          <ul>
            {patientRequests.map((patient) => (
              <li key={patient.address} style={{ marginBottom: "10px" }}>
                {patient.firstName} {patient.lastName} ({patient.address.slice(0, 6)}***)
                <button style={{ marginLeft: "10px" }} onClick={() => acceptRequest(patient.address)}>Accept</button>
                <button style={{ marginLeft: "10px" }} onClick={() => rejectRequest(patient.address)}>Reject</button>
              </li>
            ))}
          </ul>
        )}
        <p>{status}</p>
      </div>
    </>
  );
};

export default PatientDetails;
