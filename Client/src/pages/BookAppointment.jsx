// src/pages/BookAppointment.jsx
import React, { useEffect, useState } from "react";
import { initWeb3, web3, contract } from "../utils/web3";
import Navbar from "../components/Navbar";

export default function BookAppointment() {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [description, setDescription] = useState("");
  const [time, setTime] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadDoctors = async () => {
      await initWeb3();
      const addresses = await contract.methods.getDoctorList().call();
      const allDoctors = await Promise.all(
        addresses.map(async (addr) => {
          const d = await contract.methods.getDoctor(addr).call();
          return { ...d, address: addr };
        })
      );
      setDoctors(allDoctors);
    };
    loadDoctors();
  }, []);

  const handleBooking = async () => {
    if (!selectedDoctor || !description || !time) {
      setMessage("Please fill out all fields.");
      return;
    }

    try {
      const accounts = await web3.eth.getAccounts();
      await contract.methods.createMeeting(selectedDoctor, description, time).send({ from: accounts[0] });
      setMessage("✅ Appointment booked successfully!");
    } catch (err) {
      console.error(err);
      setMessage("❌ Booking failed.");
    }
  };

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.title}>Book Appointment</h2>
        <div style={styles.card}>
          <select
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
            style={styles.input}
          >
            <option value="">Select Doctor</option>
            {doctors.map((doc, index) => (
              <option key={index} value={doc.address}>
                {doc.name} ({doc.specialty})
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Meeting Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={styles.input}
          />

          <input
            type="text"
            placeholder="Preferred Time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            style={styles.input}
          />

          <button onClick={handleBooking} style={styles.button}>Book</button>
          {message && <p style={{ color: message.includes("✅") ? "green" : "red", marginTop: "10px" }}>{message}</p>}
        </div>
      </div>
    </>
  );
}

const styles = {
  container: {
    padding: "30px",
    maxWidth: "500px",
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
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  button: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};