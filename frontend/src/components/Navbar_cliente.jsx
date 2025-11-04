import React from 'react';
import { Link } from 'react-router-dom';

const ClientNavbar = () => {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo y nombre */}
          <Link to="/cliente" className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-br  rounded-lg flex items-center justify-center">
                <img src="/Tiiwa.png" alt="Logo" className="w-5 h-5" />
            </div>
            <span className="text-gray-700 font-medium text-sm">
              Tiiwa
            </span>
          </Link>

          {/* Menú de navegación */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/cliente/citas"
              className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
            >
              Mis Citas
            </Link>
            <Link 
              to="/cliente/favoritos"
              className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
            >
              Favoritos
            </Link>

            {/* Avatar de usuario */}
            <div className="relative group">
              <button className="flex items-center space-x-2 focus:outline-none">
                <img 
                  src="https://randomuser.me/api/portraits/men/75.jpg" 
                  alt="Usuario"
                  className="w-8 h-8 rounded-full object-cover border-2 border-gray-300"
                />
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown menu */}
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200">
                <Link 
                  to="/cliente/perfil"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Mi Perfil
                </Link>
                <Link 
                  to="/cliente/configuracion"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Configuración
                </Link>
                <hr className="my-2" />
                <Link 
                  to="/"
                  className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Cerrar Sesión
                </Link>
              </div>
            </div>
          </div>

          {/* Menú móvil */}
          <div className="md:hidden">
            <button className="text-gray-600 hover:text-gray-900 focus:outline-none">
              <svg 
                className="h-6 w-6" 
                fill="none" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default ClientNavbar;