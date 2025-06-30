import React from "react";
import '../css/RoleSelection.css';
import { useNavigate } from "react-router-dom";
import patientImg from '../images/patient.png';
import doctorImg from '../images/doctor.png';

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
    <div className="container-roleselection">
      <h2 className="title-roleselection">Select Your Role</h2>
      <div className="button-group">
        <button className="role-button patient" onClick={() => selectRole("patient")}>
          <img src={patientImg} alt="Patient" className="role-icon" />
          <span>Patient</span>
        </button>
        <button className="role-button doctor" onClick={() => selectRole("doctor")}>
          <img src={doctorImg} alt="Doctor" className="role-icon" />
          <span>Doctor</span>
        </button>
      </div>
    </div>
  );
};

export default RoleSelection;
