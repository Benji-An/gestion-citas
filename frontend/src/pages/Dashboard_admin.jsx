import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/Slider_admin.jsx';

const API_URL = 'http://localhost:8000';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProfessionals: 0,
    totalPatients: 0,
    totalAppointments: 0,
    activeAppointments: 0,
    professionalChange: 0,
    patientChange: 0,
    appointmentChange: 0,
  });
  
  const [recentActivity, setRecentActivity] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Cargar usuarios
      const usersResponse = await fetch(`${API_URL}/api/auth/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const users = await usersResponse.json();
      
      const profesionales = users.filter(u => u.tipo_usuario === 'profesional');
      const pacientes = users.filter(u => u.tipo_usuario === 'cliente');
      
      // Cargar citas
      let citas = [];
      let citasActivas = 0;
      try {
        const citasResponse = await fetch(`${API_URL}/api/citas/admin/todas`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (citasResponse.ok) {
          const citasData = await citasResponse.json();
          citas = citasData.citas || [];
          
          // Contar citas activas (pendientes o confirmadas)
          citasActivas = citas.filter(c => 
            c.estado === 'pendiente' || c.estado === 'confirmada'
          ).length;
          
          // Obtener próximas citas (ordenadas por fecha)
          const proximasCitas = citas
            .filter(c => c.estado === 'pendiente' || c.estado === 'confirmada')
            .filter(c => new Date(c.fecha_hora) > new Date())
            .sort((a, b) => new Date(a.fecha_hora) - new Date(b.fecha_hora))
            .slice(0, 5)
            .map(cita => ({
              id: cita.id,
              patient: cita.cliente?.nombre_completo || 'Sin nombre',
              professional: cita.profesional?.nombre_completo || 'Sin nombre',
              date: cita.fecha_hora,
              time: new Date(cita.fecha_hora).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
              status: cita.estado === 'confirmada' ? 'confirmed' : 'pending'
            }));
          
          setUpcomingAppointments(proximasCitas);
        }
      } catch (citasError) {
        console.error('Error cargando citas:', citasError);
      }
      
      setStats({
        totalProfessionals: profesionales.length,
        totalPatients: pacientes.length,
        totalAppointments: citas.length,
        activeAppointments: citasActivas,
        professionalChange: 0,
        patientChange: 0,
        appointmentChange: 0,
      });
      
      // Actividad reciente basada en usuarios nuevos
      const actividadReciente = users
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5)
        .map((user) => ({
          id: user.id,
          type: user.tipo_usuario === 'profesional' ? 'professional' : 'patient',
          action: user.tipo_usuario === 'profesional' ? 'Nuevo profesional registrado' : 'Nuevo paciente registrado',
          user: `${user.nombre || ''} ${user.apellido || ''}`.trim() || user.email,
          time: formatearTiempo(user.created_at)
        }));
      
      setRecentActivity(actividadReciente);
      
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatearTiempo = (fecha) => {
    const ahora = new Date();
    const entonces = new Date(fecha);
    const diff = ahora - entonces;
    
    const minutos = Math.floor(diff / 60000);
    const horas = Math.floor(diff / 3600000);
    const dias = Math.floor(diff / 86400000);
    
    if (minutos < 60) return `Hace ${minutos} minutos`;
    if (horas < 24) return `Hace ${horas} horas`;
    return `Hace ${dias} días`;
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 ml-64">
        {/* Header */}
        <div className="bg-white shadow-sm border-b sticky top-0 z-10">
          <div className="px-8 py-4">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-600">Resumen general del sistema</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-8">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
          ) : (
            <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-emerald-500">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-500">Total Profesionales</h3>
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900">{stats.totalProfessionals}</div>
              <div className="text-sm text-green-600 mt-2">+{stats.professionalChange}% este mes</div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-500">Total Pacientes</h3>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900">{stats.totalPatients}</div>
              <div className="text-sm text-green-600 mt-2">+{stats.patientChange}% este mes</div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-500">Total Citas</h3>
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900">{stats.totalAppointments}</div>
              <div className="text-sm text-green-600 mt-2">+{stats.appointmentChange}% este mes</div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-yellow-500">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-500">Citas Activas</h3>
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900">{stats.activeAppointments}</div>
              <div className="text-sm text-gray-500 mt-2">Hoy</div>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente</h3>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 pb-4 border-b last:border-b-0">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === 'professional' ? 'bg-emerald-500' :
                      activity.type === 'patient' ? 'bg-blue-500' :
                      'bg-purple-500'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                      <p className="text-sm text-gray-600">{activity.user}</p>
                      <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Appointments */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Próximas Citas</h3>
              {upcomingAppointments.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No hay citas próximas registradas</p>
              ) : (
                <div className="space-y-3">
                  {upcomingAppointments.map((apt) => (
                    <div key={apt.id} className="p-3 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900">{apt.patient}</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          apt.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {apt.status === 'confirmed' ? 'Confirmada' : 'Pendiente'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">con {apt.professional}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(apt.date).toLocaleDateString('es-ES')} a las {apt.time}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;