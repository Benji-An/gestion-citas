import React, { useState } from 'react';

const Footer = () => {
  const [formData, setFormData] = useState({
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes agregar la lógica para enviar el formulario
    console.log('Formulario enviado:', formData);
    alert('Mensaje enviado correctamente');
    setFormData({ email: '', message: '' });
  };

  return (
    <footer className="bg-gray-100 border-t border-gray-200">
      {/* Contenido principal del footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Columna 1: Información de la empresa */}
          <div>
            <div className="flex items-center space-x-3">
              <img src="../../../public/tiiwa.png" alt="Tiiwa logo" className="h-10 w-auto" />
              <h3 className="text-lg font-bold text-gray-900">
                Tiiwa
              </h3>
            </div>
            <p className="text-gray-600 text-sm mt-2">
              Simplificando la forma de conectar a profesionales y clientes.
            </p>
          </div>

          {/* Columna 2: Enlaces */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Enlaces
            </h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="#caracteristicas" 
                  className="text-gray-600 hover:text-cyan-500 text-sm transition-colors"
                >
                  Características
                </a>
              </li>
              <li>
                <a 
                  href="#precios" 
                  className="text-gray-600 hover:text-cyan-500 text-sm transition-colors"
                >
                  Precios
                </a>
              </li>
              <li>
                <a 
                  href="#contacto" 
                  className="text-gray-600 hover:text-cyan-500 text-sm transition-colors"
                >
                  Contacto
                </a>
              </li>
            </ul>
          </div>

          {/* Columna 3: Formulario de contacto */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Contacto
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Tu email"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none text-sm"
              />
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tu mensaje"
                required
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none resize-none text-sm"
              ></textarea>
              <button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Enviar
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-gray-600 text-sm">
            © 2024 Gestión de Citas. Todos los derechos reservados.
          </p>
          <div className="flex space-x-6">
            <a 
              href="#terminos" 
              className="text-gray-600 hover:text-green-500 text-sm transition-colors"
            >
              Términos de Servicio
            </a>
            <a 
              href="#privacidad" 
              className="text-gray-600 hover:text-green-500 text-sm transition-colors"
            >
              Política de Privacidad
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;