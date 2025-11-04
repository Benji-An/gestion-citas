import React, { useState } from 'react';
import ClientNavbar from '../components/Navbar_cliente';
import { Link } from 'react-router-dom';

const ProfessionalProfile = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('11:00');
  const [currentMonth, setCurrentMonth] = useState(5); // Junio (0-indexed)
  const [currentYear, setCurrentYear] = useState(2024);

  const professional = {
    name: "Dra. Isabel Martínez",
    specialty: "Psicóloga Clínica",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    description: "Licenciada en Psicología con más de 10 años de experiencia en terapia cognitivo-conductual y terapia de pareja. Mi enfoque es crear un espacio seguro y de confianza para el crecimiento personal.",
    rating: 4.9,
    reviews: 124
  };

  const services = [
    {
      id: 1,
      name: "Consulta Inicial",
      description: "Sesión completa para evaluar tus necesidades y definir un plan de acción.",
      price: "$80",
      duration: "60 min"
    },
    {
      id: 2,
      name: "Sesión de Seguimiento",
      description: "Sesión de 45 minutos para dar continuidad a tu plan de tratamiento.",
      price: "$60",
      duration: "45 min"
    },
    {
      id: 3,
      name: "Terapia de Pareja",
      description: "Sesión de una hora para que las parejas aborden sus desafíos.",
      price: "$120",
      duration: "60 min"
    }
  ];

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
                <img 
                  src={professional.image}
                  alt={professional.name}
                  className="w-32 h-32 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {professional.name}
                  </h1>
                  <p className="text-teal-600 font-medium mb-3">
                    {professional.specialty}
                  </p>
                  <p className="text-gray-600 mb-4">
                    {professional.description}
                  </p>
                  <div className="flex items-center space-x-4">
                    <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </button>
                    <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Servicios */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Servicios</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {services.map((service) => (
                  <div 
                    key={service.id}
                    className="border-2 border-gray-200 rounded-lg p-4 hover:border-teal-500 transition-colors cursor-pointer"
                  >
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {service.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {service.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-900">{service.price}</span>
                      <span className="text-sm text-gray-500">{service.duration}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Opiniones de Clientes */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Opiniones de Clientes</h2>
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center text-white font-semibold">
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
                        ${day === selectedDate ? 'bg-cyan-500 text-white font-semibold' : 'hover:bg-gray-100'}
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
                          ? 'bg-cyan-500 border-cyan-500 text-white'
                          : 'border-gray-200 text-gray-700 hover:border-cyan-500'
                        }
                      `}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Botón agendar */}
              <button className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-3 rounded-lg transition-colors">
                Agendar Cita
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalProfile;