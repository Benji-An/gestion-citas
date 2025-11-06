import React from "react";
import ProfessionalNavbar from "../components/Navbar_profesional";
import ProfessionalDashboard from "./Dashboard_profesional";

function InicioProfesional() {
  return (
    <div className="min-h-screen bg-gray-100">
      <ProfessionalNavbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProfessionalDashboard />
      </div>
    </div>
  );
}

export default InicioProfesional;