import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/common.css";

const RoleSelection = () => {
  const navigate = useNavigate();

  const selectRole = (role) => {
    localStorage.setItem("role", role);
    if (role === "patient") {
      navigate("/patient/register");
    } else {
      navigate("/doctor/register");
    }
  };

  return (
    <div className="centered-container">
      <h2>Select Your Role</h2>
      <button onClick={() => selectRole("patient")}>Patient</button>
      <button onClick={() => selectRole("doctor")}>Doctor</button>
    </div>
  );
};

export default RoleSelection;
