import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo y nombre */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center">
              <img src="/Tiiwa.png" alt="" />
            </div>
            <span className="text-gray-700 font-medium text-sm">Tiiwa</span>
          </Link>

          {/* Menú de navegación */}
          <div className="hidden md:flex items-center space-x-8">
            <a 
              href="/" 
              className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
            >
              Inicio
            </a>
            <a 
              href="#beneficios" 
              className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
            >
              Beneficios
            </a>
            <a 
              href="#opiniones" 
              className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
            >
              Opiniones
            </a>
            <a 
              href="#faq" 
              className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
            >
              FAQ
            </a>
            <Link
              to="/login_clientes"
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Iniciar Sesión
            </Link>
          </div>

          {/* Menú móvil (hamburguesa) */}
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

export default Navbar;