import React, { useState, useEffect } from 'react';
import { getMisNotificaciones, marcarNotificacionLeida, marcarTodasLeidas, eliminarNotificacion } from '../api';
import ClientNavbar from '../components/Navbar_cliente';

const NotificacionesCliente = () => {
  const [notificaciones, setNotificaciones] = useState([]);
  const [filtro, setFiltro] = useState('todas'); // 'todas', 'no_leidas', 'leidas'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarNotificaciones();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtro]);

  const cargarNotificaciones = async () => {
    setLoading(true);
    setError('');
    try {
      let leidas = null;
      if (filtro === 'no_leidas') leidas = false;
      if (filtro === 'leidas') leidas = true;
      
      const data = await getMisNotificaciones(leidas, 100);
      setNotificaciones(data);
    } catch (err) {
      setError(err.message || 'Error al cargar notificaciones');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarcarLeida = async (notifId) => {
    try {
      await marcarNotificacionLeida(notifId);
      await cargarNotificaciones();
    } catch {
      alert('Error al marcar como leída');
    }
  };

  const handleMarcarTodasLeidas = async () => {
    try {
      await marcarTodasLeidas();
      await cargarNotificaciones();
    } catch {
      alert('Error al marcar todas como leídas');
    }
  };

  const handleEliminar = async (notifId) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta notificación?')) return;
    
    try {
      await eliminarNotificacion(notifId);
      await cargarNotificaciones();
    } catch {
      alert('Error al eliminar notificación');
    }
  };

  const formatearFecha = (fecha) => {
    const date = new Date(fecha);
    const ahora = new Date();
    const diffMs = ahora - date;
    const diffDias = Math.floor(diffMs / 86400000);

    if (diffDias === 0) {
      return `Hoy a las ${date.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDias === 1) {
      return `Ayer a las ${date.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDias < 7) {
      return `${diffDias} días atrás`;
    } else {
      return date.toLocaleDateString('es-CO', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const getIconoPorTipo = (tipo) => {
    const iconos = {
      'cita_confirmada': { emoji: '📅', color: 'bg-green-100 text-green-600' },
      'cita_cancelada': { emoji: '❌', color: 'bg-red-100 text-red-600' },
      'cita_reagendada': { emoji: '🔄', color: 'bg-blue-100 text-blue-600' },
      'recordatorio': { emoji: '⏰', color: 'bg-yellow-100 text-yellow-600' },
      'pago_exitoso': { emoji: '💰', color: 'bg-emerald-100 text-emerald-600' },
      'pago_fallido': { emoji: '⚠️', color: 'bg-orange-100 text-orange-600' },
      'mensaje': { emoji: '💬', color: 'bg-purple-100 text-purple-600' },
      'sistema': { emoji: '⚙️', color: 'bg-gray-100 text-gray-600' }
    };
    return iconos[tipo] || { emoji: '📬', color: 'bg-gray-100 text-gray-600' };
  };

  const noLeidas = notificaciones.filter(n => !n.leida).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <ClientNavbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Notificaciones</h1>
          <p className="text-gray-600">
            Mantente al día con todas tus actualizaciones
          </p>
        </div>

        {/* Estadísticas */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Notificaciones totales</p>
              <p className="text-2xl font-bold text-gray-900">{notificaciones.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Sin leer</p>
              <p className="text-2xl font-bold text-blue-600">{noLeidas}</p>
            </div>
            {noLeidas > 0 && (
              <button
                onClick={handleMarcarTodasLeidas}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Marcar todas como leídas
              </button>
            )}
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setFiltro('todas')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filtro === 'todas'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setFiltro('no_leidas')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filtro === 'no_leidas'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              No leídas ({noLeidas})
            </button>
            <button
              onClick={() => setFiltro('leidas')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filtro === 'leidas'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Leídas
            </button>
          </div>
        </div>

        {/* Mensajes de estado */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Lista de notificaciones */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : notificaciones.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">🔔</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No hay notificaciones
            </h3>
            <p className="text-gray-600">
              {filtro === 'todas' 
                ? 'No tienes ninguna notificación aún'
                : filtro === 'no_leidas'
                ? 'No tienes notificaciones sin leer'
                : 'No tienes notificaciones leídas'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notificaciones.map(notif => {
              const icono = getIconoPorTipo(notif.tipo);
              return (
                <div
                  key={notif.id}
                  className={`bg-white rounded-lg shadow-sm p-6 transition-all hover:shadow-md ${
                    !notif.leida ? 'border-l-4 border-blue-500' : ''
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    {/* Icono */}
                    <div className={`w-12 h-12 rounded-full ${icono.color} flex items-center justify-center text-2xl flex-shrink-0`}>
                      {icono.emoji}
                    </div>

                    {/* Contenido */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {notif.titulo}
                          </h3>
                          {!notif.leida && (
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                              Nueva
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => handleEliminar(notif.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                          title="Eliminar notificación"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>

                      <p className="text-gray-700 mb-3 leading-relaxed">
                        {notif.mensaje}
                      </p>

                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500">
                          {formatearFecha(notif.created_at)}
                        </p>
                        {!notif.leida && (
                          <button
                            onClick={() => handleMarcarLeida(notif.id)}
                            className="text-sm text-green-600 hover:text-green-700 font-medium hover:underline"
                          >
                            Marcar como leída
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificacionesCliente;
