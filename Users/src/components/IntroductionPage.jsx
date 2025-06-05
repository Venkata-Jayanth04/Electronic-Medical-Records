import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/common.css";

const IntroductionPage = () => {
  const navigate = useNavigate();

  const proceed = () => {
    navigate("/select-role");
  };

  return (
    <div className="centered-container">
      <h1>Electronic Medical Records (EMR) System</h1>
      <img
        src="/images/intro-image.jpg"
        alt="Medical Records"
        style={{ maxWidth: "100%", height: "auto", marginTop: 20 }}
      />
      <p>Your secure blockchain-based medical record system.</p>
      <button onClick={proceed}>Get Started</button>
    </div>
  );
};

export default IntroductionPage;
