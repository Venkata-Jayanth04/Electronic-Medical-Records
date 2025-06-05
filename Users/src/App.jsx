import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import PatientDashboard from "./components/PatientDashboard";
import DoctorDetails from "./components/DoctorDetails";
import PatientReports from "./components/PatientReports";
import DoctorDashboard from "./components/DoctorDashboard";
import PatientDetails from "./components/PatientDetails";
import DoctorPrecautions from "./components/DoctorPrecautions";
import PatientRegistration from "./components/PatientRegistration";
import DoctorRegistration from "./components/DoctorRegistration";
import RoleSelection from "./components/RoleSelection";
import IntroductionPage from "./components/IntroductionPage";

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<IntroductionPage />} />
      <Route path="/select-role" element={<RoleSelection />} />
      <Route path="/patient/register" element={<PatientRegistration />} />
      <Route path="/doctor/register" element={<DoctorRegistration />} />
      <Route path="/patient/dashboard" element={<PatientDashboard />} />
      <Route path="/patient/doctors" element={<DoctorDetails />} />
      <Route path="/patient/reports" element={<PatientReports />} />
      <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
      <Route path="/doctor/patients" element={<PatientDetails />} />
      <Route path="/doctor/precautions" element={<DoctorPrecautions />} />
    </Routes>
  </Router>
);

export default App;
