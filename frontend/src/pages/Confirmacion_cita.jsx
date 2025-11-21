import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ClientNavbar from '../components/Navbar_cliente';
import { getProfesional, agendarCita } from '../api';

const BookAppointment = () => {
  const [searchParams] = useSearchParams();
  const profesionalId = searchParams.get('id');
  const fechaParam = searchParams.get('fecha');
  const horaParam = searchParams.get('hora');
  const navigate = useNavigate();
  
  // Obtener fecha de los parámetros o usar fecha actual
  const fechaSeleccionada = fechaParam ? new Date(fechaParam) : new Date();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedService, setSelectedService] = useState(null);
  const [appointmentType, setAppointmentType] = useState('videollamada');
  const [selectedDate] = useState(fechaSeleccionada.getDate());
  const [selectedTime] = useState(horaParam || null);
  const [currentMonth] = useState(fechaSeleccionada.getMonth());
  const [currentYear] = useState(fechaSeleccionada.getFullYear());
  const [formData, setFormData] = useState({
    motivo: '',
    notas: ''
  });

  const [professional, setProfessional] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const services = [
    {
      id: 1,
      name: "Consulta General",
      duration: 30,
      price: 50000
    },
    {
      id: 2,
      name: "Consulta de Seguimiento",
      duration: 20,
      price: 35000
    },
    {
      id: 3,
      name: "Consulta Completa",
      duration: 60,
      price: 80000
    }
  ];

  useEffect(() => {
    const cargarProfesional = async () => {
      if (!profesionalId) {
        setError('No se especificó un profesional');
        setLoading(false);
        return;
      }

      if (!fechaParam || !horaParam) {
        setError('Debes seleccionar fecha y hora desde la página del profesional');
        setLoading(false);
        return;
      }

      try {
        const data = await getProfesional(profesionalId);
        setProfessional(data);
      } catch (err) {
        console.error('Error al cargar profesional:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    cargarProfesional();
  }, [profesionalId, fechaParam, horaParam]);

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

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime || !selectedService) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    try {
      console.log('=== INICIO CONFIRMACIÓN ===');
      console.log('selectedTime:', selectedTime);
      console.log('selectedService:', selectedService);
      console.log('fechaSeleccionada original:', fechaSeleccionada);
      
      // Crear fecha y hora en formato ISO usando la fecha que viene de los parámetros
      const [hora, minuto] = selectedTime.replace(' AM', '').replace(' PM', '').split(':');
      let hora24 = parseInt(hora);
      if (selectedTime.includes('PM') && hora24 !== 12) hora24 += 12;
      if (selectedTime.includes('AM') && hora24 === 12) hora24 = 0;
      
      console.log('Hora parseada - hora24:', hora24, 'minuto:', minuto);
      
      // Usar la fecha seleccionada que ya viene parseada
      const fechaHora = new Date(fechaSeleccionada);
      fechaHora.setHours(hora24, parseInt(minuto), 0, 0);
      
      console.log('fechaHora con setHours:', fechaHora);
      console.log('fechaHora.toISOString():', fechaHora.toISOString());

      // Preparar datos para la API
      const citaData = {
        profesional_id: parseInt(profesionalId),
        fecha_hora: fechaHora.toISOString(),
        duracion_minutos: selectedService.duration,
        motivo: formData.motivo || selectedService.name,
        notas: formData.notas || '',
        precio: selectedService.price
      };

      console.log('citaData completo:', JSON.stringify(citaData, null, 2));

      // Crear la cita
      console.log('Llamando a agendarCita...');
      const citaCreada = await agendarCita(citaData);
      
      console.log('✅ Cita creada exitosamente:', citaCreada);
      
      // Navegar a pasarela de pago con los datos
      navigate('/Pasarela_pago', { 
        state: { 
          cita: citaCreada,
          servicio: selectedService,
          profesional: professional,
          tipo: appointmentType,
          fechaTexto: `${selectedDate} de ${monthNames[currentMonth]}, ${currentYear}`,
          hora: selectedTime
        } 
      });
    } catch (err) {
      console.error('❌ Error al agendar cita:', err);
      console.error('Detalles del error:', err.message);
      alert('Error al agendar la cita: ' + err.message);
    }
  };

  const getProgressPercentage = () => {
    return (currentStep / 3) * 100;
  };

  const getDayName = (day) => {
    const date = new Date(currentYear, currentMonth, day);
    const dayNames = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    return dayNames[date.getDay()];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ClientNavbar />
        <div className="max-w-6xl mx-auto px-4 py-8 text-center">
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  if (error || !professional) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ClientNavbar />
        <div className="max-w-6xl mx-auto px-4 py-8 text-center">
          <p className="text-red-600">{error || 'Profesional no encontrado'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ClientNavbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Título */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Reserva tu Cita
        </h1>
        <p className="text-gray-600 mb-8">
          con {professional.nombre} {professional.apellido} - {professional.especialidad}
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

            {/* Paso 2: Fecha y Hora Seleccionadas */}
            {currentStep >= 2 && selectedService && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Fecha y Hora de tu Cita
                </h2>

                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
                  <div className="flex items-center justify-center mb-4">
                    <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  
                  <div className="text-center space-y-3">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Fecha seleccionada:</p>
                      <p className="text-xl font-bold text-gray-900">
                        {getDayName(selectedDate)}, {selectedDate} de {monthNames[currentMonth]}, {currentYear}
                      </p>
                    </div>
                    
                    <div className="pt-3 border-t border-green-200">
                      <p className="text-sm text-gray-600 mb-1">Hora seleccionada:</p>
                      <p className="text-xl font-bold text-gray-900">
                        {selectedTime}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 text-center">
                    <p className="text-xs text-gray-500">
                      ✓ Fecha y hora confirmadas
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Paso 3: Confirmar Datos */}
            {currentStep === 3 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Detalles de la Cita
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Motivo de la Consulta
                    </label>
                    <input
                      type="text"
                      name="motivo"
                      value={formData.motivo}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                      placeholder="Ej: Consulta general"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notas Adicionales (Opcional)
                    </label>
                    <textarea
                      name="notas"
                      value={formData.notas}
                      onChange={handleInputChange}
                      rows="4"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                      placeholder="Describe síntomas o información relevante..."
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
                    setCurrentStep(currentStep + 1);
                  }}
                  className="ml-auto px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
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
                      ${selectedService ? selectedService.price.toLocaleString('es-CO') : 0}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-right">COP (Pesos Colombianos)</p>
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