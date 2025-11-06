import React, { useEffect, useState } from 'react';

const GoToDateModal = ({ isOpen, onClose, initialDate, onGo }) => {
  const [date, setDate] = useState(initialDate || '');

  useEffect(() => {
    if (isOpen) {
      setDate(initialDate || '');
      // foco automático en input si es necesario
      const timeout = setTimeout(() => {
        const el = document.getElementById('goto-date-input');
        if (el) el.focus();
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [isOpen, initialDate]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!date) {
      // validación simple
      return;
    }
    onGo(date);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Ir a fecha</h3>
        <p className="text-sm text-gray-600 mb-4">Introduce la fecha (YYYY-MM-DD) para ir a esa semana.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="goto-date-input" className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
            <input
              id="goto-date-input"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded focus:ring-2 focus:ring-cyan-300 outline-none bg-gray-50"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 text-sm"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-1 rounded bg-cyan-600 hover:bg-cyan-700 text-white text-sm"
            >
              Ir
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GoToDateModal;