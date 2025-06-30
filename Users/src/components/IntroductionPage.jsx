import React from "react";
import "../css/IntroductionPage.css";
import { useNavigate } from "react-router-dom";
import logo from "../images/logo.png";
import bgImage from "../images/background.png";

const IntroductionPage = () => {
  const navigate = useNavigate();

  const proceed = () => {
    navigate("/select-role");
  };

  return (
    <div
      className="container-intro"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* ✅ Overlay darkens the background */}
      <div className="overlay">
        <img src={logo} alt="EMR Logo" className="logo-intro" />
        <h1 className="title-intro">Electronic Medical Records (EMR) System</h1>
        <p className="subtitle-intro">
          Your secure blockchain-based medical record system.
        </p>
        <button className="btn-start" onClick={proceed}>
          Get Started
        </button>
      </div>
    </div>
  );
};

export default IntroductionPage;
