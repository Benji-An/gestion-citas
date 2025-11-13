import React, { useState, useMemo } from 'react';
import AdminSidebar from '../components/Slider_admin.jsx';

/* ---------- Modal para Crear/Editar Profesional ---------- */
const ProfessionalModal = ({ open, professional, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    id: professional?.id || null,
    firstName: professional?.firstName || '',
    lastName: professional?.lastName || '',
    email: professional?.email || '',
    password: professional?.password || '',
    phone: professional?.phone || '',
    specialty: professional?.specialty || '',
    license: professional?.license || '',
    status: professional?.status || 'active',
  });

  React.useEffect(() => {
    if (open && professional) {
      setFormData({
        id: professional.id,
        firstName: professional.firstName || '',
        lastName: professional.lastName || '',
        email: professional.email || '',
        password: professional.password || '',
        phone: professional.phone || '',
        specialty: professional.specialty || '',
        license: professional.license || '',
        status: professional.status || 'active',
      });
    } else if (open && !professional) {
      setFormData({
        id: null,
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phone: '',
        specialty: '',
        license: '',
        status: 'active',
      });
    }
  }, [open, professional]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.email || (!formData.id && !formData.password)) {
      alert('Por favor completa los campos obligatorios');
      return;
    }
    onSave({
      ...formData,
      id: formData.id || 'prof-' + Math.random().toString(36).slice(2, 9),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">
            {formData.id ? 'Editar Profesional' : 'Nuevo Profesional'}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña {!formData.id && '*'}
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder={formData.id ? 'Dejar vacío para no cambiar' : ''}
                required={!formData.id}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Especialidad</label>
              <input
                type="text"
                value={formData.specialty}
                onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Número de Licencia</label>
              <input
                type="text"
                value={formData.license}
                onChange={(e) => setFormData({ ...formData, license: e.target.value })}
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
                <option value="suspended">Suspendido</option>
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
              {formData.id ? 'Actualizar' : 'Crear'} Profesional
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ---------- Componente Principal ---------- */
const AdminProfessionals = () => {
  const [professionals, setProfessionals] = useState([
    {
      id: 'prof-1',
      firstName: 'Carlos',
      lastName: 'Méndez Ruiz',
      email: 'carlos.mendez@ejemplo.com',
      password: 'carlos123',
      phone: '+34 610 234 567',
      specialty: 'Psicología Clínica',
      license: 'PSI-12345',
      status: 'active',
      patients: 45,
      appointments: 234,
      createdAt: '2024-01-15',
    },
    {
      id: 'prof-2',
      firstName: 'Laura',
      lastName: 'Martínez Gómez',
      email: 'laura.martinez@ejemplo.com',
      password: 'laura123',
      phone: '+34 620 345 678',
      specialty: 'Terapia Familiar',
      license: 'PSI-23456',
      status: 'active',
      patients: 38,
      appointments: 189,
      createdAt: '2024-02-20',
    },
    {
      id: 'prof-3',
      firstName: 'Juan',
      lastName: 'Pérez Fernández',
      email: 'juan.perez@ejemplo.com',
      password: 'juan123',
      phone: '+34 630 456 789',
      specialty: 'Psicología Infantil',
      license: 'PSI-34567',
      status: 'inactive',
      patients: 22,
      appointments: 98,
      createdAt: '2024-03-10',
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProfessional, setSelectedProfessional] = useState(null);

  const filteredProfessionals = useMemo(() => {
    return professionals.filter((prof) => {
      const matchesSearch =
        prof.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prof.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prof.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prof.specialty.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || prof.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [professionals, searchQuery, statusFilter]);

  const openCreate = () => {
    setSelectedProfessional(null);
    setIsModalOpen(true);
  };

  const openEdit = (prof) => {
    setSelectedProfessional(prof);
    setIsModalOpen(true);
  };

  const saveProfessional = (data) => {
    setProfessionals((prev) => {
      const exists = prev.find((p) => p.id === data.id);
      if (exists) {
        return prev.map((p) => (p.id === data.id ? { ...p, ...data } : p));
      }
      return [...prev, { ...data, patients: 0, appointments: 0, createdAt: new Date().toISOString().slice(0, 10) }];
    });
  };

  const deleteProfessional = (id) => {
    if (confirm('¿Estás seguro de que quieres eliminar este profesional? Esta acción no se puede deshacer.')) {
      setProfessionals((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 ml-64">
        <div className="bg-white shadow-sm border-b sticky top-0 z-10">
          <div className="px-8 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gestión de Profesionales</h1>
              <p className="text-sm text-gray-600">Administra los profesionales del sistema</p>
            </div>
            <button
              onClick={openCreate}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Nuevo Profesional
            </button>
          </div>
        </div>

        <div className="p-8">
          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="search"
                placeholder="Buscar por nombre, email o especialidad..."
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
                <option value="suspended">Suspendidos</option>
              </select>
            </div>
            <div className="text-sm text-gray-600 mt-3">
              Mostrando {filteredProfessionals.length} de {professionals.length} profesionales
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Profesional</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Especialidad</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pacientes</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Citas</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProfessionals.length === 0 && (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                      No se encontraron profesionales
                    </td>
                  </tr>
                )}

                {filteredProfessionals.map((prof) => (
                  <tr key={prof.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-emerald-700">
                            {prof.firstName[0]}{prof.lastName[0]}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{prof.firstName} {prof.lastName}</div>
                          <div className="text-sm text-gray-500">{prof.license}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{prof.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{prof.specialty}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{prof.patients}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{prof.appointments}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        prof.status === 'active' ? 'bg-green-100 text-green-800' :
                        prof.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {prof.status === 'active' ? 'Activo' : prof.status === 'inactive' ? 'Inactivo' : 'Suspendido'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(prof)}
                          className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                          title="Editar"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => deleteProfessional(prof.id)}
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

      <ProfessionalModal
        open={isModalOpen}
        professional={selectedProfessional}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProfessional(null);
        }}
        onSave={saveProfessional}
      />
    </div>
  );
};

export default AdminProfessionals;