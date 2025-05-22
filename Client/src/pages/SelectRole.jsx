// src/pages/SelectRole.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function SelectRole() {
  const navigate = useNavigate();

  const handleSelect = (role, path) => {
    localStorage.setItem("role", role);
    navigate(path);
  };

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <h1 style={styles.title}>Welcome to EMR System</h1>
        <div style={styles.cardContainer}>
          <div style={styles.card} onClick={() => handleSelect("patient", "/register-patient")}>I am a Patient</div>
          <div style={styles.card} onClick={() => handleSelect("doctor", "/register-doctor")}>I am a Doctor</div>
        </div>
      </div>
    </>
  );
}

const styles = {
  container: {
    textAlign: "center",
    padding: "50px 20px",
    fontFamily: "Segoe UI, sans-serif",
  },
  title: {
    color: "#333",
    marginBottom: "40px",
    fontSize: "28px",
  },
  cardContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "40px",
    flexWrap: "wrap",
  },
  card: {
    width: "220px",
    padding: "30px",
    backgroundColor: "#f0f0f0",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    cursor: "pointer",
    fontSize: "18px",
    fontWeight: "bold",
    color: "#333",
    transition: "0.3s",
  },
};
