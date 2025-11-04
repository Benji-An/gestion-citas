import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Small notification bell + dropdown component
function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Tienes una nueva reserva pendiente', time: '2h', read: false },
    { id: 2, text: 'Tu cita con Dra. Ana está confirmada', time: '1d', read: false },
    { id: 3, text: 'Recuerda completar tu perfil', time: '3d', read: true },
  ]);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unread = notifications.filter(n => !n.read).length;

  function markAllRead() {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(v => !v)}
        className="relative p-2 rounded-full hover:bg-gray-100 focus:outline-none"
        aria-label="Notificaciones"
      >
        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-50">
          <div className="flex items-center justify-between px-4 py-2 border-b">
            <span className="font-semibold text-sm">Notificaciones</span>
            <button onClick={markAllRead} className="text-xs text-green-600 hover:underline">Marcar todas</button>
          </div>
          <div className="max-h-60 overflow-auto">
            {notifications.map(n => (
              <div key={n.id} className={`px-4 py-3 hover:bg-gray-50 ${n.read ? 'opacity-80' : ''}`}>
                <p className="text-sm text-gray-700">{n.text}</p>
                <p className="text-xs text-gray-400 mt-1">{n.time}</p>
              </div>
            ))}
            {notifications.length === 0 && <div className="p-4 text-sm text-gray-500">No hay notificaciones</div>}
          </div>
        </div>
      )}
    </div>
  );
}

const ClientNavbar = () => {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo y nombre */}
          <Link to="/cliente" className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-br  rounded-lg flex items-center justify-center">
                <img src="/Tiiwa.png" alt="Logo" className="w-5 h-5" />
            </div>
            <span className="text-gray-700 font-medium text-sm">
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

          {/* Botón de notificaciones */}
            <NotificationBell />

            {/* Avatar de usuario */}
            <div className="relative group">
              <button className="flex items-center space-x-2 focus:outline-none">
                <img 
                  src="https://randomuser.me/api/portraits/men/75.jpg" 
                  alt="Usuario"
                  className="w-8 h-8 rounded-full object-cover border-2 border-gray-300"
                />
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
                <Link 
                  to="/cliente/configuracion"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Configuración
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