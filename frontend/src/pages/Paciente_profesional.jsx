import React, { useState, useMemo, useEffect } from 'react';
import ProfessionalNavbar from '../components/Navbar_profesional.jsx';
import { getPatients, addPatient } from '../api';

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
        <h3 className="text-xl font-semibold mb-4">Información del Paciente</h3>
        <div className="space-y-4">
          <div className="space-y-6">
            {/* Información básica */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">Información de Contacto</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Nombre</div>
                  <div className="font-medium text-gray-900">{formData.name}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Email</div>
                  <div className="font-medium text-gray-900">{formData.email}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Teléfono</div>
                  <div className="font-medium text-gray-900">{formData.phone || 'No especificado'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Estado</div>
                  <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                    formData.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {formData.status === 'active' ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              </div>
            </div>

            {/* Información de citas */}
            {patient && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Historial de Citas</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Total de citas</div>
                    <div className="text-2xl font-bold text-blue-600">{patient.total_citas || 0}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Última cita</div>
                    <div className="font-medium text-gray-900">
                      {patient.ultima_cita 
                        ? new Date(patient.ultima_cita).toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric'
                          })
                        : 'N/A'}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Nota informativa */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <p className="text-sm text-yellow-800">
                <strong>Nota:</strong> Los datos de los pacientes solo pueden ser modificados por ellos mismos desde su perfil.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-600 text-white hover:bg-gray-700">
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------- Componente principal ---------- */
const ProfessionalPatients = () => {
  const [patients, setPatients] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getPatients();
        if (mounted) setPatients(data);
      } catch (err) {
        console.error('Error fetching patients:', err);
      } finally {
        if (mounted) setLoadingPatients(false);
      }
    })();
    return () => (mounted = false);
  }, []);

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
    alert('Los pacientes se registran por sí mismos. Esta funcionalidad no está disponible.');
    setIsModalOpen(false);
  };

  const deletePatient = (id) => {
    alert('No se pueden eliminar pacientes. Solo puedes ver su información.');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ProfessionalNavbar />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mis Pacientes</h1>
            <p className="text-sm text-gray-600 mt-1">Consulta la información de los pacientes que han tenido citas contigo.</p>
          </div>

          <div className="text-sm text-gray-500">
            Total: {filteredPatients.length} paciente{filteredPatients.length !== 1 ? 's' : ''}
          </div>
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
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-white text-2xl font-bold">
                  {patient.name.charAt(0).toUpperCase()}
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                  <p className="text-sm text-gray-500">{patient.email}</p>
                  <p className="text-sm text-gray-500">{patient.phone || 'Sin teléfono'}</p>
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
                  <div className="text-gray-500">Última cita</div>
                  <div className="font-medium">
                    {patient.ultima_cita ? new Date(patient.ultima_cita).toLocaleDateString('es-ES') : 'N/A'}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500">Total citas</div>
                  <div className="font-medium">{patient.total_citas || 0}</div>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <button
                  onClick={() => openEditPatient(patient)}
                  className="flex-1 px-3 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 text-sm"
                >
                  Ver Historial
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