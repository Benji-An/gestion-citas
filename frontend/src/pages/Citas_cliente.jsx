import React, { useState } from 'react';
import ClientNavbar from '../components/Navbar_cliente';

const ClientAppointments = () => {
  const [activeTab, setActiveTab] = useState('proximas'); // proximas, pasadas, canceladas

  const appointments = {
    proximas: [
      {
        id: 1,
        professional: "Dra. Ana Torres",
        specialty: "Psicología",
        date: "2025-11-15",
        time: "10:00",
        location: "Madrid, España",
        type: "Presencial",
        image: "https://randomuser.me/api/portraits/women/44.jpg",
        status: "confirmada"
      },
      {
        id: 2,
        professional: "Carlos Vega",
        specialty: "Nutrición",
        date: "2025-11-20",
        time: "15:30",
        location: "Barcelona, España",
        type: "Virtual",
        image: "https://randomuser.me/api/portraits/men/32.jpg",
        status: "pendiente"
      },
      {
        id: 3,
        professional: "Javier Romero",
        specialty: "Fisioterapia",
        date: "2025-11-25",
        time: "09:00",
        location: "Valencia, España",
        type: "Presencial",
        image: "https://randomuser.me/api/portraits/men/52.jpg",
        status: "confirmada"
      }
    ],
    pasadas: [
      {
        id: 4,
        professional: "María González",
        specialty: "Psicología",
        date: "2025-10-10",
        time: "11:00",
        location: "Madrid, España",
        type: "Presencial",
        image: "https://randomuser.me/api/portraits/women/68.jpg",
        status: "completada"
      },
      {
        id: 5,
        professional: "Luis Fernández",
        specialty: "Nutrición",
        date: "2025-10-05",
        time: "14:00",
        location: "Madrid, España",
        type: "Virtual",
        image: "https://randomuser.me/api/portraits/men/22.jpg",
        status: "completada"
      }
    ],
    canceladas: [
      {
        id: 6,
        professional: "Carmen Silva",
        specialty: "Fisioterapia",
        date: "2025-10-20",
        time: "16:00",
        location: "Sevilla, España",
        type: "Presencial",
        image: "https://randomuser.me/api/portraits/women/35.jpg",
        status: "cancelada"
      }
    ]
  };

  const getStatusBadge = (status) => {
    const badges = {
      confirmada: "bg-green-100 text-green-800",
      pendiente: "bg-yellow-100 text-yellow-800",
      completada: "bg-blue-100 text-blue-800",
      cancelada: "bg-red-100 text-red-800"
    };
    const labels = {
      confirmada: "Confirmada",
      pendiente: "Pendiente",
      completada: "Completada",
      cancelada: "Cancelada"
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badges[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ClientNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Título */}
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Mis Citas
        </h1>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('proximas')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'proximas'
                    ? 'border-teal-600 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Próximas ({appointments.proximas.length})
              </button>
              <button
                onClick={() => setActiveTab('pasadas')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'pasadas'
                    ? 'border-teal-600 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Pasadas ({appointments.pasadas.length})
              </button>
              <button
                onClick={() => setActiveTab('canceladas')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'canceladas'
                    ? 'border-teal-600 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Canceladas ({appointments.canceladas.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Lista de citas */}
        <div className="space-y-4">
          {appointments[activeTab].map((appointment) => (
            <div 
              key={appointment.id}
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  {/* Imagen del profesional */}
                  <img 
                    src={appointment.image}
                    alt={appointment.professional}
                    className="w-16 h-16 rounded-full object-cover"
                  />

                  {/* Información */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {appointment.professional}
                        </h3>
                        <p className="text-emerald-600 text-sm font-medium">
                          {appointment.specialty}
                        </p>
                      </div>
                      {getStatusBadge(appointment.status)}
                    </div>

                    <div className="grid md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {formatDate(appointment.date)}
                      </div>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {appointment.time}
                      </div>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {appointment.location}
                      </div>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        {appointment.type}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="flex space-x-2 ml-4">
                  {activeTab === 'proximas' && (
                    <>
                      <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors">
                        Ver Detalles
                      </button>
                      <button className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-medium transition-colors">
                        Cancelar
                      </button>
                    </>
                  )}
                  {activeTab === 'pasadas' && (
                    <>
                      <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors">
                        Ver Detalles
                      </button>
                      <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors">
                        Reservar Otra
                      </button>
                    </>
                  )}
                  {activeTab === 'canceladas' && (
                    <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors">
                      Reservar Otra
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mensaje si no hay citas */}
        {appointments[activeTab].length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No tienes citas {activeTab}
            </h3>
            <p className="text-gray-600 mb-4">
              Busca profesionales y agenda tu primera cita
            </p>
            <button className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
              Buscar Profesionales
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientAppointments;