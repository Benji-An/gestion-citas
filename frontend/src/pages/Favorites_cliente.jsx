import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ClientNavbar from '../components/Navbar_cliente';
import { getMisFavoritos, eliminarFavorito, getToken } from '../api';

const ClientFavorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarFavoritos();
  }, []);

  const cargarFavoritos = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getMisFavoritos();
      console.log('Favoritos recibidos:', data); // Debug
      setFavorites(data || []);
    } catch (err) {
      console.error('Error al cargar favoritos:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (id) => {
    if (!confirm('¿Eliminar de favoritos?')) return;

    try {
      await eliminarFavorito(id);
      setFavorites(favorites.filter(fav => fav.id !== id));
    } catch (err) {
      alert('Error al eliminar favorito: ' + err.message);
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ClientNavbar />
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ClientNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Título */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Mis Favoritos
          </h1>
          <p className="text-gray-600">
            {favorites.length} {favorites.length === 1 ? 'profesional guardado' : 'profesionales guardados'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
            {error}
          </div>
        )}

        {/* Grid de favoritos */}
        {favorites.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((favorite) => (
              <div 
                key={favorite.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow relative"
              >
                {/* Botón de eliminar favorito */}
                <button 
                  onClick={() => removeFavorite(favorite.id)}
                  className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-md hover:bg-red-50 transition-colors group"
                  title="Eliminar de favoritos"
                >
                  <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                </button>

                {/* Disponibilidad badge */}
                {!favorite.available && (
                  <div className="absolute top-4 left-4 z-10 bg-gray-800 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    No disponible
                  </div>
                )}

                {/* Imagen */}
                <div className="h-48 bg-emerald-100 flex items-center justify-center relative">
                  <div className="w-32 h-32 rounded-full bg-green-200 flex items-center justify-center text-green-700 text-3xl font-bold border-4 border-white">
                    {favorite.nombre?.charAt(0)}{favorite.apellido?.charAt(0)}
                  </div>
                </div>

                {/* Contenido */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {favorite.nombre_completo}
                  </h3>
                  <p className="text-emerald-600 text-sm font-medium mb-2">
                    {favorite.especialidad}
                  </p>
                  <div className="flex items-center text-gray-500 text-sm mb-3">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {favorite.ciudad || 'Sin especificar'}
                  </div>
                  <p className="text-gray-600 text-sm mb-2">
                    <strong>Experiencia:</strong> {favorite.experiencia_anos} años
                  </p>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {favorite.descripcion || 'Sin descripción'}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center space-x-2 mb-4">
                    <StarRating rating={favorite.calificacion_promedio || 0} />
                    <span className="text-sm text-gray-600">
                      {favorite.calificacion_promedio || 0} ({favorite.numero_resenas || 0} reseñas)
                    </span>
                  </div>

                  <p className="text-green-600 text-lg font-bold mb-4">
                    ${favorite.precio_consulta?.toLocaleString()} COP
                  </p>

                  {/* Botones */}
                  <div className="flex space-x-2">
                    <Link
                      to={`/Buscar_profesional?id=${favorite.id}`}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-center"
                    >
                      Ver Perfil
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Mensaje cuando no hay favoritos
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No tienes favoritos guardados
            </h3>
            <p className="text-gray-600 mb-4">
              Explora profesionales y guarda tus favoritos para acceder rápidamente
            </p>
            <Link
              to="/inicio_clientes"
              className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Buscar Profesionales
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientFavorites;