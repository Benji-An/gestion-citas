import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ClientNavbar from '../components/Navbar_cliente';

const BookAppointment = () => {
  // Obtener fecha actual
  const today = new Date();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedService, setSelectedService] = useState(null);
  const [appointmentType, setAppointmentType] = useState('videollamada');
  const [selectedDate, setSelectedDate] = useState(null); // Solo guarda el día (número)
  const [selectedTime, setSelectedTime] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(today.getMonth()); // Mes actual
  const [currentYear, setCurrentYear] = useState(today.getFullYear()); // Año actual
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: ''
  });

  const navigate = useNavigate();

  const professional = {
    name: "Dra. Isabel Martínez",
    specialty: "Psicóloga Clínica"
  };

  const services = [
    {
      id: 1,
      name: "Consulta General",
      duration: "30 minutos",
      price: 50
    },
    {
      id: 2,
      name: "Consulta de Seguimiento",
      duration: "20 minutos",
      price: 35
    },
    {
      id: 3,
      name: "Examen Completo",
      duration: "1 hora",
      price: 120
    }
  ];

  const availableTimes = [
    { time: "09:00 AM", available: true },
    { time: "10:00 AM", available: true },
    { time: "11:00 AM", available: true },
    { time: "02:00 PM", available: true },
    { time: "03:00 PM", available: true },
    { time: "04:00 PM", available: true }
  ];

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const daysOfWeek = ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"];

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
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

  const previousMonth = (e) => {
    e.preventDefault();
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = (e) => {
    e.preventDefault();
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleDateClick = (e, day) => {
    e.preventDefault();
    e.stopPropagation();
    if (day) {
      setSelectedDate(day);
      console.log('Fecha seleccionada:', day, monthNames[currentMonth], currentYear);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleConfirmBooking = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para confirmar la reserva
    const bookingData = {
      service: selectedService,
      type: appointmentType,
      date: `${selectedDate} de ${monthNames[currentMonth]}, ${currentYear}`,
      time: selectedTime,
      ...formData
    };
    console.log('Reserva confirmada (navegando a pago):', bookingData);

    navigate('/Pasarela_pago', { state: { bookingData } });
  };

  const getProgressPercentage = () => {
    return (currentStep / 3) * 100;
  };

  const getDayName = (day) => {
    const date = new Date(currentYear, currentMonth, day);
    const dayNames = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    return dayNames[date.getDay()];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ClientNavbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Título */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Reserva tu Cita
        </h1>
        <p className="text-gray-600 mb-8">
          con {professional.name} - {professional.specialty}
        </p>

        {/* Barra de progreso */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Paso {currentStep} de 3
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${getProgressPercentage()}%` }}
            ></div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Paso 1: Seleccionar Servicio */}
            {currentStep >= 1 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Selecciona un Servicio
                </h2>
                <div className="space-y-3">
                  {services.map((service) => (
                    <button
                      key={service.id}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedService(service);
                      }}
                      className={`w-full text-left p-4 border-2 rounded-lg transition-all ${
                        selectedService?.id === service.id
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-green-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">
                            {service.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {service.duration} - ${service.price}
                          </p>
                        </div>
                        {selectedService?.id === service.id && (
                          <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Paso 2: Tipo de Cita */}
            {currentStep >= 2 && selectedService && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Tipo de Cita
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setAppointmentType('presencial');
                    }}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      appointmentType === 'presencial'
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                  >
                    <svg className="w-8 h-8 text-gray-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="font-semibold text-gray-900">Presencial</p>
                    <p className="text-sm text-gray-600">Cita en la clínica</p>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setAppointmentType('videollamada');
                    }}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      appointmentType === 'videollamada'
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                  >
                    <svg className="w-8 h-8 text-gray-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <p className="font-semibold text-gray-900">Videollamada</p>
                    <p className="text-sm text-gray-600">Cita online</p>
                  </button>
                </div>
              </div>
            )}

            {/* Paso 2: Fecha y Hora */}
            {currentStep >= 2 && selectedService && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Elige una Fecha y Hora
                </h2>

                {/* Calendario */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <button 
                      type="button"
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
                      type="button"
                      onClick={nextMonth}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>

                  {/* Días de la semana */}
                  <div className="grid grid-cols-7 gap-2 mb-2">
                    {daysOfWeek.map((day) => (
                      <div key={day} className="text-center text-sm font-medium text-gray-600">
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Días del mes */}
                  <div className="grid grid-cols-7 gap-2">
                    {generateCalendarDays().map((day, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={(e) => handleDateClick(e, day)}
                        disabled={!day}
                        className={`
                          aspect-square flex items-center justify-center text-sm rounded-lg
                          ${!day ? 'invisible' : ''}
                          ${day && selectedDate === day ? 'bg-green-500 text-white font-semibold' : ''}
                          ${day && selectedDate !== day ? 'hover:bg-gray-100 text-gray-700' : ''}
                          transition-colors disabled:cursor-default
                        `}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Horarios Disponibles */}
                {selectedDate && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Horarios Disponibles
                    </h3>
                    <div className="grid grid-cols-3 gap-3">
                      {availableTimes.map((slot) => (
                        <button
                          key={slot.time}
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setSelectedTime(slot.time);
                          }}
                          className={`
                            py-3 px-4 text-sm font-medium rounded-lg border-2 transition-colors
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
                )}
              </div>
            )}

            {/* Paso 3: Confirmar Datos */}
            {currentStep === 3 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Confirma tus Datos
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre Completo
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                      placeholder="Juan Pérez"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Correo Electrónico
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                      placeholder="tu@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Número de Teléfono
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                      placeholder="+57 300 123 4567"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Botones de navegación */}
            <div className="flex justify-between">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentStep(currentStep - 1);
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Anterior
                </button>
              )}
              {currentStep < 3 && selectedService && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentStep === 2 && (!selectedDate || !selectedTime)) {
                      alert('Por favor selecciona una fecha y hora');
                      return;
                    }
                    setCurrentStep(currentStep + 1);
                  }}
                  disabled={currentStep === 2 && (!selectedDate || !selectedTime)}
                  className="ml-auto px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Siguiente
                </button>
              )}
            </div>
          </div>

          {/* Columna derecha - Resumen */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Resumen de la Cita
              </h2>
              
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-600">Servicio:</p>
                  <p className="font-semibold text-gray-900">
                    {selectedService ? selectedService.name : '-'}
                  </p>
                </div>

                <div>
                  <p className="text-gray-600">Tipo:</p>
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <p className="font-semibold text-gray-900">
                      {appointmentType === 'videollamada' ? 'Videollamada' : 'Presencial'}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-gray-600">Fecha:</p>
                  <p className="font-semibold text-gray-900">
                    {selectedDate ? `${getDayName(selectedDate)}, ${selectedDate} de ${monthNames[currentMonth]}, ${currentYear}` : '-'}
                  </p>
                </div>

                <div>
                  <p className="text-gray-600">Hora:</p>
                  <p className="font-semibold text-gray-900">
                    {selectedTime || '-'}
                  </p>
                </div>

                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <p className="text-gray-900 font-bold">Total:</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${selectedService ? selectedService.price : 0}
                    </p>
                  </div>
                </div>
              </div>

              {currentStep === 3 && (
                <button
                  type="button"
                  onClick={handleConfirmBooking}
                  className="w-full mt-6 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Confirmar Reserva</span>
                </button>
              )}
              {currentStep === 4 && (
                <div className="mt-6">
                  <p className="text-green-500 font-semibold text-center">¡Cita reservada con exito!</p>
                  <p className="text-gray-900 text-center">Gracias por tu reserva, te esperamos en el salon de citas.</p>    
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;