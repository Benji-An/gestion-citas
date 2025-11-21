import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getProfesionales, getEspecialidades, getCiudades, agregarFavorito } from '../api';

const ClientDashboard = () => {
  console.log('🎯 ClientDashboard renderizando...');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [location, setLocation] = useState('');
  const [profesionales, setProfesionales] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 9; // 9 profesionales por página

  // Funciones de carga de datos
  const cargarDatosIniciales = async () => {
    try {
      console.log('🔄 Cargando datos iniciales...');
      const [especialidadesData, ciudadesData] = await Promise.all([
        getEspecialidades(),
        getCiudades()
      ]);
      console.log('✅ Especialidades:', especialidadesData);
      console.log('✅ Ciudades:', ciudadesData);
      setEspecialidades(especialidadesData.especialidades || []);
      setCiudades(ciudadesData.ciudades || []);
    } catch (err) {
      console.error('❌ Error al cargar datos iniciales:', err);
      setError('Error al cargar filtros: ' + err.message);
    }
  };

  const cargarProfesionales = useCallback(async () => {
    console.log('🔄 Cargando profesionales...', { currentPage, specialty, location, searchTerm });
    setLoading(true);
    setError('');
    
    try {
      const params = {
        skip: (currentPage - 1) * limit,
        limit: limit
      };
      
      if (specialty) params.especialidad = specialty;
      if (location) params.ciudad = location;
      if (searchTerm) params.busqueda = searchTerm;
      
      console.log('📡 Parámetros de búsqueda:', params);
      const data = await getProfesionales(params);
      console.log('✅ Profesionales recibidos:', data);
      setProfesionales(data.profesionales || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error('❌ Error al cargar profesionales:', err);
      setError('Error al cargar profesionales: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [currentPage, limit, specialty, location, searchTerm]);

  const handleBuscar = () => {
    setCurrentPage(1);
    cargarProfesionales();
  };

  const handleAgregarFavorito = async (profesionalId) => {
    try {
      await agregarFavorito(profesionalId);
      alert('Profesional agregado a favoritos');
    } catch (err) {
      alert(err.message || 'Error al agregar a favoritos');
    }
  };

  // Effects - Se ejecutan después de que las funciones están definidas
  useEffect(() => {
    cargarDatosIniciales();
  }, []);

  useEffect(() => {
    cargarProfesionales();
  }, [cargarProfesionales]);



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
    <div>
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
                <option value="">Todas las especialidades</option>
                {especialidades.map((esp, index) => (
                  <option key={index} value={esp}>{esp}</option>
                ))}
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
                <option value="">Todas las ciudades</option>
                {ciudades.map((ciudad, index) => (
                  <option key={index} value={ciudad}>{ciudad}</option>
                ))}
              </select>
            </div>

            {/* Botón buscar */}
            <div className="md:col-span-1 flex items-end">
              <button 
                onClick={handleBuscar}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Buscar
              </button>
            </div>
          </div>
        </div>

        {/* Mensajes de estado */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : (
          <>
            {/* Resultados */}
            <div className="mb-4">
              <p className="text-gray-600 font-medium">
                {total} profesionales encontrados
              </p>
            </div>

            {/* Grid de profesionales */}
            <div className="grid md:grid-cols-3 gap-6">
              {profesionales.length === 0 ? (
                <div className="col-span-3 text-center py-12">
                  <p className="text-gray-500">No se encontraron profesionales</p>
                </div>
              ) : (
                profesionales.map((professional) => (
            <div 
              key={professional.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Imagen */}
              <div className="h-48 bg-emerald-100 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full bg-green-200 flex items-center justify-center text-green-700 text-3xl font-bold border-4 border-white">
                  {professional.nombre?.charAt(0)}{professional.apellido?.charAt(0)}
                </div>
              </div>

              {/* Contenido */}
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {professional.nombre_completo}
                </h3>
                <p className="text-emerald-600 text-sm font-medium mb-2">
                  {professional.especialidad}
                </p>
                <div className="flex items-center text-gray-500 text-sm mb-3">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {professional.ciudad || 'Sin especificar'}
                </div>
                <p className="text-gray-600 text-sm mb-2">
                  <strong>Experiencia:</strong> {professional.experiencia_anos} años
                </p>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {professional.descripcion || 'Sin descripción'}
                </p>
                <p className="text-green-600 text-lg font-bold mb-4">
                  ${professional.precio_consulta?.toLocaleString()} COP
                </p>

                {/* Rating */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <StarRating rating={professional.calificacion_promedio || 0} />
                    <span className="text-sm text-gray-600">
                      {professional.calificacion_promedio || 0} ({professional.numero_resenas || 0} reseñas)
                    </span>
                  </div>
                </div>

                {/* Botones */}
                <div className="flex gap-2">
                  <Link 
                    to={`/Buscar_profesional?id=${professional.id}`} 
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-center"
                  >
                    Ver perfil
                  </Link>
                  <button
                    onClick={() => handleAgregarFavorito(professional.id)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    title="Agregar a favoritos"
                  >
                    ❤️
                  </button>
                </div>
              </div>
            </div>
                ))
              )}
            </div>
          </>
        )}

        {/* Paginación */}
        {!loading && total > limit && (
          <div className="flex justify-center items-center space-x-2 mt-8">
            <button 
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <span className="px-3 py-1 text-gray-700 font-medium">
              Página {currentPage} de {Math.ceil(total / limit)}
            </span>

            <button 
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage >= Math.ceil(total / limit)}
              className="p-2 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientDashboard;