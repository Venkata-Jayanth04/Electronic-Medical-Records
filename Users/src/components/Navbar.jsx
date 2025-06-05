import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = ({ role }) => {
  const location = useLocation();

  return (
    <nav style={{ padding: "10px", backgroundColor: "#1976d2", color: "white", display: "flex", gap: "20px" }}>
      {role === "patient" && (
        <>
          <Link to="/patient/dashboard" style={linkStyle(location.pathname === "/patient/dashboard")}>Dashboard</Link>
          <Link to="/patient/doctors" style={linkStyle(location.pathname === "/patient/doctors")}>View Doctors</Link>
          <Link to="/patient/reports" style={linkStyle(location.pathname === "/patient/reports")}>Send Reports</Link>
        </>
      )}
      {role === "doctor" && (
        <>
          <Link to="/doctor/dashboard" style={linkStyle(location.pathname === "/doctor/dashboard")}>Dashboard</Link>
          <Link to="/doctor/patients" style={linkStyle(location.pathname === "/doctor/patients")}>View Patients</Link>
          <Link to="/doctor/precautions" style={linkStyle(location.pathname === "/doctor/precautions")}>Send Precautions</Link>
        </>
      )}
    </nav>
  );
};

const linkStyle = (active) => ({
  color: active ? "#ffeb3b" : "white",
  textDecoration: "none",
  fontWeight: active ? "bold" : "normal",
});

export default Navbar;
