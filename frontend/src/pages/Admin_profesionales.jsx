import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/Slider_admin.jsx';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const AdminProfesionales = () => {
  const [profesionales, setProfesionales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');

  useEffect(() => {
    cargarProfesionales();
  }, []);

  const cargarProfesionales = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/auth/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const users = await response.json();
      
      const profs = users.filter(u => u.tipo_usuario === 'profesional');
      setProfesionales(profs);
    } catch (error) {
      console.error('Error cargando profesionales:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleEstado = async (userId, estadoActual) => {
    try {
      setProfesionales(profesionales.map(p => 
        p.id === userId ? { ...p, is_active: !estadoActual } : p
      ));
      alert(`Usuario ${!estadoActual ? 'activado' : 'desactivado'} correctamente`);
    } catch (error) {
      console.error('Error actualizando estado:', error);
      alert('Error al actualizar el estado');
    }
  };

  const profesionalesFiltrados = profesionales.filter(prof => {
    const cumpleBusqueda = 
      prof.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
      prof.apellido?.toLowerCase().includes(busqueda.toLowerCase()) ||
      prof.email?.toLowerCase().includes(busqueda.toLowerCase());
    
    const cumpleEstado = 
      filtroEstado === 'todos' ||
      (filtroEstado === 'activos' && prof.is_active) ||
      (filtroEstado === 'inactivos' && !prof.is_active);
    
    return cumpleBusqueda && cumpleEstado;
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 ml-64">
        <div className="bg-white shadow-sm border-b sticky top-0 z-10">
          <div className="px-8 py-4">
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Profesionales</h1>
            <p className="text-sm text-gray-600">Administra los profesionales del sistema</p>
          </div>
        </div>

        <div className="p-8">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
                <input
                  type="text"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Buscar por nombre o email..."
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-300 outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                <select
                  value={filtroEstado}
                  onChange={(e) => setFiltroEstado(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-300 outline-none"
                >
                  <option value="todos">Todos</option>
                  <option value="activos">Activos</option>
                  <option value="inactivos">Inactivos</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
              </div>
            ) : profesionalesFiltrados.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No se encontraron profesionales</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Teléfono</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha Registro</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {profesionalesFiltrados.map((prof) => (
                      <tr key={prof.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#{prof.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {prof.nombre} {prof.apellido}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{prof.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{prof.telefono || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            prof.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {prof.is_active ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {new Date(prof.created_at).toLocaleDateString('es-ES')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => toggleEstado(prof.id, prof.is_active)}
                            className={`px-3 py-1 rounded text-white text-xs ${
                              prof.is_active ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                            }`}
                          >
                            {prof.is_active ? 'Desactivar' : 'Activar'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <p className="text-sm text-gray-600">Total Profesionales</p>
              <p className="text-2xl font-bold text-gray-900">{profesionales.length}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4">
              <p className="text-sm text-gray-600">Activos</p>
              <p className="text-2xl font-bold text-green-600">
                {profesionales.filter(p => p.is_active).length}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4">
              <p className="text-sm text-gray-600">Inactivos</p>
              <p className="text-2xl font-bold text-red-600">
                {profesionales.filter(p => !p.is_active).length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfesionales;
