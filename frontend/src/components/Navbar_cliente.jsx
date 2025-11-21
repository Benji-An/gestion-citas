import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMisNotificaciones, getContadorNoLeidas, marcarNotificacionLeida, marcarTodasLeidas, getPerfil } from '../api';

// Small notification bell + dropdown component
function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);

  // Cargar notificaciones al montar el componente
  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('🔑 Token presente:', !!token);
    if (token) {
      cargarNotificaciones();
      cargarContador();
      
      // Actualizar cada 30 segundos
      const interval = setInterval(() => {
        cargarNotificaciones();
        cargarContador();
      }, 30000);
      
      return () => clearInterval(interval);
    } else {
      console.warn('⚠️ No hay token de autenticación');
    }
  }, []);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const cargarNotificaciones = async () => {
    try {
      setLoading(true);
      console.log('🔄 Cargando notificaciones... v2');
      const data = await getMisNotificaciones(null, 10); // Últimas 10 notificaciones
      console.log('✅ Notificaciones recibidas:', data);
      console.log('📊 Cantidad:', data?.length || 0);
      
      if (Array.isArray(data)) {
        setNotifications(data);
      } else {
        console.warn('⚠️ Data no es un array:', typeof data);
        setNotifications([]);
      }
    } catch (err) {
      console.error('❌ Error al cargar notificaciones:', err);
      console.error('Detalles del error:', err.message);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const cargarContador = async () => {
    try {
      console.log('📊 Cargando contador...');
      const data = await getContadorNoLeidas();
      console.log('✅ Contador recibido:', data);
      setUnreadCount(data.count || 0);
    } catch (err) {
      console.error('❌ Error al cargar contador:', err);
      setUnreadCount(0);
    }
  };

  const handleMarcarLeida = async (notifId) => {
    try {
      await marcarNotificacionLeida(notifId);
      await cargarNotificaciones();
      await cargarContador();
    } catch (err) {
      console.error('Error al marcar como leída:', err);
    }
  };

  const handleMarcarTodasLeidas = async () => {
    try {
      setLoading(true);
      await marcarTodasLeidas();
      await cargarNotificaciones();
      await cargarContador();
    } catch (err) {
      console.error('Error al marcar todas como leídas:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatearTiempo = (fecha) => {
    const ahora = new Date();
    const fechaNotif = new Date(fecha);
    const diffMs = ahora - fechaNotif;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHoras = Math.floor(diffMs / 3600000);
    const diffDias = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHoras < 24) return `${diffHoras}h`;
    return `${diffDias}d`;
  };

  const getIconoPorTipo = (tipo) => {
    const iconos = {
      'cita_confirmada': '📅',
      'cita_cancelada': '❌',
      'cita_reagendada': '🔄',
      'recordatorio': '⏰',
      'pago_exitoso': '💰',
      'pago_fallido': '⚠️',
      'mensaje': '💬',
      'sistema': '⚙️'
    };
    return iconos[tipo] || '📬';
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(v => !v)}
        className="relative p-2 rounded-full hover:bg-gray-100 focus:outline-none transition-colors"
        aria-label="Notificaciones"
      >
        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 min-w-[20px] h-5 flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 max-h-[500px] flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-sm text-gray-800">Notificaciones</span>
              {unreadCount > 0 && (
                <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full font-medium">
                  {unreadCount} nuevas
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button 
                onClick={handleMarcarTodasLeidas} 
                disabled={loading}
                className="text-xs text-green-600 hover:text-green-700 hover:underline disabled:opacity-50"
              >
                {loading ? 'Marcando...' : 'Marcar todas'}
              </button>
            )}
          </div>
          
          <div className="overflow-y-auto flex-1">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
                <p className="text-sm text-gray-500">Cargando...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-4xl mb-2">🔔</div>
                <p className="text-sm text-gray-500">No hay notificaciones</p>
              </div>
            ) : (
              notifications.map(notif => (
                <div 
                  key={notif.id} 
                  onClick={() => !notif.leida && handleMarcarLeida(notif.id)}
                  className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 ${
                    !notif.leida ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl flex-shrink-0 mt-0.5">
                      {getIconoPorTipo(notif.tipo)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-semibold text-gray-800 truncate">
                          {notif.titulo}
                        </p>
                        {!notif.leida && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 ml-2"></span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {notif.mensaje}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatearTiempo(notif.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {notifications.length > 0 && (
            <div className="px-4 py-2 border-t bg-gray-50">
              <Link 
                to="/cliente/notificaciones"
                className="text-xs text-center text-green-600 hover:text-green-700 font-medium block"
                onClick={() => setOpen(false)}
              >
                Ver todas las notificaciones
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const ClientNavbar = () => {
  const [userData, setUserData] = useState({ nombre: '', apellido: '', foto_perfil: null });

  useEffect(() => {
    const cargarDatosUsuario = async () => {
      try {
        const data = await getPerfil();
        setUserData({ 
          nombre: data.nombre || '', 
          apellido: data.apellido || '',
          foto_perfil: data.foto_perfil || null
        });
      } catch (err) {
        console.error('Error al cargar datos del usuario:', err);
      }
    };
    cargarDatosUsuario();
  }, []);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo y nombre */}
          <Link to="/cliente" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                <img src="/Tiiwa.png" alt="Logo" />
            </div>
            <span className="text-gray-700 font-medium text-base">
              Tiiwa
            </span>
          </Link>

          {/* Menú de navegación */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to="/cliente"
              className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
            >
              Profesionales
            </Link>
            <Link 
              to="/cliente/citas"
              className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
            >
              Mis Citas
            </Link>
            <Link 
              to="/cliente/favoritos"
              className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
            >
              Favoritos
            </Link>
            <Link 
              to="/cliente/pagos"
              className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
            >
              Mis Pagos
            </Link>

          {/* Botón de notificaciones */}
            <NotificationBell />

            {/* Avatar de usuario */}
            <div className="relative group">
              <button className="flex items-center space-x-2 focus:outline-none">
                {userData.foto_perfil ? (
                  <img
                    src={userData.foto_perfil}
                    alt="Usuario"
                    className="w-8 h-8 rounded-full object-cover border-2 border-gray-300"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center border-2 border-gray-300">
                    <span className="text-xs font-bold text-white">
                      {userData.nombre?.[0]?.toUpperCase() || 'U'}{userData.apellido?.[0]?.toUpperCase() || ''}
                    </span>
                  </div>
                )}
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown menu */}
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200">
                <Link 
                  to="/cliente/perfil"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Mi Perfil
                </Link>
                <hr className="my-2" />
                <Link 
                  to="/"
                  className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Cerrar Sesión
                </Link>
              </div>
            </div>
          </div>

          {/* Menú móvil */}
          <div className="md:hidden">
            <button className="text-gray-600 hover:text-gray-900 focus:outline-none">
              <svg 
                className="h-6 w-6" 
                fill="none" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default ClientNavbar;