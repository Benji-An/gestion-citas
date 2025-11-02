import React from 'react';
import Button from './ui/Button';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-lg flex items-center justify-center">
              <svg 
                className="w-4 h-4 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
                />
              </svg>
            </div>
            <span className="text-gray-700 font-medium text-sm">
              Gestión de Citas
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a 
              href="#" 
              className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
            >
              Inicio
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">
              Especialidades
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">
              Precios
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">
              Soporte
            </a>
            <Button>
              Iniciar Sesión
            </Button>
          </div>
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