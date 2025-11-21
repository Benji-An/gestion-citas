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


const CitaDetailModal = ({ open, cita, onClose, onUpdateEstado }) => {
  if (!open || !cita) return null;

  const estadoColors = {
    'pendiente': 'bg-amber-100 text-amber-800',
    'confirmada': 'bg-green-100 text-green-800',
    'cancelada': 'bg-red-100 text-red-800',
    'completada': 'bg-blue-100 text-blue-800'
  };

  const handleCambiarEstado = async (nuevoEstado) => {
    if (window.confirm(`¿Cambiar estado de la cita a ${nuevoEstado}?`)) {
      await onUpdateEstado(cita.citaId, nuevoEstado);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-5">
        <h3 className="text-lg font-semibold mb-3">Detalles de la Cita</h3>
        
        <div className="space-y-3">
          <div>
            <div className="text-sm text-gray-500">Cliente</div>
            <div className="font-medium">{cita.title}</div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-sm text-gray-500">Fecha</div>
              <div className="font-medium">{cita.date}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Horario</div>
              <div className="font-medium">{cita.start} - {cita.end}</div>
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-500 mb-1">Estado actual</div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${estadoColors[cita.estado] || 'bg-gray-100 text-gray-800'}`}>
              {cita.estado?.toUpperCase() || 'DESCONOCIDO'}
            </span>
          </div>

          {cita.estado !== 'completada' && cita.estado !== 'cancelada' && (
            <div className="pt-3 border-t">
              <div className="text-sm text-gray-700 mb-2">Cambiar estado:</div>
              <div className="flex flex-wrap gap-2">
                {cita.estado !== 'confirmada' && (
                  <button 
                    onClick={() => handleCambiarEstado('confirmada')}
                    className="px-3 py-1 rounded bg-green-600 text-white text-sm hover:bg-green-700"
                  >
                    Confirmar
                  </button>
                )}
                {cita.estado !== 'completada' && (
                  <button 
                    onClick={() => handleCambiarEstado('completada')}
                    className="px-3 py-1 rounded bg-blue-600 text-white text-sm hover:bg-blue-700"
                  >
                    Completar
                  </button>
                )}
                <button 
                  onClick={() => handleCambiarEstado('cancelada')}
                  className="px-3 py-1 rounded bg-red-600 text-white text-sm hover:bg-red-700"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4 mt-4 border-t">
          <button onClick={onClose} className="px-4 py-2 rounded bg-gray-100 text-sm hover:bg-gray-200">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};


const InfoPanel = ({ estadisticas }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 w-full max-w-sm">
      <h4 className="font-semibold mb-3 text-gray-900">Resumen Semanal</h4>

      <div className="space-y-3">
        <div className="bg-blue-50 p-3 rounded">
          <div className="text-sm text-gray-600">Citas esta semana</div>
          <div className="text-2xl font-bold text-blue-600">{estadisticas?.totalCitasSemana || 0}</div>
        </div>

        <div className="bg-green-50 p-3 rounded">
          <div className="text-sm text-gray-600">Citas confirmadas</div>
          <div className="text-2xl font-bold text-green-600">{estadisticas?.confirmadas || 0}</div>
        </div>

        <div className="bg-amber-50 p-3 rounded">
          <div className="text-sm text-gray-600">Citas pendientes</div>
          <div className="text-2xl font-bold text-amber-600">{estadisticas?.pendientes || 0}</div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t">
        <div className="text-xs text-gray-500 mb-2">Información</div>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• Haz doble clic en una cita para ver detalles</li>
          <li>• Usa los botones de navegación para cambiar de semana</li>
          <li>• Los horarios disponibles se calculan automáticamente</li>
        </ul>
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
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  const today = new Date();
  const [weekStart, setWeekStart] = useState(startOfWeek(today));
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [estadisticas, setEstadisticas] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [selectedDate, setSelectedDate] = useState(isoDate(today));
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const days = useMemo(() => Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i)), [weekStart]);

  // Cargar citas y disponibilidad del profesional
  useEffect(() => {
    cargarDatos();
  }, [weekStart]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Cargar citas de la semana
      const fechaInicio = isoDate(days[0]);
      const fechaFin = isoDate(days[6]);
      
      const responseCitas = await fetch(
        `${API_URL}/api/profesionales/dashboard/citas?fecha_inicio=${fechaInicio}&fecha_fin=${fechaFin}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (responseCitas.ok) {
        const dataCitas = await responseCitas.json();
        
        // Convertir citas a bloques
        const citasBlocks = dataCitas.citas.map(cita => {
          const fecha = new Date(cita.fecha_hora);
          const inicio = `${fecha.getHours().toString().padStart(2, '0')}:${fecha.getMinutes().toString().padStart(2, '0')}`;
          const fin = new Date(fecha.getTime() + cita.duracion_minutos * 60000);
          const finStr = `${fin.getHours().toString().padStart(2, '0')}:${fin.getMinutes().toString().padStart(2, '0')}`;
          
          return {
            id: `cita-${cita.id}`,
            type: 'appointment',
            date: isoDate(fecha),
            start: inicio,
            end: finStr,
            title: `Cita · ${cita.cliente.nombre_completo}`,
            citaId: cita.id,
            estado: cita.estado
          };
        });
        
        setBlocks(citasBlocks);
        
        // Calcular estadísticas de la semana
        const confirmadas = citasBlocks.filter(c => c.estado === 'confirmada').length;
        const pendientes = citasBlocks.filter(c => c.estado === 'pendiente').length;
        
        setEstadisticas({
          totalCitasSemana: citasBlocks.length,
          confirmadas,
          pendientes
        });
      }
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const cargarHorariosDisponibles = async (fecha) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${API_URL}/api/profesionales/dashboard/horarios-disponibles?fecha=${fecha}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        setAvailableSlots(data.horarios_disponibles || []);
      }
    } catch (error) {
      console.error('Error cargando horarios:', error);
      setAvailableSlots([]);
    }
  };

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
    setSelectedDate(dateISO || isoDate(today));
    cargarHorariosDisponibles(dateISO || isoDate(today));
  };
  
  const openEdit = (block) => {
    if (block.type === 'appointment') {
      setEditing(block);
      setIsModalOpen(true);
    }
  };
  
  const handleUpdateEstado = async (citaId, nuevoEstado) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${API_URL}/api/profesionales/dashboard/citas/${citaId}/estado?nuevo_estado=${nuevoEstado}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.ok) {
        // Recargar datos
        await cargarDatos();
        alert('Estado actualizado correctamente');
      } else {
        alert('Error al actualizar el estado');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al actualizar el estado');
    }
  };

  const handleSelectSlot = (slot) => {
    setSelectedSlot(slot);
  };
  
  const handleConfirmSlot = async (slot) => {
    if (!slot) return;
    
    try {
      const token = localStorage.getItem('token');
      const fechaHora = new Date(`${selectedDate}T${slot}:00`);
      
      // Por ahora solo mostrar alerta, la creación de citas la hace el cliente
      alert(`Horario disponible seleccionado:\n${selectedDate} a las ${slot}\n\nLos clientes podrán reservar en este horario.`);
      setSelectedSlot(null);
    } catch (error) {
      console.error('Error:', error);
      alert('Error procesando la selección');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ProfessionalNavbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando agenda...</p>
          </div>
        </div>
      </div>
    );
  }

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
            <button onClick={prevWeek} className="px-3 py-2 bg-white border rounded shadow-sm text-sm hover:bg-gray-50">Anterior</button>
            <button onClick={goToThisWeek} className="px-3 py-2 bg-white border rounded shadow-sm text-sm hover:bg-gray-50">Hoy</button>
            <button onClick={nextWeek} className="px-3 py-2 bg-white border rounded shadow-sm text-sm hover:bg-gray-50">Siguiente</button>
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
                    <div 
                      className="h-16 flex flex-col items-center justify-center border-b bg-gray-50 cursor-pointer hover:bg-gray-100"
                      onClick={() => {
                        setSelectedDate(iso);
                        cargarHorariosDisponibles(iso);
                      }}
                    >
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
            <InfoPanel estadisticas={estadisticas} />
            <TimeSlotPanel dateIso={selectedDate} slots={availableSlots} selected={selectedSlot} onSelect={handleSelectSlot} onConfirm={handleConfirmSlot} />
          </div>
        </div>
      </div>

      <CitaDetailModal 
        open={isModalOpen} 
        cita={editing} 
        onClose={() => { setIsModalOpen(false); setEditing(null); }} 
        onUpdateEstado={handleUpdateEstado}
      />
    </div>
  );
};

export default Agenda_profesional;