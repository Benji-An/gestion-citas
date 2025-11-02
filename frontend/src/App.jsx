import React from 'react';
import Navbar from './components/Navbar';
import Slider from './components/Slider';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Slider */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Slider />
      </div>

      {/* Contenido adicional */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Bienvenido al Sistema de Gestión de Citas
        </h1>
        <p className="text-gray-600">
          Administra tus citas médicas de manera eficiente y profesional
        </p>
      </main>
    </div>
  );
}

export default App;