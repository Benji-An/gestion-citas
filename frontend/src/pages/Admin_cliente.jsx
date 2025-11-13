import React, { useState, useMemo } from 'react';
import AdminSidebar from '../components/Slider_admin.jsx';

/* ---------- Modal para Ver/Editar Paciente ---------- */
const PatientModal = ({ open, patient, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    id: patient?.id || null,
    firstName: patient?.firstName || '',
    lastName: patient?.lastName || '',
    email: patient?.email || '',
    phone: patient?.phone || '',
    birthDate: patient?.birthDate || '',
    address: patient?.address || '',
    city: patient?.city || '',
    notes: patient?.notes || '',
    status: patient?.status || 'active',
  });

  React.useEffect(() => {
    if (open && patient) {
      setFormData({
        id: patient.id,
        firstName: patient.firstName || '',
        lastName: patient.lastName || '',
        email: patient.email || '',
        phone: patient.phone || '',
        birthDate: patient.birthDate || '',
        address: patient.address || '',
        city: patient.city || '',
        notes: patient.notes || '',
        status: patient.status || 'active',
      });
    } else if (open && !patient) {
      setFormData({
        id: null,
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        birthDate: '',
        address: '',
        city: '',
        notes: '',
        status: 'active',
      });
    }
  }, [open, patient]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.email) {
      alert('Por favor completa los campos obligatorios');
      return;
    }
    onSave({
      ...formData,
      id: formData.id || 'pat-' + Math.random().toString(36).slice(2, 9),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">
            {formData.id ? 'Editar Paciente' : 'Nuevo Paciente'}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Apellidos *</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Nacimiento</label>
              <input
                type="date"
                value={formData.birthDate}
                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Notas / Observaciones</label>
              <textarea
                rows="3"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
              </select>
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
              {formData.id ? 'Actualizar' : 'Crear'} Paciente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ---------- Componente Principal ---------- */
const AdminPatients = () => {
  const [patients, setPatients] = useState([
    {
      id: 'pat-1',
      firstName: 'Ana',
      lastName: 'García López',
      email: 'ana.garcia@example.com',
      phone: '+34 600 123 456',
      birthDate: '1985-03-15',
      address: 'Calle Mayor 10',
      city: 'Madrid',
      notes: 'Alergia a penicilina',
      status: 'active',
      totalAppointments: 12,
      lastVisit: '2025-10-20',
      createdAt: '2024-01-10',
    },
    {
      id: 'pat-2',
      firstName: 'Carlos',
      lastName: 'Méndez Ruiz',
      email: 'carlos.mendez@example.com',
      phone: '+34 610 234 567',
      birthDate: '1990-07-22',
      address: 'Avenida Libertad 45',
      city: 'Barcelona',
      notes: '',
      status: 'active',
      totalAppointments: 8,
      lastVisit: '2025-11-01',
      createdAt: '2024-02-15',
    },
    {
      id: 'pat-3',
      firstName: 'María',
      lastName: 'Torres Sánchez',
      email: 'maria.torres@example.com',
      phone: '+34 620 345 678',
      birthDate: '1978-12-05',
      address: 'Plaza España 3',
      city: 'Valencia',
      notes: 'Diabetes tipo 2',
      status: 'active',
      totalAppointments: 25,
      lastVisit: '2025-09-15',
      createdAt: '2023-11-20',
    },
    {
      id: 'pat-4',
      firstName: 'Juan',
      lastName: 'Pérez Fernández',
      email: 'juan.perez@example.com',
      phone: '+34 630 456 789',
      birthDate: '1995-05-10',
      address: 'Calle Sol 22',
      city: 'Sevilla',
      notes: '',
      status: 'inactive',
      totalAppointments: 5,
      lastVisit: '2025-08-10',
      createdAt: '2024-06-05',
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const filteredPatients = useMemo(() => {
    return patients.filter((pat) => {
      const matchesSearch =
        pat.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pat.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pat.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pat.phone.includes(searchQuery);
      
      const matchesStatus = statusFilter === 'all' || pat.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [patients, searchQuery, statusFilter]);

  const openCreate = () => {
    setSelectedPatient(null);
    setIsModalOpen(true);
  };

  const openEdit = (pat) => {
    setSelectedPatient(pat);
    setIsModalOpen(true);
  };

  const savePatient = (data) => {
    setPatients((prev) => {
      const exists = prev.find((p) => p.id === data.id);
      if (exists) {
        return prev.map((p) => (p.id === data.id ? { ...p, ...data } : p));
      }
      return [...prev, { ...data, totalAppointments: 0, lastVisit: null, createdAt: '2025-11-13' }];
    });
  };

  const deletePatient = (id) => {
    if (confirm('¿Estás seguro de que quieres eliminar este paciente? Esta acción no se puede deshacer.')) {
      setPatients((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 ml-64">
        <div className="bg-white shadow-sm border-b sticky top-0 z-10">
          <div className="px-8 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gestión de Pacientes</h1>
              <p className="text-sm text-gray-600">Administra los pacientes del sistema</p>
            </div>
            <button
              onClick={openCreate}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Nuevo Paciente
            </button>
          </div>
        </div>

        <div className="p-8">
          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="search"
                placeholder="Buscar por nombre, email o teléfono..."
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
                <option value="active">Activos</option>
                <option value="inactive">Inactivos</option>
              </select>
            </div>
            <div className="text-sm text-gray-600 mt-3">
              Mostrando {filteredPatients.length} de {patients.length} pacientes
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paciente</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Teléfono</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ciudad</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Citas</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Última Visita</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPatients.length === 0 && (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                      No se encontraron pacientes
                    </td>
                  </tr>
                )}

                {filteredPatients.map((pat) => (
                  <tr key={pat.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-700">
                            {pat.firstName[0]}{pat.lastName[0]}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{pat.firstName} {pat.lastName}</div>
                          <div className="text-sm text-gray-500">ID: {pat.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{pat.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{pat.phone}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{pat.city}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{pat.totalAppointments}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {pat.lastVisit ? new Date(pat.lastVisit).toLocaleDateString('es-ES') : 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        pat.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {pat.status === 'active' ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(pat)}
                          className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                          title="Editar"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => deletePatient(pat.id)}
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

      <PatientModal
        open={isModalOpen}
        patient={selectedPatient}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPatient(null);
        }}
        onSave={savePatient}
      />
    </div>
  );
};

export default AdminPatients;