import React, { useState, useMemo } from 'react';
import ProfessionalNavbar from '../components/Navbar_profesional.jsx';

/*
  ProfessionalPatients.jsx
  - Vista de gestión de pacientes para el profesional
  - Lista de pacientes con búsqueda, filtros y paginación
  - Modal inline para ver detalles / editar / agregar paciente
  - Tarjetas con foto, nombre, contacto, última cita, estado
  - Todo en un solo archivo (sin crear archivos nuevos)
  - Tailwind CSS
*/

/* ---------- Modal de Paciente (in-file) ---------- */
const PatientModal = ({ open, patient, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    id: patient?.id || null,
    name: patient?.name || '',
    email: patient?.email || '',
    phone: patient?.phone || '',
    birthDate: patient?.birthDate || '',
    address: patient?.address || '',
    notes: patient?.notes || '',
    status: patient?.status || 'active',
  });

  React.useEffect(() => {
    if (open && patient) {
      setFormData({
        id: patient.id,
        name: patient.name || '',
        email: patient.email || '',
        phone: patient.phone || '',
        birthDate: patient.birthDate || '',
        address: patient.address || '',
        notes: patient.notes || '',
        status: patient.status || 'active',
      });
    } else if (open && !patient) {
      // nuevo paciente
      setFormData({
        id: null,
        name: '',
        email: '',
        phone: '',
        birthDate: '',
        address: '',
        notes: '',
        status: 'active',
      });
    }
  }, [open, patient]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      alert('Nombre y email son requeridos');
      return;
    }
    onSave({
      ...formData,
      id: formData.id || 'p' + Math.random().toString(36).slice(2, 9),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-semibold mb-4">{formData.id ? 'Editar Paciente' : 'Nuevo Paciente'}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo *</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input
                type="email"
                className="w-full px-3 py-2 border rounded"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
              <input
                type="tel"
                className="w-full px-3 py-2 border rounded"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de nacimiento</label>
              <input
                type="date"
                className="w-full px-3 py-2 border rounded"
                value={formData.birthDate}
                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Notas / Observaciones</label>
              <textarea
                className="w-full px-3 py-2 border rounded"
                rows="3"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <select
                className="w-full px-3 py-2 border rounded"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
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

/* ---------- Componente principal ---------- */
const ProfessionalPatients = () => {
  // Mock data (reemplazar con fetch/API)
  const [patients, setPatients] = useState([
    {
      id: 'p1',
      name: 'Ana García López',
      email: 'ana.garcia@example.com',
      phone: '+34 600 123 456',
      birthDate: '1985-03-15',
      address: 'Calle Mayor 10, Madrid',
      notes: 'Alergia a penicilina',
      status: 'active',
      lastVisit: '2025-10-20',
      totalVisits: 12,
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    },
    {
      id: 'p2',
      name: 'Carlos Méndez Ruiz',
      email: 'carlos.mendez@example.com',
      phone: '+34 610 234 567',
      birthDate: '1990-07-22',
      address: 'Avenida Libertad 45, Barcelona',
      notes: '',
      status: 'active',
      lastVisit: '2025-11-01',
      totalVisits: 8,
      avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    },
    {
      id: 'p3',
      name: 'María Torres Sánchez',
      email: 'maria.torres@example.com',
      phone: '+34 620 345 678',
      birthDate: '1978-12-05',
      address: 'Plaza España 3, Valencia',
      notes: 'Diabetes tipo 2',
      status: 'active',
      lastVisit: '2025-09-15',
      totalVisits: 25,
      avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
    },
    {
      id: 'p4',
      name: 'Juan Pérez Fernández',
      email: 'juan.perez@example.com',
      phone: '+34 630 456 789',
      birthDate: '1995-05-10',
      address: 'Calle Sol 22, Sevilla',
      notes: '',
      status: 'inactive',
      lastVisit: '2025-08-10',
      totalVisits: 5,
      avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, active, inactive
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Filtrado y búsqueda
  const filteredPatients = useMemo(() => {
    return patients.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.phone.includes(searchQuery);
      const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [patients, searchQuery, statusFilter]);

  const openAddPatient = () => {
    setSelectedPatient(null);
    setIsModalOpen(true);
  };

  const openEditPatient = (patient) => {
    setSelectedPatient(patient);
    setIsModalOpen(true);
  };

  const savePatient = (data) => {
    setPatients((prev) => {
      const exists = prev.find((p) => p.id === data.id);
      if (exists) {
        return prev.map((p) => (p.id === data.id ? { ...p, ...data } : p));
      }
      return [...prev, { ...data, totalVisits: 0, lastVisit: null, avatar: 'https://randomuser.me/api/portraits/lego/1.jpg' }];
    });
  };

  const deletePatient = (id) => {
    if (!confirm('¿Eliminar este paciente?')) return;
    setPatients((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ProfessionalNavbar />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Pacientes</h1>
            <p className="text-sm text-gray-600 mt-1">Administra la información de tus pacientes y consulta su historial.</p>
          </div>

          <button onClick={openAddPatient} className="px-4 py-2 bg-cyan-600 text-white rounded shadow hover:bg-cyan-700">
            + Nuevo Paciente
          </button>
        </div>

        {/* Filters and search */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <input
              type="search"
              placeholder="Buscar por nombre, email o teléfono..."
              className="px-4 py-2 border rounded w-full md:w-80 focus:ring-2 focus:ring-cyan-300 outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <select
              className="px-3 py-2 border rounded bg-white"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Todos</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
            </select>
          </div>

          <div className="text-sm text-gray-600">
            Mostrando {filteredPatients.length} de {patients.length} pacientes
          </div>
        </div>

        {/* Patient cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPatients.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500">No se encontraron pacientes.</div>
          )}

          {filteredPatients.map((patient) => (
            <div key={patient.id} className="bg-white rounded-lg shadow-sm p-5 hover:shadow-md transition">
              <div className="flex items-start gap-4">
                <img src={patient.avatar} alt={patient.name} className="w-16 h-16 rounded-full object-cover" />

                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                  <p className="text-sm text-gray-500">{patient.email}</p>
                  <p className="text-sm text-gray-500">{patient.phone}</p>
                </div>

                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    patient.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {patient.status === 'active' ? 'Activo' : 'Inactivo'}
                </span>
              </div>

              <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-gray-500">Última visita</div>
                  <div className="font-medium">
                    {patient.lastVisit ? new Date(patient.lastVisit).toLocaleDateString('es-ES') : 'N/A'}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500">Total visitas</div>
                  <div className="font-medium">{patient.totalVisits}</div>
                </div>
              </div>

              {patient.notes && (
                <div className="mt-3 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                  <span className="font-medium">Notas:</span> {patient.notes}
                </div>
              )}

              <div className="mt-4 flex items-center gap-2">
                <button
                  onClick={() => openEditPatient(patient)}
                  className="flex-1 px-3 py-2 bg-cyan-50 text-cyan-700 rounded hover:bg-cyan-100 text-sm"
                >
                  Ver / Editar
                </button>
                <button
                  onClick={() => deletePatient(patient.id)}
                  className="px-3 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100 text-sm"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
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

export default ProfessionalPatients;