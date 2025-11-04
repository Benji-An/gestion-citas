import React from "react";
import ClientNavbar from "../components/Navbar_cliente";
import ClientDashboard from "./Dashboard_cliente";

function InicioClientes() {
  return (
    <div className="min-h-screen bg-gray-100">
      <ClientNavbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ClientDashboard />
      </div>
    </div>
  );
}

export default InicioClientes;