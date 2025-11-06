import React, { useState, useMemo } from 'react';
import ProfessionalNavbar from '../components/Navbar_profesional';

const sampleAppointments = [
  { id: 1, name: 'Luisa Fernández', date: '2024-10-05', time: '10:30', service: 'Limpieza Dental', status: 'confirmed' },
  { id: 2, name: 'Carlos Méndez', date: new Date().toISOString().slice(0,10), time: '12:00', service: 'Revisión general', status: 'pending' },
  { id: 3, name: 'Ana Torres', date: '2024-10-04', time: '16:00', service: 'Ortodoncia', status: 'cancelled' },
  { id: 4, name: 'Jorge Ríos', date: '2024-10-11', time: '11:00', service: 'Blanqueamiento', status: 'confirmed' },
  { id: 5, name: 'María Gómez', date: new Date().toISOString().slice(0,10), time: '15:00', service: 'Consulta', status: 'confirmed' },
];

const statusBadge = (status) => {
  if (status === 'confirmed') return 'bg-green-100 text-green-800';
  if (status === 'pending') return 'bg-yellow-100 text-yellow-800';
  if (status === 'cancelled') return 'bg-red-100 text-red-800';
  return 'bg-gray-100 text-gray-700';
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
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(today.toISOString().slice(0,10));
  const [appointments, setAppointments] = useState(sampleAppointments);
  const [query, setQuery] = useState('');

  const daysGrid = useMemo(() => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstWeekday = getFirstWeekday(currentMonth, currentYear);
    const cells = [];
    for (let i = 0; i < firstWeekday; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      const iso = new Date(currentYear, currentMonth, d).toISOString().slice(0,10);
      const hasEvents = appointments.some(a => a.date === iso);
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

  const appointmentsForSelected = appointments.filter(a => a.date === selectedDate);
  const upcoming = appointments
    .filter(a => new Date(a.date + 'T' + a.time) >= new Date())
    .sort((x,y) => new Date(x.date + 'T' + x.time) - new Date(y.date + 'T' + y.time))
    .filter(a => a.name.toLowerCase().includes(query.toLowerCase()));

  const handleEdit = (apt) => {
    alert(`Editar cita de ${apt.name} (${apt.id}) — implementar modal o navegación`);
  };
  const handleDelete = (apt) => {
    if (!confirm(`Eliminar cita de ${apt.name} el ${apt.date} ${apt.time}?`)) return;
    setAppointments(prev => prev.filter(p => p.id !== apt.id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
                <h4 className="text-sm text-gray-600 mb-2">Citas el {new Date(selectedDate).toLocaleDateString()}</h4>
                <div className="space-y-3">
                  {appointmentsForSelected.length === 0 && (
                    <div className="text-sm text-gray-500 p-4 rounded bg-gray-50">No hay citas este día.</div>
                  )}
                  {appointmentsForSelected.map(a => (
                    <div key={a.id} className="flex items-center justify-between p-3 rounded border border-gray-100">
                      <div>
                        <div className="font-medium text-gray-900">{a.name}</div>
                        <div className="text-xs text-gray-500">{a.time} · {a.service}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${statusBadge(a.status)}`}>{
                          a.status === 'confirmed' ? 'Confirmada' : a.status === 'pending' ? 'Pendiente' : 'Cancelada'
                        }</span>
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

              <div className="space-y-4">
                {upcoming.map(apt => (
                  <div key={apt.id} className="flex items-start justify-between gap-3 p-3 rounded-lg border border-gray-100">
                    <div>
                      <div className="font-medium text-gray-900">{apt.name}</div>
                      <div className="text-xs text-gray-500">{apt.date === new Date().toISOString().slice(0,10) ? 'Hoy' : apt.date}, {apt.time} · {apt.service}</div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${statusBadge(apt.status)}`}>
                        {apt.status === 'confirmed' ? 'Confirmada' : apt.status === 'pending' ? 'Pendiente' : 'Cancelada'}
                      </span>

                      <div className="flex gap-2">
                        <button type="button" onClick={() => handleEdit(apt)} className="p-2 text-gray-500 hover:bg-gray-50 rounded">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M15.232 5.232l3.536 3.536M4 21l7.607-1.267L21 11.34 12.607 4 4 21z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </button>
                        <button type="button" onClick={() => handleDelete(apt)} className="p-2 text-gray-500 hover:bg-gray-50 rounded">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M8 6v12a2 2 0 002 2h4a2 2 0 002-2V6M10 6V4a2 2 0 012-2h0a2 2 0 012 2v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {upcoming.length === 0 && (
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