import React, { useState, useEffect } from 'react';
import ClientNavbar from '../components/Navbar_cliente';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { getProfesional, agregarFavorito, eliminarFavorito, getMisFavoritos } from '../api';

const ProfessionalProfile = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const profesionalId = searchParams.get('id');
  
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('sin seleccionar');
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [professional, setProfessional] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    if (!profesionalId) {
      setError('No se proporcionó ID del profesional');
      setLoading(false);
      return;
    }
    cargarProfesional();
    verificarFavorito();
  }, [profesionalId]);

  const cargarProfesional = async () => {
    try {
      setLoading(true);
      const data = await getProfesional(profesionalId);
      setProfessional(data);
    } catch (err) {
      console.error('Error al cargar profesional:', err);
      setError(err.message || 'Error al cargar el perfil del profesional');
    } finally {
      setLoading(false);
    }
  };

  const verificarFavorito = async () => {
    try {
      const favoritos = await getMisFavoritos();
      const esFavorito = favoritos.some(fav => fav.profesional_id === parseInt(profesionalId));
      setIsFavorited(esFavorito);
    } catch (err) {
      console.error('Error al verificar favoritos:', err);
    }
  };

  const toggleFavorite = async () => {
    try {
      if (isFavorited) {
        await eliminarFavorito(profesionalId);
        setIsFavorited(false);
      } else {
        await agregarFavorito(profesionalId);
        setIsFavorited(true);
      }
    } catch (err) {
      alert(err.message || 'Error al actualizar favoritos');
    }
  };

  const reviews = [
    {
      id: 1,
      name: "Juan Soler",
      initials: "JS",
      rating: 5,
      comment: "La Dra. Martínez me ha ayudado enormemente. Su empatía y profesionalismo son excepcionales. Recomiendo totalmente sus servicios.",
      date: "Hace 2 semanas"
    },
    {
      id: 2,
      name: "Ana Vega",
      initials: "AV",
      rating: 5,
      comment: "Una profesional increíble. Me sentí cómoda desde la primera sesión. El proceso ha sido muy transformador para mí.",
      date: "Hace 1 mes"
    },
    {
      id: 3,
      name: "Carlos Ruiz",
      initials: "CR",
      rating: 5,
      comment: "Excelente terapeuta. Me ayudó a superar mis problemas de ansiedad. Muy recomendable.",
      date: "Hace 2 meses"
    }
  ];

  const availableTimes = [
    { time: "09:00", available: true },
    { time: "10:00", available: true },
    { time: "11:00", available: true },
    { time: "14:00", available: true },
    { time: "15:00", available: true }
  ];

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const daysOfWeek = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"];

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; // Ajustar para que Lunes sea 0
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days = [];

    // Días vacíos al inicio
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Días del mes
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const previousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const StarRating = ({ rating }) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg 
            key={star}
            className={`w-4 h-4 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
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
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  if (error || !professional) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ClientNavbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 mb-4">{error || 'Profesional no encontrado'}</p>
            <button
              onClick={() => navigate('/cliente')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Volver al inicio
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ClientNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Columna izquierda - Información del profesional */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header del profesional */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start space-x-6">
                {professional.foto_url ? (
                  <img 
                    src={professional.foto_url}
                    alt={professional.nombre_completo}
                    className="w-32 h-32 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center">
                    <span className="text-4xl font-bold text-white">
                      {professional.nombre?.[0]?.toUpperCase()}{professional.apellido?.[0]?.toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {professional.nombre_completo}
                  </h1>
                  <p className="text-emerald-600 font-medium mb-3">
                    {professional.especialidad}
                  </p>
                  <p className="text-gray-600 mb-4">
                    {professional.descripcion || 'Profesional dedicado a brindar el mejor servicio'}
                  </p>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center space-x-1">
                      <StarRating rating={professional.calificacion_promedio || 0} />
                      <span className="text-sm text-gray-600 ml-2">
                        ({professional.numero_resenas || 0} reseñas)
                      </span>
                    </div>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-600">{professional.experiencia_anos} años de experiencia</span>
                  </div>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center text-gray-600">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {professional.ciudad}
                    </div>
                    {professional.telefono && (
                      <>
                        <span className="text-gray-400">•</span>
                        <div className="flex items-center text-gray-600">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          {professional.telefono}
                        </div>
                      </>
                    )}
                  </div>
                  <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {/* Botón favorito: toggle y persistencia en localStorage */}
                        <button
                          type="button"
                          onClick={toggleFavorite}
                          aria-pressed={isFavorited}
                          className={`p-2 rounded-lg transition-colors focus:outline-none ${isFavorited ? 'bg-red-50' : 'hover:bg-gray-50'}`}
                          title={isFavorited ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                        >
                          {isFavorited ? (
                            <svg className="w-6 h-6 text-red-500" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 4 4 6.5 4c1.54 0 3.04.99 3.57 2.36h.87C13.46 4.99 14.96 4 16.5 4 19 4 21 6 21 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                            </svg>
                          ) : (
                            <svg className="w-6 h-6 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.182 4.318 12.682a4.5 4.5 0 010-6.364z" />
                            </svg>
                          )}
                        </button>

                        {/* Botón secundario (ej. compartir) */}
                        <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                          </svg>
                        </button>
                      </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Servicios */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Servicios y Precios</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border-2 border-gray-200 rounded-lg p-4 hover:border-green-500 transition-colors">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Consulta Profesional
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Sesión completa para evaluar tus necesidades y definir un plan de acción.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-600 text-lg">
                      ${professional.precio_consulta?.toLocaleString()} COP
                    </span>
                    <span className="text-sm text-gray-500">60 min</span>
                  </div>
                </div>
                
                <div className="border-2 border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Información Adicional
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Consulta presencial
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Pago fácil y seguro
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Confirmación inmediata
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Opiniones de Clientes */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Opiniones de Clientes</h2>
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {review.initials}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">{review.name}</h4>
                          <span className="text-sm text-gray-500">{review.date}</span>
                        </div>
                        <StarRating rating={review.rating} />
                        <p className="text-gray-600 mt-2">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Columna derecha - Agendar Cita */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Agendar Cita</h2>

              {/* Calendario */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <button 
                    onClick={previousMonth}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <h3 className="font-semibold text-gray-900">
                    {monthNames[currentMonth]} {currentYear}
                  </h3>
                  <button 
                    onClick={nextMonth}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                {/* Días de la semana */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {daysOfWeek.map((day) => (
                    <div key={day} className="text-center text-xs font-medium text-gray-600">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Días del mes */}
                <div className="grid grid-cols-7 gap-1">
                  {generateCalendarDays().map((day, index) => (
                    <button
                      key={index}
                      onClick={() => day && setSelectedDate(day)}
                      disabled={!day}
                      className={`
                        aspect-square flex items-center justify-center text-sm rounded-lg
                        ${!day ? 'invisible' : ''}
                        ${day === selectedDate ? 'bg-green-500 text-white font-semibold' : 'hover:bg-green-100'}
                        ${day && day !== selectedDate ? 'text-gray-700' : ''}
                        transition-colors
                      `}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fecha seleccionada */}
              <div className="mb-6">
                <p className="text-center font-medium text-gray-900 mb-4">
                  Lunes, 03 de Noviembre 2025
                </p>

                {/* Horarios disponibles */}
                <div className="grid grid-cols-3 gap-2">
                  {availableTimes.map((slot) => (
                    <button
                      key={slot.time}
                      onClick={() => setSelectedTime(slot.time)}
                      className={`
                        py-2 px-3 text-sm font-medium rounded-lg border-2 transition-colors
                        ${selectedTime === slot.time
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'border-gray-200 text-gray-700 hover:border-green-500'
                        }
                      `}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Precio de la consulta */}
              <div className="mb-6 bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 font-medium">Precio de consulta:</span>
                  <span className="text-2xl font-bold text-emerald-600">
                    ${professional.precio_consulta?.toLocaleString()} COP
                  </span>
                </div>
              </div>

              {/* Botón agendar */}
              <button
                onClick={() => {
                  if (selectedDate && selectedTime !== 'sin seleccionar') {
                    // Pasar la fecha y hora seleccionadas como parámetros
                    const fechaCompleta = new Date(currentYear, currentMonth, selectedDate);
                    navigate(`/Confirmacion_cita?id=${profesionalId}&fecha=${fechaCompleta.toISOString()}&hora=${selectedTime}`);
                  } else {
                    alert('Por favor selecciona una fecha y hora para la cita');
                  }
                }}
                className={`w-full text-center font-semibold py-3 rounded-lg transition-colors ${
                  selectedDate && selectedTime !== 'sin seleccionar'
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Agendar Cita
              </button>
              
              <p className="text-xs text-center text-gray-500 mt-3">
                {!selectedDate || selectedTime === 'sin seleccionar' 
                  ? 'Selecciona fecha y hora para continuar'
                  : 'Revisa los detalles y confirma tu cita'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalProfile;