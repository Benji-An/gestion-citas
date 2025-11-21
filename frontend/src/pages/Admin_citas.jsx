import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/Slider_admin.jsx';

const AdminCitas = () => {
  const [filtroEstado, setFiltroEstado] = useState('todas');
  const [busqueda, setBusqueda] = useState('');
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarCitas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtroEstado]);

  const cargarCitas = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const url = filtroEstado === 'todas' 
        ? 'http://localhost:8000/api/citas/admin/todas'
        : `http://localhost:8000/api/citas/admin/todas?estado=${filtroEstado}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCitas(data.citas || []);
      }
    } catch (error) {
      console.error('Error cargando citas:', error);
    } finally {
      setLoading(false);
    }
  };

  const citasFiltradas = citas.filter(cita => {
    if (busqueda === '') return true;
    
    const busquedaLower = busqueda.toLowerCase();
    const nombrePaciente = cita.cliente?.nombre_completo?.toLowerCase() || '';
    const nombreProfesional = cita.profesional?.nombre_completo?.toLowerCase() || '';
    const especialidad = cita.profesional?.especialidad?.toLowerCase() || '';
    
    return nombrePaciente.includes(busquedaLower) || 
           nombreProfesional.includes(busquedaLower) || 
           especialidad.includes(busquedaLower);
  });

  const contadores = {
    total: citas.length,
    confirmadas: citas.filter(c => c.estado === 'confirmada').length,
    pendientes: citas.filter(c => c.estado === 'pendiente').length,
    completadas: citas.filter(c => c.estado === 'completada').length
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return 'Sin fecha';
    return new Date(fecha).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEstadoBadge = (estado) => {
    const estilos = {
      pendiente: 'bg-yellow-100 text-yellow-800',
      confirmada: 'bg-green-100 text-green-800',
      completada: 'bg-blue-100 text-blue-800',
      cancelada: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${estilos[estado] || 'bg-gray-100 text-gray-800'}`}>
        {estado.charAt(0).toUpperCase() + estado.slice(1)}
      </span>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 ml-64">
        <div className="bg-white shadow-sm border-b sticky top-0 z-10">
          <div className="px-8 py-4">
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Citas</h1>
            <p className="text-sm text-gray-600">Administra todas las citas del sistema</p>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Total Citas</h3>
              <p className="text-3xl font-bold text-gray-900">{contadores.total}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Confirmadas</h3>
              <p className="text-3xl font-bold text-green-600">{contadores.confirmadas}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-yellow-500">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Pendientes</h3>
              <p className="text-3xl font-bold text-yellow-600">{contadores.pendientes}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Completadas</h3>
              <p className="text-3xl font-bold text-blue-600">{contadores.completadas}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
                <input
                  type="text"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Buscar por paciente, profesional o especialidad..."
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-300 outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                <select
                  value={filtroEstado}
                  onChange={(e) => setFiltroEstado(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-300 outline-none"
                >
                  <option value="todas">Todas</option>
                  <option value="pendiente">Pendientes</option>
                  <option value="confirmada">Confirmadas</option>
                  <option value="completada">Completadas</option>
                  <option value="cancelada">Canceladas</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
              </div>
            ) : citasFiltradas.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No hay citas registradas en el sistema</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paciente</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profesional</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Especialidad</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha/Hora</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duración</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {citasFiltradas.map((cita) => (
                      <tr key={cita.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#{cita.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{cita.cliente?.nombre_completo}</div>
                          <div className="text-sm text-gray-500">{cita.cliente?.telefono}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{cita.profesional?.nombre_completo}</div>
                          <div className="text-sm text-gray-500">{cita.profesional?.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {cita.profesional?.especialidad}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatearFecha(cita.fecha_hora)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {cita.duracion_minutos} min
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getEstadoBadge(cita.estado)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          ${cita.precio?.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCitas;
