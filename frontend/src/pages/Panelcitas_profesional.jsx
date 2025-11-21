import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfessionalNavbar from '../components/Navbar_profesional';

const statusBadge = (status) => {
  const estados = {
    'PENDIENTE': 'bg-yellow-100 text-yellow-800',
    'CONFIRMADA': 'bg-blue-100 text-blue-800',
    'COMPLETADA': 'bg-green-100 text-green-800',
    'CANCELADA': 'bg-red-100 text-red-800'
  };
  return estados[status] || 'bg-gray-100 text-gray-700';
};

const monthNames = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const weekdayNames = ['DOM','LUN','MAR','MIÉ','JUE','VIE','SÁB'];

function getDaysInMonth(month, year) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstWeekday(month, year) {
  // returns 0..6 where 0 = Sunday
  return new Date(year, month, 1).getDay();
}

const ProfessionalAppointments = () => {
  const navigate = useNavigate();
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(today.toISOString().slice(0,10));
  const [appointments, setAppointments] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState('TODOS');

  useEffect(() => {
    cargarCitas();
  }, []);

  const cargarCitas = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login_clientes');
        return;
      }

      const API_URL = 'http://localhost:8000';
      const response = await fetch(`${API_URL}/api/profesionales/dashboard/citas`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error('Error al cargar citas');
      }

      const data = await response.json();
      setAppointments(data.citas);
      setLoading(false);
    } catch (error) {
      console.error('Error cargando citas:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login_clientes');
      }
      setLoading(false);
    }
  };

  const actualizarEstado = async (citaId, nuevoEstado) => {
    try {
      const token = localStorage.getItem('token');
      const API_URL = 'http://localhost:8000';
      
      const response = await fetch(
        `${API_URL}/api/profesionales/dashboard/citas/${citaId}/estado?nuevo_estado=${nuevoEstado}`,
        {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (!response.ok) {
        throw new Error('Error al actualizar estado');
      }

      // Recargar citas
      await cargarCitas();
      alert(`Cita actualizada a ${nuevoEstado}`);
    } catch (error) {
      console.error('Error actualizando estado:', error);
      alert('Error al actualizar el estado de la cita');
    }
  };

  const daysGrid = useMemo(() => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstWeekday = getFirstWeekday(currentMonth, currentYear);
    const cells = [];
    for (let i = 0; i < firstWeekday; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      const iso = new Date(currentYear, currentMonth, d).toISOString().slice(0,10);
      const hasEvents = appointments.some(a => a.fecha_hora.startsWith(iso));
      cells.push({ day: d, iso, hasEvents });
    }
    return cells;
  }, [currentMonth, currentYear, appointments]);

  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + 1);
  };
  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
    else setCurrentMonth(m => m - 1);
  };

  const appointmentsForSelected = appointments.filter(a => a.fecha_hora.startsWith(selectedDate));
  
  const upcoming = appointments
    .filter(a => new Date(a.fecha_hora) >= new Date())
    .filter(a => filtroEstado === 'TODOS' || a.estado === filtroEstado)
    .filter(a => !query || a.cliente.nombre_completo.toLowerCase().includes(query.toLowerCase()))
    .sort((x,y) => new Date(x.fecha_hora) - new Date(y.fecha_hora));

  const formatearFecha = (fechaISO) => {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  const formatearHora = (fechaISO) => {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ProfessionalNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Panel de Citas</h1>
          <p className="text-gray-600 mt-1">Aquí tienes un vistazo a tus próximas citas.</p>
        </header>

        <div className="flex gap-6">
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <button type="button" onClick={prevMonth} className="p-2 rounded hover:bg-gray-50">
                    <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none"><path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                  <h3 className="text-lg font-semibold">{monthNames[currentMonth]} {currentYear}</h3>
                  <button type="button" onClick={nextMonth} className="p-2 rounded hover:bg-gray-50">
                    <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none"><path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => { setCurrentMonth(today.getMonth()); setCurrentYear(today.getFullYear()); setSelectedDate(today.toISOString().slice(0,10)); }} className="px-3 py-1 text-sm bg-gray-100 rounded">Hoy</button>
                </div>
              </div>

              {/* Weekdays */}
              <div className="grid grid-cols-7 gap-2 text-xs text-gray-500 mb-2">
                {weekdayNames.map(w => <div key={w} className="text-center font-medium">{w}</div>)}
              </div>

              {/* Days grid */}
              <div className="grid grid-cols-7 gap-2">
                {daysGrid.map((cell, idx) => {
                  if (!cell) return <div key={idx} className="h-14" />;
                  const selected = cell.iso === selectedDate;
                  return (
                    <button
                      key={cell.iso}
                      type="button"
                      onClick={() => setSelectedDate(cell.iso)}
                      className={`h-14 flex flex-col items-center justify-center rounded-lg transition ${selected ? 'bg-cyan-600 text-white' : 'hover:bg-gray-50'} `}
                      title={cell.iso}
                    >
                      <div className="text-sm">{cell.day}</div>
                      {cell.hasEvents && (
                        <div className="flex gap-1 mt-1">
                          {/* pequeño indicador de eventos (puede representar tipos) */}
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                          <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Lista de citas del día */}
              <div className="mt-6">
                <h4 className="text-sm text-gray-600 mb-2">Citas el {new Date(selectedDate).toLocaleDateString('es-ES')}</h4>
                <div className="space-y-3">
                  {appointmentsForSelected.length === 0 && (
                    <div className="text-sm text-gray-500 p-4 rounded bg-gray-50">No hay citas este día.</div>
                  )}
                  {appointmentsForSelected.map(a => (
                    <div key={a.id} className="flex items-center justify-between p-3 rounded border border-gray-100">
                      <div>
                        <div className="font-medium text-gray-900">{a.cliente.nombre_completo}</div>
                        <div className="text-xs text-gray-500">
                          {formatearHora(a.fecha_hora)} · {a.motivo || 'Consulta general'} · {a.duracion_minutos} min
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${statusBadge(a.estado)}`}>
                          {a.estado}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right column: upcoming list */}
          <aside className="w-96">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Próximas Citas</h3>
                <div className="text-sm text-gray-500">{upcoming.length}</div>
              </div>

              {/* Filtros */}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Buscar por nombre..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm mb-3"
                />
                <div className="flex gap-2 flex-wrap">
                  {['TODOS', 'PENDIENTE', 'CONFIRMADA', 'COMPLETADA', 'CANCELADA'].map(estado => (
                    <button
                      key={estado}
                      onClick={() => setFiltroEstado(estado)}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        filtroEstado === estado 
                          ? 'bg-emerald-600 text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {estado}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {loading && (
                  <div className="text-sm text-gray-500 p-4 rounded bg-gray-50">Cargando...</div>
                )}

                {!loading && upcoming.map(apt => (
                  <div key={apt.id} className="flex flex-col gap-2 p-3 rounded-lg border border-gray-100">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{apt.cliente.nombre_completo}</div>
                        <div className="text-xs text-gray-500">
                          {formatearFecha(apt.fecha_hora)} · {formatearHora(apt.fecha_hora)}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          {apt.motivo || 'Consulta general'} · {apt.duracion_minutos} min
                        </div>
                      </div>

                      <span className={`px-2 py-1 rounded-full text-xs ${statusBadge(apt.estado)}`}>
                        {apt.estado}
                      </span>
                    </div>

                    {/* Acciones rápidas */}
                    {apt.estado === 'PENDIENTE' && (
                      <div className="flex gap-2 mt-2 pt-2 border-t">
                        <button
                          onClick={() => actualizarEstado(apt.id, 'CONFIRMADA')}
                          className="flex-1 px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Confirmar
                        </button>
                        <button
                          onClick={() => actualizarEstado(apt.id, 'CANCELADA')}
                          className="flex-1 px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          Cancelar
                        </button>
                      </div>
                    )}

                    {apt.estado === 'CONFIRMADA' && (
                      <div className="flex gap-2 mt-2 pt-2 border-t">
                        <button
                          onClick={() => actualizarEstado(apt.id, 'COMPLETADA')}
                          className="flex-1 px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                        >
                          Completar
                        </button>
                        <button
                          onClick={() => actualizarEstado(apt.id, 'CANCELADA')}
                          className="flex-1 px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          Cancelar
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                {!loading && upcoming.length === 0 && (
                  <div className="text-sm text-gray-500 p-4 rounded bg-gray-50">No hay próximas citas</div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalAppointments;