import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ClientNavbar from '../components/Navbar_cliente';
import { getMisCitas, cancelarCita, getToken } from '../api';

const ClientAppointments = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('todas'); // todas, pendiente, confirmada, completada, cancelada
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Verificar autenticación
    const token = getToken();
    if (!token) {
      alert('Debes iniciar sesión para ver tus citas');
      navigate('/login_clientes');
      return;
    }
    cargarCitas();
  }, [navigate]);

  const cargarCitas = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getMisCitas();
      setCitas(data);
    } catch (err) {
      console.error('Error al cargar citas:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelar = async (citaId) => {
    if (!confirm('¿Estás seguro de que quieres cancelar esta cita?')) {
      return;
    }

    try {
      await cancelarCita(citaId);
      alert('Cita cancelada exitosamente');
      cargarCitas(); // Recargar lista
    } catch (err) {
      alert('Error al cancelar cita: ' + err.message);
    }
  };

  const getCitasFiltradas = () => {
    if (activeTab === 'todas') return citas;
    return citas.filter(c => c.estado.toLowerCase() === activeTab);
  };

  const citasFiltradas = getCitasFiltradas();

  // Función para determinar si una cita es futura
  const esCitaFutura = (fechaHora) => {
    return new Date(fechaHora) > new Date();
  };

  const getStatusBadge = (status) => {
    const badges = {
      confirmada: "bg-green-100 text-green-800",
      pendiente: "bg-yellow-100 text-yellow-800",
      completada: "bg-blue-100 text-blue-800",
      cancelada: "bg-red-100 text-red-800"
    };
    const labels = {
      confirmada: "Confirmada",
      pendiente: "Pendiente",
      completada: "Completada",
      cancelada: "Cancelada"
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badges[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  const contarPorEstado = (estado) => {
    return citas.filter(c => c.estado.toLowerCase() === estado).length;
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Mis Citas
        </h1>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('todas')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'todas'
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Todas ({citas.length})
              </button>
              <button
                onClick={() => setActiveTab('pendiente')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'pendiente'
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Pendientes ({contarPorEstado('pendiente')})
              </button>
              <button
                onClick={() => setActiveTab('confirmada')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'confirmada'
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Confirmadas ({contarPorEstado('confirmada')})
              </button>
              <button
                onClick={() => setActiveTab('completada')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'completada'
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Completadas ({contarPorEstado('completada')})
              </button>
              <button
                onClick={() => setActiveTab('cancelada')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'cancelada'
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Canceladas ({contarPorEstado('cancelada')})
              </button>
            </nav>
          </div>
        </div>

        {/* Lista de citas */}
        <div className="space-y-4">
          {citasFiltradas.map((cita) => (
            <div 
              key={cita.id}
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  {/* Avatar del profesional */}
                  <div className="w-16 h-16 rounded-full bg-green-200 flex items-center justify-center text-green-700 text-xl font-bold">
                    {cita.profesional.nombre_completo.split(' ').map(n => n[0]).join('')}
                  </div>

                  {/* Información */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {cita.profesional.nombre_completo}
                        </h3>
                        <p className="text-emerald-600 text-sm font-medium">
                          {cita.profesional.especialidad}
                        </p>
                      </div>
                      {getStatusBadge(cita.estado)}
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600 mb-2">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {formatDate(cita.fecha_hora)}
                      </div>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {formatTime(cita.fecha_hora)}
                      </div>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {cita.duracion_minutos} min
                      </div>
                    </div>

                    {cita.motivo && (
                      <div className="text-sm text-gray-600 mb-2">
                        <strong>Motivo:</strong> {cita.motivo}
                      </div>
                    )}

                    {cita.notas && (
                      <div className="text-sm text-gray-500">
                        <strong>Notas:</strong> {cita.notas}
                      </div>
                    )}

                    <div className="mt-2 text-lg font-bold text-green-600">
                      ${cita.precio.toLocaleString()} COP
                    </div>
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="flex space-x-2 ml-4">
                  {(cita.estado === 'pendiente' || cita.estado === 'confirmada') && esCitaFutura(cita.fecha_hora) && (
                    <>
                      <Link
                        to={`/cliente/cita/${cita.id}`}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        Ver Detalles
                      </Link>
                      <button 
                        onClick={() => handleCancelar(cita.id)}
                        className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-medium transition-colors"
                      >
                        Cancelar
                      </button>
                    </>
                  )}
                  {cita.estado === 'completada' && (
                    <Link
                      to="/inicio_clientes"
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      Agendar Otra
                    </Link>
                  )}
                  {cita.estado === 'cancelada' && (
                    <Link
                      to="/inicio_clientes"
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      Buscar Profesional
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mensaje si no hay citas */}
        {citasFiltradas.length === 0 && !loading && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No tienes citas {activeTab === 'todas' ? '' : activeTab}
            </h3>
            <p className="text-gray-600 mb-4">
              Busca profesionales y agenda tu primera cita
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

export default ClientAppointments;