import React, { useMemo, useState } from 'react';
import ProfessionalNavbar from '../components/Navbar_profesional';
import AvailabilityModal from '../components/Disponibilidad';
import GoToDateModal from '../components/Date';

/*
  ProfessionalAgenda (versión compacta + modal "Ir a fecha")
  Reemplaza prompt() por GoToDateModal para mejorar UX visual.
*/

const HOURS = Array.from({ length: 13 }).map((_, i) => 8 + i); // 8..20
const weekdayNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

const sampleAppointments = [
  { id: 1, patient: 'Luisa Fernández', datetime: '2024-10-07T10:30:00', duration: 30, service: 'Limpieza Dental', status: 'confirmed' },
  { id: 2, patient: 'Carlos Méndez', datetime: new Date().toISOString().slice(0,10) + 'T12:00:00', duration: 45, service: 'Revisión general', status: 'pending' },
  { id: 3, patient: 'María Gómez', datetime: new Date().toISOString().slice(0,10) + 'T15:00:00', duration: 60, service: 'Consulta', status: 'confirmed' },
];

const sampleAvailabilities = [
  { id: 'a1', datetime: new Date().toISOString().slice(0,10) + 'T09:00:00', duration: 120, notes: 'Disponibilidad mañana' },
];

function startOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay(); // 0 Sun .. 6 Sat
  const diffToMon = (day === 0 ? -6 : 1) - day;
  d.setDate(d.getDate() + diffToMon);
  d.setHours(0,0,0,0);
  return d;
}
function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}
function isoDate(dt) {
  return dt.toISOString().slice(0,10);
}
function timeToHHMM(dtStr) {
  const dt = new Date(dtStr);
  return dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

const statusClass = (s) => {
  if (s === 'confirmed') return 'bg-green-100 text-green-800';
  if (s === 'pending') return 'bg-yellow-100 text-yellow-800';
  if (s === 'cancelled') return 'bg-red-100 text-red-800';
  return 'bg-gray-100 text-gray-700';
};

const ProfessionalAgenda = () => {
  const today = new Date();
  const [weekStart, setWeekStart] = useState(startOfWeek(today));
  const [appointments, setAppointments] = useState(sampleAppointments);
  const [availabilities, setAvailabilities] = useState(sampleAvailabilities);
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalInitial, setModalInitial] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);
  const [showOnlyFree, setShowOnlyFree] = useState(false);

  // nuevo estado para modal "Ir a fecha"
  const [isGoToOpen, setGoToOpen] = useState(false);
  const [goToInitial, setGoToInitial] = useState(isoDate(today));

  const days = useMemo(() => Array.from({length:7}).map((_,i) => addDays(weekStart, i)), [weekStart]);

  const appointmentsByDay = useMemo(() => {
    const map = {};
    appointments.forEach((a) => {
      const iso = a.datetime.slice(0,10);
      if (!map[iso]) map[iso] = [];
      map[iso].push(a);
    });
    Object.keys(map).forEach(k => map[k].sort((x,y) => new Date(x.datetime) - new Date(y.datetime)));
    return map;
  }, [appointments]);

  const availByDay = useMemo(() => {
    const map = {};
    availabilities.forEach((a) => {
      const iso = a.datetime.slice(0,10);
      if (!map[iso]) map[iso] = [];
      map[iso].push(a);
    });
    return map;
  }, [availabilities]);

  const nextWeek = () => setWeekStart(prev => addDays(prev, 7));
  const prevWeek = () => setWeekStart(prev => addDays(prev, -7));
  const goToThisWeek = () => setWeekStart(startOfWeek(new Date()));

  const openNewAvailability = (dateIso, hour) => {
    const dt = new Date(dateIso + 'T' + String(hour).padStart(2,'0') + ':00:00');
    setModalInitial({ date: isoDate(dt), time: dt.toTimeString().slice(0,5), duration: 60 });
    setModalOpen(true);
  };

  const saveAvailability = (payload) => {
    const id = 'a' + (Math.random().toString(36).slice(2,9));
    const datetime = payload.date + 'T' + payload.time + ':00';
    setAvailabilities(prev => [{ id, datetime, duration: payload.duration, notes: payload.notes }, ...prev]);
  };

  const removeAvailability = (id) => {
    if (!confirm('Eliminar disponibilidad?')) return;
    setAvailabilities(prev => prev.filter(a => a.id !== id));
  };

  const removeAppointment = (id) => {
    if (!confirm('Eliminar cita?')) return;
    setAppointments(prev => prev.filter(a => a.id !== id));
  };

  const toggleOnlyFree = () => setShowOnlyFree(v => !v);

  // handler que ejecuta el modal "Ir a fecha"
  const handleGoToDate = (iso) => {
    try {
      const d = new Date(iso);
      if (isNaN(d.getTime())) throw new Error('Fecha inválida');
      setWeekStart(startOfWeek(d));
      setSelectedCell(null);
    } catch (err) {
      console.error('Fecha inválida:', iso, err);
      alert('Fecha inválida');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ProfessionalNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Agenda</h1>
            <p className="text-sm text-gray-600 mt-1">Organiza tu semana y gestiona franjas horarias y citas.</p>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={prevWeek} className="px-2 py-1 text-sm rounded bg-white border hover:shadow">Anterior</button>
            <button onClick={goToThisWeek} className="px-2 py-1 text-sm rounded bg-white border hover:shadow">Esta semana</button>
            <button onClick={nextWeek} className="px-2 py-1 text-sm rounded bg-white border hover:shadow">Siguiente</button>
            <button
              onClick={() => { setModalInitial({ date: isoDate(today), time: today.toTimeString().slice(0,5), duration: 60 }); setModalOpen(true); }}
              className="px-3 py-1 text-sm bg-cyan-600 text-white rounded hover:bg-cyan-700"
            >
              Añadir disponibilidad
            </button>
            <button
              onClick={() => { setGoToInitial(isoDate(today)); setGoToOpen(true); }}
              className="px-2 py-1 text-sm bg-gray-100 rounded border hover:bg-gray-200"
            >
              Ir a fecha
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-8 gap-6">
          {/* Hours column (narrower) */}
          <div className="lg:col-span-1">
            <div className="text-sm text-gray-500 mb-2">Hora</div>
            <div className="bg-white rounded-lg shadow-sm p-2">
              {HOURS.map(h => (
                <div key={h} className="h-12 text-xs text-gray-600 flex items-center justify-center border-b last:border-b-0">
                  {String(h).padStart(2,'0')}:00
                </div>
              ))}
            </div>
          </div>

          {/* Week grid (compact day columns) */}
          <div className="lg:col-span-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex gap-2">
                {days.map((d, idx) => (
                  <div key={idx} className="text-sm text-gray-700 w-28 text-center">
                    <div className="font-medium">{weekdayNames[idx]}</div>
                    <div className="text-xs text-gray-500">{d.getDate()} {d.toLocaleString('es-ES', { month: 'short' })}</div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input type="checkbox" checked={showOnlyFree} onChange={toggleOnlyFree} className="form-checkbox" />
                  Mostrar solo huecos libres
                </label>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-2 overflow-x-auto">
              <div className="flex gap-2">
                {days.map((d, di) => {
                  const iso = isoDate(d);
                  const appts = appointmentsByDay[iso] || [];
                  const avails = availByDay[iso] || [];

                  return (
                    <div key={iso} className="flex-shrink-0 w-28 border-l last:border-r p-1">
                      {HOURS.map((h) => {
                        const slotStart = new Date(iso + 'T' + String(h).padStart(2,'0') + ':00:00');
                        const slotEnd = new Date(slotStart.getTime() + 60*60*1000);
                        const appt = appts.find(a => {
                          const aStart = new Date(a.datetime);
                          const aEnd = new Date(aStart.getTime() + (a.duration||60)*60000);
                          return aStart < slotEnd && aEnd > slotStart;
                        });
                        const avail = avails.find(a => {
                          const aStart = new Date(a.datetime);
                          const aEnd = new Date(aStart.getTime() + (a.duration||60)*60000);
                          return aStart < slotEnd && aEnd > slotStart;
                        });

                        if (showOnlyFree && (appt || !avail)) {
                          return <div key={h} className="h-12 mb-1" />;
                        }

                        return (
                          <div
                            key={h}
                            onClick={() => setSelectedCell({ date: iso, hour: h })}
                            className={`h-12 mb-1 rounded px-1 cursor-pointer transition ${appt ? 'bg-red-50 border border-red-100' : avail ? 'bg-green-50 border border-green-100' : 'hover:bg-gray-50'}`}
                            title={appt ? `${appt.patient} · ${appt.service}` : avail ? `Disponibilidad: ${avail.notes||''}` : 'Click para añadir disponibilidad'}
                          >
                            {appt ? (
                              <div className="text-[11px] text-red-700 font-medium truncate">{timeToHHMM(appt.datetime)} · {appt.patient}</div>
                            ) : avail ? (
                              <div className="text-[11px] text-green-700 font-medium truncate">Libre · {timeToHHMM(avail.datetime)}</div>
                            ) : (
                              <div className="text-[11px] text-gray-400 truncate">—</div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Actions panel (narrower) */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-3">
              <h3 className="font-semibold text-gray-900 text-sm mb-1">Acciones</h3>
              <p className="text-xs text-gray-500 mb-3">Selecciona una celda para acciones rápidas</p>

              <div className="space-y-2">
                <button
                  onClick={() => {
                    if (!selectedCell) { alert('Selecciona primero una celda del calendario'); return; }
                    openNewAvailability(selectedCell.date, selectedCell.hour);
                  }}
                  className="w-full px-3 py-1 text-sm bg-cyan-600 text-white rounded hover:bg-cyan-700"
                >
                  Añadir Disponibilidad
                </button>

                <button
                  onClick={() => {
                    if (!selectedCell) { alert('Selecciona una celda'); return; }
                    const id = Math.floor(Math.random()*100000);
                    const hh = String(selectedCell.hour).padStart(2,'0') + ':00:00';
                    const datetime = selectedCell.date + 'T' + hh;
                    const patient = prompt('Nombre del paciente para reservar (prueba):');
                    if (!patient) return;
                    setAppointments(prev => [{ id, patient, datetime, duration: 60, service: 'Consulta rápida', status: 'confirmed' }, ...prev]);
                  }}
                  className="w-full px-3 py-1 text-sm bg-green-50 text-green-700 rounded hover:bg-green-100"
                >
                  Reservar (rápido)
                </button>

                <button
                  onClick={() => { setGoToInitial(isoDate(today)); setGoToOpen(true); }}
                  className="w-full px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
                >
                  Ir a fecha
                </button>

                <button
                  onClick={() => {
                    const id = prompt('ID de disponibilidad a eliminar (ej. a1):');
                    if (!id) return;
                    removeAvailability(id);
                  }}
                  className="w-full px-3 py-1 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100"
                >
                  Eliminar disponibilidad
                </button>
              </div>

              <div className="mt-3 border-t pt-2">
                <h4 className="text-xs font-medium">Disponibilidades</h4>
                <div className="text-xs text-gray-500 mt-2 space-y-2">
                  {availabilities.length === 0 && <div className="text-gray-400">No hay disponibilidades creadas</div>}
                  {availabilities.map(a => (
                    <div key={a.id} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-xs">{a.datetime.slice(0,10)}</div>
                        <div className="text-gray-500 text-xs">{timeToHHMM(a.datetime)} · {a.duration}min</div>
                      </div>
                      <button onClick={() => removeAvailability(a.id)} className="text-red-500 text-xs">Eliminar</button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-3 text-xs text-gray-400">
                Tip: haz click en una celda para seleccionar día/hora. Usa "Añadir disponibilidad" para abrir el formulario.
              </div>
            </div>
          </aside>
        </div>
      </div>

      <AvailabilityModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSave={saveAvailability}
        initial={modalInitial}
      />

      <GoToDateModal
        isOpen={isGoToOpen}
        onClose={() => setGoToOpen(false)}
        initialDate={goToInitial}
        onGo={(iso) => handleGoToDate(iso)}
      />
    </div>
  );
};

export default ProfessionalAgenda;