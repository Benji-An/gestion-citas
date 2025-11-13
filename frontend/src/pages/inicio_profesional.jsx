import React, { useState, useMemo } from 'react';
import ProfessionalNavbar from '../components/Navbar_profesional';

const BarChart = ({ data }) => {
  const max = Math.max(...data.map(d => d.value));
  
  return (
    <div className="flex items-end justify-between gap-2 h-48">
      {data.map((item, idx) => {
        const heightPercent = (item.value / max) * 100;
        return (
          <div key={idx} className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full bg-gray-100 rounded-t" style={{ height: '100%' }}>
              <div
                className="bg-cyan-500 rounded-t transition-all duration-300 w-full"
                style={{ height: `${heightPercent}%`, marginTop: `${100 - heightPercent}%` }}
              />
            </div>
            <div className="text-xs text-gray-500">{item.label}</div>
          </div>
        );
      })}
    </div>
  );
};

const ProgressBar = ({ label, value, color = 'cyan' }) => {
  const colorClasses = {
    cyan: 'bg-cyan-500',
    yellow: 'bg-yellow-500',
    blue: 'bg-blue-500',
    red: 'bg-red-500',
  };

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-700">{label}</span>
        <span className="text-sm font-semibold text-gray-900">{value}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`${colorClasses[color]} h-2.5 rounded-full transition-all duration-300`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
};

const StarRating = ({ rating }) => {
  return (
    <div className="flex gap-0.5">
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

const ProfessionalDashboard = () => {
  const [periodFilter, setPeriodFilter] = useState('7days'); // 7days, 30days, year

  // Mock data (reemplazar con API)
  const stats = {
    totalAppointments: 125,
    totalIncome: 8450,
    canceledAppointments: 12,
    averageRating: 4.8,
    appointmentsChange: 5,
    incomeChange: 8,
    canceledChange: -12,
    ratingChange: -1,
  };

  const financialPerformance = [
    { label: 'Lun', value: 850 },
    { label: 'Mar', value: 1200 },
    { label: 'Mié', value: 950 },
    { label: 'Jue', value: 2100 },
    { label: 'Vie', value: 1850 },
    { label: 'Sáb', value: 750 },
    { label: 'Dom', value: 650 },
  ];

  const popularServices = [
    { name: 'Corte de pelo', value: 85, color: 'cyan' },
    { name: 'Tratamiento capilar', value: 60, color: 'yellow' },
    { name: 'Consulta inicial', value: 45, color: 'blue' },
    { name: 'Tratamiento facial', value: 30, color: 'red' },
  ];

  const upcomingAppointments = [
    {
      id: 1,
      patient: 'Ana Castillo',
      service: 'Corte de pelo',
      time: '10:00 AM',
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    },
    {
      id: 2,
      patient: 'Bruno Morales',
      service: 'Consulta inicial',
      time: '11:30 AM',
      avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    },
    {
      id: 3,
      patient: 'Carla Ríos',
      service: 'Manicura',
      time: '01:00 PM',
      avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
    },
  ];

  const recentReviews = [
    {
      id: 1,
      patient: 'David Gómez',
      rating: 4.5,
      comment: '¡Excelente servicio, muy profesional y atento a los detalles. ¡Volveré!',
      date: '2025-11-10',
    },
    {
      id: 2,
      patient: 'Elena Fernández',
      rating: 5.0,
      comment: 'El mejor corte que me han hecho. Ambiente muy agradable.',
      date: '2025-11-09',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <ProfessionalNavbar />
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Header with filters */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Resumen de Actividad</h1>
          
          <div className="flex gap-2">
            <button
              onClick={() => setPeriodFilter('7days')}
              className={`px-4 py-2 text-sm rounded ${
                periodFilter === '7days'
                  ? 'bg-white border-2 border-emerald-500 text-emerald-600 font-medium'
                  : 'bg-white border text-gray-600'
              }`}
            >
              Últimos 7 días
            </button>
            <button
              onClick={() => setPeriodFilter('30days')}
              className={`px-4 py-2 text-sm rounded ${
                periodFilter === '30days'
                  ? 'bg-white border-2 border-emerald-500 text-emerald-600 font-medium'
                  : 'bg-white border text-gray-600'
              }`}
            >
              Últimos 30 días
            </button>
            <button
              onClick={() => setPeriodFilter('year')}
              className={`px-4 py-2 text-sm rounded ${
                periodFilter === 'year'
                  ? 'bg-white border-2 border-emerald-500 text-emerald-600 font-medium'
                  : 'bg-white border text-gray-600'
              }`}
            >
              Este año
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-sm text-gray-500 mb-1">Total de Citas</div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{stats.totalAppointments}</div>
            <div className={`text-sm ${stats.appointmentsChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.appointmentsChange >= 0 ? '+' : ''}{stats.appointmentsChange}% vs. semana pasada
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-sm text-gray-500 mb-1">Ingresos Totales</div>
            <div className="text-3xl font-bold text-gray-900 mb-2">${stats.totalIncome.toLocaleString()}</div>
            <div className={`text-sm ${stats.incomeChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.incomeChange >= 0 ? '+' : ''}{stats.incomeChange}% vs. semana pasada
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-sm text-gray-500 mb-1">Citas Canceladas</div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{stats.canceledAppointments}</div>
            <div className={`text-sm ${stats.canceledChange <= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.canceledChange >= 0 ? '+' : ''}{stats.canceledChange}% vs. semana pasada
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-sm text-gray-500 mb-1">Valoración Media</div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{stats.averageRating.toFixed(1)}</div>
            <div className={`text-sm ${stats.ratingChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.ratingChange >= 0 ? '+' : ''}{stats.ratingChange}% vs. semana pasada
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Financial Performance Chart */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Rendimiento Financiero</h3>
            <BarChart data={financialPerformance} />
          </div>

          {/* Popular Services */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Servicios Más Populares</h3>
            <div className="mt-4">
              {popularServices.map((service, idx) => (
                <ProgressBar key={idx} label={service.name} value={service.value} color={service.color} />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Appointments */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Próximas Citas</h3>
            <div className="space-y-4">
              {upcomingAppointments.map((apt) => (
                <div key={apt.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <img src={apt.avatar} alt={apt.patient} className="w-10 h-10 rounded-full" />
                    <div>
                      <div className="font-medium text-gray-900">{apt.patient}</div>
                      <div className="text-sm text-gray-500">{apt.service}</div>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-gray-900">{apt.time}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Reviews */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Últimas Valoraciones</h3>
            <div className="space-y-4">
              {recentReviews.map((review) => (
                <div key={review.id} className="border-b pb-4 last:border-b-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium text-gray-900">{review.patient}</div>
                    <StarRating rating={review.rating} />
                  </div>
                  <p className="text-sm text-gray-600 italic">"{review.comment}"</p>
                  <div className="text-xs text-gray-400 mt-2">
                    {new Date(review.date).toLocaleDateString('es-ES')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalDashboard;