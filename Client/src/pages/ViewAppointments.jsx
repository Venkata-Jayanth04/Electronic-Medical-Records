// src/pages/ViewAppointments.jsx
import React, { useEffect, useState } from "react";
import { initWeb3, web3, contract } from "../utils/web3";
import Navbar from "../components/Navbar";

export default function ViewAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        await initWeb3();
        const accounts = await web3.eth.getAccounts();
        const result = await contract.methods.getPatientMeetings(accounts[0]).call();
        setAppointments(result);
      } catch (err) {
        console.error(err);
        setMessage("❌ Failed to fetch appointments.");
      }
    };

    fetchAppointments();
  }, []);

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.title}>My Appointments</h2>

        {appointments.length === 0 ? (
          <p style={{ textAlign: "center" }}>No appointments found.</p>
        ) : (
          appointments.map((appt, index) => (
            <div key={index} style={styles.card}>
              <p><strong>Doctor:</strong> {appt.doctor}</p>
              <p><strong>Description:</strong> {appt.description}</p>
              <p><strong>Time:</strong> {appt.time}</p>
              <p><strong>Status:</strong> {appt.isVerified ? "✅ Accepted" : "⏳ Pending / Rejected"}</p>
            </div>
          ))
        )}

        {message && <p style={{ color: "red", marginTop: "20px" }}>{message}</p>}
      </div>
    </>
  );
}

const styles = {
  container: {
    padding: "30px",
    maxWidth: "700px",
    margin: "0 auto",
    fontFamily: "Segoe UI, sans-serif",
  },
  title: {
    textAlign: "center",
    color: "#4CAF50",
    marginBottom: "30px",
  },
  card: {
    backgroundColor: "#f9f9f9",
    padding: "20px",
    borderRadius: "8px",
    marginBottom: "20px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  },
};