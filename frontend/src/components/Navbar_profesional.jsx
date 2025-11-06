import React from 'react';
import { Link } from 'react-router-dom';

const ProfessionalNavbar = () => {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/profesional" className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center">
              <img src="/Tiiwa.png" alt="" />
            </div>
            <span className="text-gray-800 font-semibold">Panel Profesional</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/profesional" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Dashboard</Link>
            <Link to="/profesional/citas" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Citas</Link>
            <Link to="/profesional/agenda" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Agenda</Link>
            <Link to="/profesional/pacientes" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Pacientes</Link>
            <Link to="/profesional/pagos" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Pagos</Link>

            <div className="relative group">
              <button className="flex items-center space-x-2 focus:outline-none">
                <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Profesional" className="w-8 h-8 rounded-full object-cover border-2 border-gray-200" />
                <svg className="w-4 h-4 text-gray-600" viewBox="0 0 24 24" fill="none">
                  <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200">
                <Link to="/profesional/perfil" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Mi Perfil</Link>
                <Link to="/profesional/configuracion" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Configuración</Link>
                <hr className="my-1" />
                <Link to="/" className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Cerrar Sesión</Link>
              </div>
            </div>
          </div>

          <div className="md:hidden">
            <button className="text-gray-600 hover:text-gray-900 focus:outline-none">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M4 6h16M4 12h16M4 18h16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default ProfessionalNavbar;