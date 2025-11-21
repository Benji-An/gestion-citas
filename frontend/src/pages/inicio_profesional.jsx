import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const [periodFilter, setPeriodFilter] = useState('7days');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total_citas: 0,
    citas_completadas: 0,
    citas_pendientes: 0,
    citas_confirmadas: 0,
    ingresos_totales: 0,
    ingresos_mes_actual: 0
  });
  const [proximasCitas, setProximasCitas] = useState([]);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login_clientes');
        return;
      }

      const API_URL = 'http://localhost:8000';

      // Cargar estadísticas
      const responseStats = await fetch(`${API_URL}/api/profesionales/dashboard/estadisticas`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!responseStats.ok) {
        throw new Error('Error al cargar estadísticas');
      }
      
      const statsData = await responseStats.json();
      setStats(statsData);

      // Cargar próximas citas
      const responseCitas = await fetch(`${API_URL}/api/profesionales/dashboard/proximas-citas?limit=5`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!responseCitas.ok) {
        throw new Error('Error al cargar citas');
      }
      
      const citasData = await responseCitas.json();
      setProximasCitas(citasData.citas);

      setLoading(false);
    } catch (error) {
      console.error('Error cargando datos:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login_clientes');
      }
      setLoading(false);
    }
  };

  const formatearFecha = (fechaISO) => {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  const obtenerEstadoColor = (estado) => {
    const colores = {
      'PENDIENTE': 'bg-yellow-100 text-yellow-800',
      'CONFIRMADA': 'bg-blue-100 text-blue-800',
      'COMPLETADA': 'bg-green-100 text-green-800',
      'CANCELADA': 'bg-red-100 text-red-800'
    };
    return colores[estado] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ProfessionalNavbar />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">Cargando datos...</div>
          </div>
        </div>
      </div>
    );
  }

  const citasCanceladas = stats.total_citas - stats.citas_completadas - stats.citas_pendientes - stats.citas_confirmadas;

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
            <div className="text-3xl font-bold text-gray-900 mb-2">{stats.total_citas}</div>
            <div className="text-sm text-gray-600">
              {stats.citas_completadas} completadas
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-sm text-gray-500 mb-1">Ingresos Totales</div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              ${stats.ingresos_totales.toLocaleString()}
            </div>
            <div className="text-sm text-green-600">
              ${stats.ingresos_mes_actual.toLocaleString()} este mes
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-sm text-gray-500 mb-1">Citas Pendientes</div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{stats.citas_pendientes}</div>
            <div className="text-sm text-gray-600">
              {stats.citas_confirmadas} confirmadas
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-sm text-gray-500 mb-1">Citas Canceladas</div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{citasCanceladas || 0}</div>
            <div className="text-sm text-gray-600">
              En total
            </div>
          </div>
        </div>

        {/* Estado de citas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Distribución de estados */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución de Citas</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Completadas</span>
                <span className="text-2xl font-bold text-green-600">{stats.citas_completadas}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Confirmadas</span>
                <span className="text-2xl font-bold text-blue-600">{stats.citas_confirmadas}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Pendientes</span>
                <span className="text-2xl font-bold text-yellow-600">{stats.citas_pendientes}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Canceladas</span>
                <span className="text-2xl font-bold text-red-600">{citasCanceladas || 0}</span>
              </div>
            </div>
          </div>

          {/* Resumen financiero */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen Financiero</h3>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Ingresos Totales</div>
                <div className="text-3xl font-bold text-emerald-700">
                  ${stats.ingresos_totales.toLocaleString()}
                </div>
              </div>
              <div className="p-4 bg-gradient-to-r from-cyan-50 to-cyan-100 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Ingresos Este Mes</div>
                <div className="text-3xl font-bold text-cyan-700">
                  ${stats.ingresos_mes_actual.toLocaleString()}
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Promedio por Cita</div>
                <div className="text-2xl font-bold text-gray-700">
                  ${stats.citas_completadas > 0 
                    ? Math.round(stats.ingresos_totales / stats.citas_completadas).toLocaleString() 
                    : 0}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 gap-6">
          {/* Próximas Citas */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Próximas Citas</h3>
              <button 
                onClick={() => navigate('/panelcitas_profesional')}
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Ver todas →
              </button>
            </div>

            {proximasCitas.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No tienes citas próximas
              </div>
            ) : (
              <div className="space-y-3">
                {proximasCitas.map((cita) => (
                  <div key={cita.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg border">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                          <span className="text-emerald-700 font-bold text-sm">
                            {cita.cliente.nombre_completo.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{cita.cliente.nombre_completo}</div>
                          <div className="text-sm text-gray-500">{cita.cliente.email}</div>
                        </div>
                      </div>
                      <div className="ml-13 space-y-1">
                        <div className="text-sm text-gray-700">
                          <span className="font-medium">Motivo:</span> {cita.motivo || 'Consulta general'}
                        </div>
                        <div className="text-sm text-gray-500">
                          Duración: {cita.duracion_minutos} minutos
                        </div>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-sm font-medium text-gray-900 mb-2">
                        {formatearFecha(cita.fecha_hora)}
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${obtenerEstadoColor(cita.estado)}`}>
                        {cita.estado}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Acciones rápidas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              onClick={() => navigate('/agenda_profesional')}
              className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-center"
            >
              <div className="text-3xl mb-2">📅</div>
              <div className="font-semibold text-gray-900 mb-1">Mi Agenda</div>
              <div className="text-sm text-gray-500">Gestiona tu calendario</div>
            </button>

            <button 
              onClick={() => navigate('/panelcitas_profesional')}
              className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-center"
            >
              <div className="text-3xl mb-2">📋</div>
              <div className="font-semibold text-gray-900 mb-1">Mis Citas</div>
              <div className="text-sm text-gray-500">Ver todas las citas</div>
            </button>

            <button 
              onClick={() => navigate('/perfil_profesional')}
              className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-center"
            >
              <div className="text-3xl mb-2">⚙️</div>
              <div className="font-semibold text-gray-900 mb-1">Mi Perfil</div>
              <div className="text-sm text-gray-500">Editar información</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalDashboard;