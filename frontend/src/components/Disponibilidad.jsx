import React, { useState, useEffect } from 'react';

const AvailabilityModal = ({ isOpen, onClose, onSave, initial }) => {
  const [date, setDate] = useState(initial?.date || '');
  const [time, setTime] = useState(initial?.time || '09:00');
  const [duration, setDuration] = useState(initial?.duration || 60);
  const [notes, setNotes] = useState(initial?.notes || '');

  useEffect(() => {
    if (isOpen) {
      setDate(initial?.date || '');
      setTime(initial?.time || '09:00');
      setDuration(initial?.duration || 60);
      setNotes(initial?.notes || '');
    }
  }, [isOpen, initial]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!date) {
      alert('Selecciona una fecha');
      return;
    }
    // simple validation for time
    onSave({
      date,
      time,
      duration: Number(duration),
      notes
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h3 className="text-lg font-semibold mb-4">Agregar Disponibilidad</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Fecha</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Hora</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Duración (min)</label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value={30}>30</option>
                <option value={45}>45</option>
                <option value={60}>60</option>
                <option value={90}>90</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Notas (opcional)</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Ej: Solo online, disponibilidad parcial..."
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200">
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 rounded bg-cyan-600 text-white hover:bg-cyan-700">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AvailabilityModal;