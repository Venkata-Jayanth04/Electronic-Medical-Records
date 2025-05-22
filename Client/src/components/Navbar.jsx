// src/components/Navbar.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [role, setRole] = useState("");

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole) setRole(storedRole);
  }, []);

  return (
    <nav style={styles.navbar}>
      <div style={styles.navContent}>
        <Link to="/" style={styles.logo}>EMR System</Link>
        <div style={styles.links}>
          <Link to="/" style={styles.link}>Home</Link>
          {role === "patient" && (
            <>
              <Link to="/patient-dashboard" style={styles.link}>Dashboard</Link>
              <Link to="/book-appointment" style={styles.link}>Book</Link>
              <Link to="/view-appointments" style={styles.link}>Appointments</Link>
            </>
          )}
          {role === "doctor" && (
            <Link to="/doctor-dashboard" style={styles.link}>Doctor Dashboard</Link>
          )}
          {!role && (
            <>
              <Link to="/register-patient" style={styles.link}>Register Patient</Link>
              <Link to="/register-doctor" style={styles.link}>Register Doctor</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    backgroundColor: "#1e1e2f",
    padding: "10px 20px",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
  },
  navContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    maxWidth: "1100px",
    margin: "0 auto",
    fontFamily: "Segoe UI, sans-serif",
  },
  logo: {
    color: "#ffffff",
    fontSize: "20px",
    fontWeight: "bold",
    textDecoration: "none",
  },
  links: {
    display: "flex",
    gap: "15px",
  },
  link: {
    color: "#ffffff",
    textDecoration: "none",
    fontSize: "16px",
    padding: "6px 12px",
    borderRadius: "4px",
    transition: "background-color 0.3s ease",
  },
};
