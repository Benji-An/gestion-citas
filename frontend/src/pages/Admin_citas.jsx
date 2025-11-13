import React, { useState, useMemo } from 'react';
import AdminSidebar from '../components/Slider_admin.jsx';

/* ---------- Modal para Crear/Editar Cita ---------- */
const AppointmentModal = ({ open, appointment, professionals, patients, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    id: appointment?.id || null,
    patientId: appointment?.patientId || '',
    professionalId: appointment?.professionalId || '',
    date: appointment?.date || '',
    time: appointment?.time || '',
    duration: appointment?.duration || 60,
    type: appointment?.type || 'Consulta General',
    status: appointment?.status || 'pending',
    notes: appointment?.notes || '',
  });

  React.useEffect(() => {
    if (open && appointment) {
      setFormData({
        id: appointment.id,
        patientId: appointment.patientId || '',
        professionalId: appointment.professionalId || '',
        date: appointment.date || '',
        time: appointment.time || '',
        duration: appointment.duration || 60,
        type: appointment.type || 'Consulta General',
        status: appointment.status || 'pending',
        notes: appointment.notes || '',
      });
    } else if (open && !appointment) {
      setFormData({
        id: null,
        patientId: '',
        professionalId: '',
        date: '',
        time: '',
        duration: 60,
        type: 'Consulta General',
        status: 'pending',
        notes: '',
      });
    }
  }, [open, appointment]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.patientId || !formData.professionalId || !formData.date || !formData.time) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }
    onSave({
      ...formData,
      id: formData.id || 'apt-' + Math.random().toString(36).slice(2, 9),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">
            {formData.id ? 'Editar Cita' : 'Nueva Cita'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Paciente *</label>
              <select
                value={formData.patientId}
                onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                required
              >
                <option value="">Seleccionar paciente</option>
                {patients.map((pat) => (
                  <option key={pat.id} value={pat.id}>
                    {pat.firstName} {pat.lastName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Profesional *</label>
              <select
                value={formData.professionalId}
                onChange={(e) => setFormData({ ...formData, professionalId: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                required
              >
                <option value="">Seleccionar profesional</option>
                {professionals.map((prof) => (
                  <option key={prof.id} value={prof.id}>
                    {prof.firstName} {prof.lastName} - {prof.specialty}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha *</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hora *</label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duración (minutos)</label>
              <input
                type="number"
                min="15"
                step="15"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Consulta</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="Consulta General">Consulta General</option>
                <option value="Primera Consulta">Primera Consulta</option>
                <option value="Seguimiento">Seguimiento</option>
                <option value="Urgencia">Urgencia</option>
                <option value="Revisión">Revisión</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="pending">Pendiente</option>
                <option value="confirmed">Confirmada</option>
                <option value="completed">Completada</option>
                <option value="cancelled">Cancelada</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Notas</label>
              <textarea
                rows="3"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder="Motivo de la consulta, síntomas, observaciones..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              {formData.id ? 'Actualizar' : 'Crear'} Cita
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ---------- Componente Principal ---------- */
const AdminAppointments = () => {
  // Mock data - profesionales
  const professionals = [
    { id: 'prof-1', firstName: 'Carlos', lastName: 'Méndez Ruiz', specialty: 'Psicología Clínica' },
    { id: 'prof-2', firstName: 'Laura', lastName: 'Martínez Gómez', specialty: 'Terapia Familiar' },
    { id: 'prof-3', firstName: 'Juan', lastName: 'Pérez Fernández', specialty: 'Psicología Infantil' },
  ];

  // Mock data - pacientes
  const patients = [
    { id: 'pat-1', firstName: 'Ana', lastName: 'García López' },
    { id: 'pat-2', firstName: 'Carlos', lastName: 'Méndez Ruiz' },
    { id: 'pat-3', firstName: 'María', lastName: 'Torres Sánchez' },
    { id: 'pat-4', firstName: 'Juan', lastName: 'Pérez Fernández' },
  ];

  const [appointments, setAppointments] = useState([
    {
      id: 'apt-1',
      patientId: 'pat-1',
      professionalId: 'prof-1',
      date: '2025-11-13',
      time: '10:00',
      duration: 60,
      type: 'Primera Consulta',
      status: 'confirmed',
      notes: 'Primera sesión de evaluación',
      createdAt: '2025-11-01',
    },
    {
      id: 'apt-2',
      patientId: 'pat-2',
      professionalId: 'prof-2',
      date: '2025-11-13',
      time: '11:30',
      duration: 60,
      type: 'Seguimiento',
      status: 'pending',
      notes: 'Sesión de seguimiento familiar',
      createdAt: '2025-11-02',
    },
    {
      id: 'apt-3',
      patientId: 'pat-3',
      professionalId: 'prof-1',
      date: '2025-11-14',
      time: '09:00',
      duration: 90,
      type: 'Consulta General',
      status: 'confirmed',
      notes: 'Terapia cognitivo-conductual',
      createdAt: '2025-11-03',
    },
    {
      id: 'apt-4',
      patientId: 'pat-4',
      professionalId: 'prof-3',
      date: '2025-11-12',
      time: '16:00',
      duration: 60,
      type: 'Revisión',
      status: 'completed',
      notes: 'Revisión de avances',
      createdAt: '2025-10-28',
    },
    {
      id: 'apt-5',
      patientId: 'pat-1',
      professionalId: 'prof-2',
      date: '2025-11-11',
      time: '14:00',
      duration: 60,
      type: 'Consulta General',
      status: 'cancelled',
      notes: 'Cancelada por el paciente',
      createdAt: '2025-10-25',
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all'); // all, today, week, month
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const filteredAppointments = useMemo(() => {
    return appointments.filter((apt) => {
      const patient = patients.find((p) => p.id === apt.patientId);
      const professional = professionals.find((p) => p.id === apt.professionalId);

      const matchesSearch =
        patient?.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient?.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        professional?.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        professional?.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.type.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;

      // Filtro de fecha
      let matchesDate = true;
      if (dateFilter !== 'all') {
        const aptDate = new Date(apt.date);
        const today = new Date('2025-11-13');
        const daysDiff = Math.floor((aptDate - today) / (1000 * 60 * 60 * 24));
        
        if (dateFilter === 'today' && daysDiff !== 0) matchesDate = false;
        if (dateFilter === 'week' && (daysDiff < 0 || daysDiff > 7)) matchesDate = false;
        if (dateFilter === 'month' && (daysDiff < 0 || daysDiff > 30)) matchesDate = false;
      }

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [appointments, searchQuery, statusFilter, dateFilter]);

  const openCreate = () => {
    setSelectedAppointment(null);
    setIsModalOpen(true);
  };

  const openEdit = (apt) => {
    setSelectedAppointment(apt);
    setIsModalOpen(true);
  };

  const saveAppointment = (data) => {
    setAppointments((prev) => {
      const exists = prev.find((a) => a.id === data.id);
      if (exists) {
        return prev.map((a) => (a.id === data.id ? { ...a, ...data } : a));
      }
      return [...prev, { ...data, createdAt: '2025-11-13' }];
    });
  };

  const deleteAppointment = (id) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta cita? Esta acción no se puede deshacer.')) {
      setAppointments((prev) => prev.filter((a) => a.id !== id));
    }
  };

  const getPatientName = (patientId) => {
    const patient = patients.find((p) => p.id === patientId);
    return patient ? `${patient.firstName} ${patient.lastName}` : 'Desconocido';
  };

  const getProfessionalName = (professionalId) => {
    const prof = professionals.find((p) => p.id === professionalId);
    return prof ? `${prof.firstName} ${prof.lastName}` : 'Desconocido';
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 ml-64">
        <div className="bg-white shadow-sm border-b sticky top-0 z-10">
          <div className="px-8 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gestión de Citas</h1>
              <p className="text-sm text-gray-600">Administra las citas del sistema</p>
            </div>
            <button
              onClick={openCreate}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Nueva Cita
            </button>
          </div>
        </div>

        <div className="p-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-yellow-500">
              <div className="text-sm text-gray-500">Pendientes</div>
              <div className="text-2xl font-bold text-gray-900">
                {appointments.filter((a) => a.status === 'pending').length}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-green-500">
              <div className="text-sm text-gray-500">Confirmadas</div>
              <div className="text-2xl font-bold text-gray-900">
                {appointments.filter((a) => a.status === 'confirmed').length}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-500">
              <div className="text-sm text-gray-500">Completadas</div>
              <div className="text-2xl font-bold text-gray-900">
                {appointments.filter((a) => a.status === 'completed').length}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-red-500">
              <div className="text-sm text-gray-500">Canceladas</div>
              <div className="text-2xl font-bold text-gray-900">
                {appointments.filter((a) => a.status === 'cancelled').length}
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="search"
                placeholder="Buscar por paciente, profesional o tipo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="all">Todos los estados</option>
                <option value="pending">Pendientes</option>
                <option value="confirmed">Confirmadas</option>
                <option value="completed">Completadas</option>
                <option value="cancelled">Canceladas</option>
              </select>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="all">Todas las fechas</option>
                <option value="today">Hoy</option>
                <option value="week">Esta semana</option>
                <option value="month">Este mes</option>
              </select>
            </div>
            <div className="text-sm text-gray-600 mt-3">
              Mostrando {filteredAppointments.length} de {appointments.length} citas
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha/Hora</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paciente</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Profesional</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duración</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAppointments.length === 0 && (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                      No se encontraron citas
                    </td>
                  </tr>
                )}

                {filteredAppointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {new Date(apt.date).toLocaleDateString('es-ES')}
                      </div>
                      <div className="text-sm text-gray-500">{apt.time}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{getPatientName(apt.patientId)}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{getProfessionalName(apt.professionalId)}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{apt.type}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{apt.duration} min</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        apt.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        apt.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        apt.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {apt.status === 'confirmed' ? 'Confirmada' :
                         apt.status === 'pending' ? 'Pendiente' :
                         apt.status === 'completed' ? 'Completada' :
                         'Cancelada'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(apt)}
                          className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                          title="Editar"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => deleteAppointment(apt.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          title="Eliminar"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AppointmentModal
        open={isModalOpen}
        appointment={selectedAppointment}
        professionals={professionals}
        patients={patients}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedAppointment(null);
        }}
        onSave={saveAppointment}
      />
    </div>
  );
};

export default AdminAppointments;