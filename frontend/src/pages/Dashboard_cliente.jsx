import React, { useState } from 'react';
import ClientNavbar from '../components/Navbar_cliente';
import { Link } from 'react-router-dom';

const ClientDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [specialty, setSpecialty] = useState('Psicología');
  const [location, setLocation] = useState('Madrid, España');

  const professionals = [
    {
      id: 1,
      name: "Dra. Ana Torres",
      specialty: "Psicología",
      location: "Madrid, España",
      description: "Especialista en terapia cognitivo-conductual con más de 10 años de experiencia.",
      rating: 4.9,
      reviews: 124,
      image: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      id: 2,
      name: "Carlos Vega",
      specialty: "Nutrición",
      location: "Barcelona, España",
      description: "Ayudo a crear hábitos alimenticios saludables y sustentables.",
      rating: 5.0,
      reviews: 88,
      image: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      id: 3,
      name: "Javier Romero",
      specialty: "Fisioterapia",
      location: "Valencia, España",
      description: "Recuperación de lesiones deportivas y rehabilitación postoperatoria.",
      rating: 4.2,
      reviews: 76,
      image: "https://randomuser.me/api/portraits/men/52.jpg"
    },
    {
      id: 4,
      name: "María González",
      specialty: "Psicología",
      location: "Madrid, España",
      description: "Terapeuta especializada en ansiedad y gestión del estrés.",
      rating: 4.8,
      reviews: 95,
      image: "https://randomuser.me/api/portraits/women/68.jpg"
    },
    {
      id: 5,
      name: "Luis Fernández",
      specialty: "Nutrición",
      location: "Madrid, España",
      description: "Nutrición deportiva y planes personalizados de alimentación.",
      rating: 4.7,
      reviews: 62,
      image: "https://randomuser.me/api/portraits/men/22.jpg"
    },
    {
      id: 6,
      name: "Carmen Silva",
      specialty: "Fisioterapia",
      location: "Sevilla, España",
      description: "Especialista en rehabilitación de columna y masajes terapéuticos.",
      rating: 4.6,
      reviews: 54,
      image: "https://randomuser.me/api/portraits/women/35.jpg"
    }
  ];

  const StarRating = ({ rating }) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg 
            key={star}
            className={`w-4 h-4 ${star <= Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Título principal */}
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Encuentra al profesional que necesitas
        </h1>

        {/* Barra de búsqueda */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid md:grid-cols-12 gap-4">
            {/* Búsqueda por nombre */}
            <div className="md:col-span-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar por nombre
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Ej: Dr. Juan Pérez"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                />
                <svg 
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Especialidad */}
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Especialidad
              </label>
              <select
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              >
                <option>Psicología</option>
                <option>Nutrición</option>
                <option>Fisioterapia</option>
                <option>Dermatología</option>
                <option>Cardiología</option>
                <option>Odontología</option>
              </select>
            </div>

            {/* Ubicación */}
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ubicación
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              >
                <option>Madrid, España</option>
                <option>Barcelona, España</option>
                <option>Valencia, España</option>
                <option>Sevilla, España</option>
                <option>Bilbao, España</option>
              </select>
            </div>

            {/* Botón buscar */}
            <div className="md:col-span-1 flex items-end">
              <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                Buscar
              </button>
            </div>
          </div>
        </div>

        {/* Resultados */}
        <div className="mb-4">
          <p className="text-gray-600 font-medium">
            {professionals.length} profesionales encontrados
          </p>
        </div>

        {/* Grid de profesionales */}
        <div className="grid md:grid-cols-3 gap-6">
          {professionals.map((professional) => (
            <div 
              key={professional.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Imagen */}
              <div className="h-48 bg-emerald-100 flex items-center justify-center">
                <img 
                  src={professional.image}
                  alt={professional.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-white"
                />
              </div>

              {/* Contenido */}
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                </h3>
                <p className="text-emerald-600 text-sm font-medium mb-2">
                  {professional.specialty}
                </p>
                <div className="flex items-center text-gray-500 text-sm mb-3">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {professional.location}
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {professional.description}
                </p>

                {/* Rating */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <StarRating rating={professional.rating} />
                    <span className="text-sm text-gray-600">
                      {professional.rating} ({professional.reviews} reseñas)
                    </span>
                  </div>
                </div>

                {/* Botón */}
                <Link to="/Perfil_profesional" className="w-full bg-gray-100 hover:bg-green-600 hover:text-white text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors text-center block">
                  Ver perfil
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Paginación */}
        <div className="flex justify-center items-center space-x-2 mt-8">
          <button className="p-2 rounded-lg hover:bg-gray-200 transition-colors">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button className="px-3 py-1 bg-green-600 text-white rounded-lg font-medium">1</button>
          <button className="px-3 py-1 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors">2</button>
          <button className="px-3 py-1 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors">3</button>
          <span className="px-2 text-gray-500">...</span>
          <button className="px-3 py-1 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors">8</button>
          <button className="p-2 rounded-lg hover:bg-gray-200 transition-colors">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;