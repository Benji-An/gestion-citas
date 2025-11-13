import React, { useMemo, useState, useEffect } from 'react';
import ProfessionalNavbar from '../components/Navbar_profesional';

const HOURS = Array.from({ length: 14 }).map((_, i) => 8 + i); 
const HOUR_PX = 80; 
const weekdayNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

function startOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diffToMon = (day === 0 ? -6 : 1) - day;
  d.setDate(d.getDate() + diffToMon);
  d.setHours(0, 0, 0, 0);
  return d;
}
function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}
function isoDate(dt) {
  return dt.toISOString().slice(0, 10);
}
function timeToMinutes(str) {
  const [h, m] = str.split(':').map(Number);
  return h * 60 + m;
}


const EditBlockModal = ({ open, initial, onClose, onSave }) => {
  const [type, setType] = useState(initial?.type || 'available');
  const [date, setDate] = useState(initial?.date || isoDate(new Date()));
  const [start, setStart] = useState(initial?.start || '09:00');
  const [end, setEnd] = useState(initial?.end || '10:00');
  const [title, setTitle] = useState(initial?.title || '');

  useEffect(() => {
    if (open) {
      setType(initial?.type || 'available');
      setDate(initial?.date || isoDate(new Date()));
      setStart(initial?.start || '09:00');
      setEnd(initial?.end || '10:00');
      setTitle(initial?.title || '');
    }
  }, [open, initial]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const s = timeToMinutes(start);
    const eM = timeToMinutes(end);
    if (eM <= s) {
      alert('La hora de fin debe ser posterior a la hora de inicio');
      return;
    }
    onSave({
      id: initial?.id || 'b' + Math.random().toString(36).slice(2, 9),
      type,
      date,
      start,
      end,
      title: title || (type === 'appointment' ? 'Cita' : type === 'blocked' ? 'No disponible' : 'Disponible'),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-5">
        <h3 className="text-lg font-semibold mb-3">Gestionar Bloque</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Tipo</label>
            <div className="flex gap-2">
              <button type="button" onClick={() => setType('available')} className={`px-2 py-1 rounded text-sm ${type === 'available' ? 'bg-green-600 text-white' : 'bg-green-50 text-green-700'}`}>Disponible</button>
              <button type="button" onClick={() => setType('appointment')} className={`px-2 py-1 rounded text-sm ${type === 'appointment' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-700'}`}>Cita</button>
              <button type="button" onClick={() => setType('blocked')} className={`px-2 py-1 rounded text-sm ${type === 'blocked' ? 'bg-red-600 text-white' : 'bg-red-50 text-red-700'}`}>No disponible</button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="text-sm text-gray-700">Fecha</label>
              <input className="mt-1 w-full px-3 py-2 border rounded text-sm" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>
            <div>
              <label className="text-sm text-gray-700">Título</label>
              <input className="mt-1 w-full px-3 py-2 border rounded text-sm" type="text" placeholder="Ej. Consulta" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-sm text-gray-700">Inicio</label>
              <input className="mt-1 w-full px-3 py-2 border rounded text-sm" type="time" value={start} onChange={(e) => setStart(e.target.value)} required />
            </div>
            <div>
              <label className="text-sm text-gray-700">Fin</label>
              <input className="mt-1 w-full px-3 py-2 border rounded text-sm" type="time" value={end} onChange={(e) => setEnd(e.target.value)} required />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-3 py-1 rounded bg-gray-100 text-sm">Cancelar</button>
            <button type="submit" className="px-4 py-1 rounded bg-cyan-600 text-white text-sm">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
};


const SettingsPanel = ({ settings, onChange }) => {
  const updateLimit = (index, field, val) => {
    const ns = { ...settings };
    ns.limits[index][field] = val;
    onChange(ns);
  };
  const addLimit = () => {
    const ns = { ...settings };
    ns.limits.push({ value: 1, period: 'day' });
    onChange(ns);
  };
  const removeLimit = (index) => {
    const ns = { ...settings };
    ns.limits.splice(index, 1);
    onChange(ns);
  };
  const updateRange = (field, val) => {
    const ns = { ...settings };
    ns.range[field] = val;
    onChange(ns);
  };
  const editBuffer = (id, patch) => {
    const ns = { ...settings };
    ns.buffers = ns.buffers.map(b => (b.id === id ? { ...b, ...patch } : b));
    onChange(ns);
  };
  const addBuffer = () => {
    const ns = { ...settings };
    ns.buffers.push({ id: 'buf'+Math.random().toString(36).slice(2,6), start: '00:15', end: '00:15', label: 'Buffer' });
    onChange(ns);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 w-full max-w-sm">
      <h4 className="font-semibold mb-3 text-gray-900">Configuración</h4>

      <div className="mb-4">
        <div className="text-sm font-medium text-gray-700 mb-2">Límites máximos</div>
        <div className="space-y-2">
          {settings.limits.map((l, i) => (
            <div key={i} className="flex items-center gap-2 bg-gray-50 p-2 rounded">
              <input type="number" min="1" value={l.value} onChange={(e) => updateLimit(i, 'value', Number(e.target.value))} className="w-16 px-2 py-1 border rounded text-sm" />
              <select value={l.period} onChange={(e) => updateLimit(i, 'period', e.target.value)} className="px-2 py-1 border rounded text-sm">
                <option value="day">día</option>
                <option value="week">semana</option>
                <option value="month">mes</option>
              </select>
              <button type="button" onClick={() => removeLimit(i)} className="ml-auto text-red-500 text-xs">×</button>
            </div>
          ))}
          <button type="button" onClick={addLimit} className="mt-2 text-sm text-cyan-600">+ Añadir límite</button>
        </div>
      </div>

      <div className="mb-4">
        <div className="text-sm font-medium text-gray-700 mb-2">Rango de fechas</div>
        <div className="text-xs text-gray-500 mb-2">Invitados pueden reservar</div>
        <div className="flex gap-2 items-center">
          <input type="number" min="0" value={settings.range.windowDays} onChange={(e) => updateRange('windowDays', Number(e.target.value))} className="w-20 px-2 py-1 border rounded text-sm" />
          <span className="text-sm">días adelante</span>
        </div>
        <div className="text-xs text-gray-500 mt-3 mb-2">Aviso previo mínimo</div>
        <div className="flex gap-2 items-center">
          <input type="number" min="0" value={settings.range.minNoticeHours} onChange={(e) => updateRange('minNoticeHours', Number(e.target.value))} className="w-20 px-2 py-1 border rounded text-sm" />
          <span className="text-sm">horas</span>
        </div>
      </div>

      <div className="mb-2">
        <div className="text-sm font-medium text-gray-700 mb-2">Buffers</div>
        <div className="space-y-2">
          {settings.buffers.map(b => (
            <div key={b.id} className="flex items-center gap-2 bg-green-50 p-2 rounded border border-blue-100">
              <div className="text-xs w-24">{b.start} – {b.end}</div>
              <div className="text-xs text-gray-700 flex-1">{b.label}</div>
              <button type="button" onClick={() => editBuffer(b.id, { label: prompt('Nuevo label:', b.label) || b.label })} className="text-cyan-600 text-sm">✎</button>
            </div>
          ))}
        </div>
        <button type="button" onClick={addBuffer} className="mt-2 text-sm text-cyan-600">+ Añadir buffer</button>
      </div>
    </div>
  );
};

const TimeSlotPanel = ({ dateIso, slots, selected, onSelect, onConfirm }) => {
  if (!dateIso) return null;
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 w-full max-w-sm">
      <div className="mb-3">
        <div className="text-sm text-gray-500">Selecciona hora</div>
        <div className="font-semibold text-gray-900">{dateIso}</div>
      </div>

      <div className="space-y-2 max-h-64 overflow-auto">
        {slots.length === 0 && <div className="text-sm text-gray-500">No hay huecos disponibles</div>}
        {slots.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onSelect(s)}
            className={`w-full text-left px-3 py-2 rounded border text-sm ${selected === s ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-gray-50 text-gray-800 hover:bg-gray-100'}`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="mt-3 flex gap-2">
        <button type="button" onClick={() => onConfirm(selected)} disabled={!selected} className="flex-1 px-3 py-2 rounded bg-green-600 text-white disabled:opacity-50 text-sm">
          Confirmar
        </button>
        <button type="button" onClick={() => onSelect(null)} className="px-3 py-2 rounded bg-gray-100 text-sm">Cancelar</button>
      </div>
    </div>
  );
};

const Agenda_profesional = () => {
  const today = new Date();
  const [weekStart, setWeekStart] = useState(startOfWeek(today));

  const [blocks, setBlocks] = useState([
    { id: 'b1', type: 'available', date: isoDate(addDays(startOfWeek(today), 0)), start: '09:00', end: '11:00', title: 'Disponible' },
    { id: 'b2', type: 'blocked', date: isoDate(addDays(startOfWeek(today), 1)), start: '09:30', end: '12:00', title: 'No disponible' },
    { id: 'b3', type: 'appointment', date: isoDate(addDays(startOfWeek(today), 2)), start: '11:00', end: '12:00', title: 'Cita · J. Pérez' },
    { id: 'b4', type: 'available', date: isoDate(addDays(startOfWeek(today), 2)), start: '13:00', end: '17:00', title: 'Disponible' },
  ]);

  const [settings, setSettings] = useState({
    limits: [
      { value: 4, period: 'day' },
      { value: 12, period: 'week' },
      { value: 24, period: 'month' },
    ],
    range: { windowDays: 30, minNoticeHours: 4 },
    buffers: [
      { id: 'buf1', start: '08:45', end: '09:00', label: 'Buffer before meeting' },
      { id: 'buf2', start: '10:45', end: '11:00', label: 'Buffer after meeting' },
    ],
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [selectedDate, setSelectedDate] = useState(isoDate(today));
  const [availableSlots, setAvailableSlots] = useState(['10:00am', '11:00am', '13:00pm', '14:30pm', '16:00pm']);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const days = useMemo(() => Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i)), [weekStart]);

  const blocksByDay = useMemo(() => {
    const map = {};
    blocks.forEach((b) => {
      if (!map[b.date]) map[b.date] = [];
      map[b.date].push(b);
    });
    Object.keys(map).forEach((k) => map[k].sort((a, b) => timeToMinutes(a.start) - timeToMinutes(b.start)));
    return map;
  }, [blocks]);

  const prevWeek = () => setWeekStart((ws) => addDays(ws, -7));
  const nextWeek = () => setWeekStart((ws) => addDays(ws, 7));
  const goToThisWeek = () => setWeekStart(startOfWeek(new Date()));

  const openAdd = (dateISO) => {
    setEditing(null);
    setSelectedDate(dateISO || isoDate(today));
    setIsModalOpen(true);
  };
  const openEdit = (block) => {
    setEditing({ ...block });
    setIsModalOpen(true);
  };
  const saveBlock = (payload) => {
    setBlocks((prev) => {
      const exists = prev.find((p) => p.id === payload.id);
      if (exists) return prev.map((p) => (p.id === payload.id ? payload : p));
      return [...prev, payload];
    });
  };

  const handleSelectSlot = (slot) => setSelectedSlot(slot);
  const handleConfirmSlot = (slot) => {
    if (!slot) return;
    const id = 'b' + Math.random().toString(36).slice(2, 9);
    setBlocks(prev => [{ id, type: 'appointment', date: selectedDate, start: slot, end: slot, title: 'Cita rápida' }, ...prev]);
    setSelectedSlot(null);
    alert('Reservado: ' + selectedDate + ' ' + slot);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ProfessionalNavbar />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold leading-tight">Agenda Profesional</h1>
            <p className="text-sm text-gray-600 mt-1">Configura límites, rango y buffers. Selecciona huecos y confirma.</p>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={prevWeek} className="px-3 py-2 bg-white border rounded shadow-sm text-sm">Anterior</button>
            <button onClick={goToThisWeek} className="px-3 py-2 bg-white border rounded shadow-sm text-sm">Hoy</button>
            <button onClick={nextWeek} className="px-3 py-2 bg-white border rounded shadow-sm text-sm">Siguiente</button>
            <button onClick={() => openAdd(isoDate(today))} className="ml-4 px-4 py-2 bg-emerald-600 text-white rounded text-sm shadow">+ Añadir Disponibilidad</button>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Timeline izquierda */}
          <div className="flex-1 bg-white rounded-lg shadow-sm overflow-x-auto">
            <div className="flex">
              {/* Columna de horas */}
              <div className="w-20 flex-shrink-0 border-r">
                <div className="h-16 flex items-center justify-center text-xs text-gray-500 border-b">Hora</div>
                {HOURS.map((h) => (
                  <div key={h} style={{ height: HOUR_PX }} className="flex items-center justify-end pr-3 border-b text-sm text-gray-600">
                    {String(h).padStart(2, '0')}:00
                  </div>
                ))}
              </div>

              {/* Columnas de días */}
              {days.map((d, idx) => {
                const iso = isoDate(d);
                const dayBlocks = blocksByDay[iso] || [];

                return (
                  <div key={iso} className="flex-1 min-w-[140px] border-r last:border-r-0">
                    {/* Header día */}
                    <div className="h-16 flex flex-col items-center justify-center border-b bg-gray-50">
                      <div className="text-sm font-semibold">{weekdayNames[idx]}</div>
                      <div className="text-xs text-gray-500">{d.getDate()} {d.toLocaleString('es-ES', { month: 'short' })}</div>
                    </div>

                    {/* Celdas de hora */}
                    <div className="relative">
                      {HOURS.map((h) => (
                        <div key={h} style={{ height: HOUR_PX }} className="border-b" />
                      ))}

                      {/* Bloques posicionados absolutamente */}
                      {dayBlocks.map((b) => {
                        const topMinutes = timeToMinutes(b.start) - HOURS[0] * 60;
                        const durationMinutes = Math.max(30, timeToMinutes(b.end) - timeToMinutes(b.start));
                        const topPx = (topMinutes / 60) * HOUR_PX;
                        const heightPx = (durationMinutes / 60) * HOUR_PX;
                        const colorClass = b.type === 'available' ? 'bg-green-100 border-green-300' : b.type === 'appointment' ? 'bg-blue-100 border-blue-300' : 'bg-red-100 border-red-300';

                        return (
                          <div
                            key={b.id}
                            onDoubleClick={() => openEdit(b)}
                            className={`absolute left-2 right-2 rounded-lg p-2 border ${colorClass} shadow-sm cursor-pointer`}
                            style={{ top: topPx, height: Math.max(36, heightPx - 8) }}
                            title={`${b.title} ${b.start} - ${b.end}`}
                          >
                            <div className="text-xs font-semibold truncate">{b.title}</div>
                            <div className="text-[10px] text-gray-600">{b.start} - {b.end}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="w-80 flex-shrink-0 space-y-4">
            <SettingsPanel settings={settings} onChange={setSettings} />
            <TimeSlotPanel dateIso={selectedDate} slots={availableSlots} selected={selectedSlot} onSelect={handleSelectSlot} onConfirm={handleConfirmSlot} />
          </div>
        </div>
      </div>

      <EditBlockModal open={isModalOpen} initial={editing} onClose={() => { setIsModalOpen(false); setEditing(null); }} onSave={saveBlock} />
    </div>
  );
};

export default Agenda_profesional;