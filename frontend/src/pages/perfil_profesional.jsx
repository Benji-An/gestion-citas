import React, { useState } from 'react';
import ProfessionalNavbar from '../components/Navbar_profesional';

const ImageUpload = ({ currentImage, onImageChange }) => {
  const [preview, setPreview] = useState(currentImage);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        onImageChange(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <img
          src={preview || 'https://via.placeholder.com/150'}
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
        />
        <label
          htmlFor="avatar-upload"
          className="absolute bottom-0 right-0 w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-emerald-700 shadow-lg"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </label>
        <input
          id="avatar-upload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
      <p className="text-xs text-gray-500">Haz clic en el ícono para cambiar tu foto</p>
    </div>
  );
};

/* ---------- Main Component ---------- */
const ProfessionalProfile = () => {
  const [activeTab, setActiveTab] = useState('personal');

  const [profileData, setProfileData] = useState({
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    firstName: 'Andrea',
    lastName: 'Ruiz',
    email: 'andrea.ruiz@example.com',
    phone: '+34 612 345 678',
    birthDate: '1990-05-15',
    address: 'Calle Mayor 123',
    city: 'Madrid',
    postalCode: '28013',
    country: 'España',
    
    specialty: 'Psicología Clínica',
    license: 'PSI-12345',
    experience: '8 años',
    education: 'Máster en Psicología Clínica - Universidad Complutense de Madrid',
    bio: 'Psicóloga clínica especializada en terapia cognitivo-conductual con más de 8 años de experiencia. Enfoque centrado en el paciente y técnicas basadas en evidencia.',
    languages: ['Español', 'Inglés', 'Francés'],
    
    workingHours: {
      monday: { active: true, start: '09:00', end: '18:00' },
      tuesday: { active: true, start: '09:00', end: '18:00' },
      wednesday: { active: true, start: '09:00', end: '18:00' },
      thursday: { active: true, start: '09:00', end: '18:00' },
      friday: { active: true, start: '09:00', end: '15:00' },
      saturday: { active: false, start: '10:00', end: '14:00' },
      sunday: { active: false, start: '10:00', end: '14:00' },
    },
    
    notifications: {
      emailAppointments: true,
      emailCancellations: true,
      emailPayments: true,
      smsReminders: false,
      marketingEmails: false,
    },
    privacy: {
      profilePublic: true,
      showPhone: false,
      showEmail: true,
    },
  });

  const [formData, setFormData] = useState({ ...profileData });
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleSimpleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setTimeout(() => {
      setProfileData({ ...formData });
      setIsSaving(false);
      alert('Perfil actualizado correctamente');
    }, 1000);
  };

  const tabs = [
    { id: 'personal', label: 'Información Personal', icon: '👤' },
    { id: 'professional', label: 'Información Profesional', icon: '💼' },
    { id: 'schedule', label: 'Horarios', icon: '📅' },
    { id: 'settings', label: 'Configuración', icon: '⚙️' },
  ];

  const daysOfWeek = [
    { key: 'monday', label: 'Lunes' },
    { key: 'tuesday', label: 'Martes' },
    { key: 'wednesday', label: 'Miércoles' },
    { key: 'thursday', label: 'Jueves' },
    { key: 'friday', label: 'Viernes' },
    { key: 'saturday', label: 'Sábado' },
    { key: 'sunday', label: 'Domingo' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <ProfessionalNavbar />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Mi Perfil</h1>
          <p className="text-sm text-gray-600 mt-1">Gestiona tu información personal y configuración de cuenta.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <ImageUpload
                currentImage={formData.avatar}
                onImageChange={(img) => handleSimpleChange('avatar', img)}
              />

              <div className="mt-6 text-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  {formData.firstName} {formData.lastName}
                </h3>
                <p className="text-sm text-gray-500">{formData.specialty}</p>
              </div>

              <nav className="mt-6 space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition ${
                      activeTab === tab.id
                        ? 'bg-emerald-50 text-emerald-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-xl">{tab.icon}</span>
                    <span className="text-sm">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {activeTab === 'personal' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Información Personal</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => handleSimpleChange('firstName', e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-300 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Apellidos</label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => handleSimpleChange('lastName', e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-300 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleSimpleChange('email', e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-300 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleSimpleChange('phone', e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-300 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de nacimiento</label>
                      <input
                        type="date"
                        value={formData.birthDate}
                        onChange={(e) => handleSimpleChange('birthDate', e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-300 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => handleSimpleChange('address', e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-300 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ciudad</label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => handleSimpleChange('city', e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-300 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Código Postal</label>
                      <input
                        type="text"
                        value={formData.postalCode}
                        onChange={(e) => handleSimpleChange('postalCode', e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-300 outline-none"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">País</label>
                      <input
                        type="text"
                        value={formData.country}
                        onChange={(e) => handleSimpleChange('country', e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-300 outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'professional' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Información Profesional</h2>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Especialidad</label>
                        <input
                          type="text"
                          value={formData.specialty}
                          onChange={(e) => handleSimpleChange('specialty', e.target.value)}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-300 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Número de Licencia</label>
                        <input
                          type="text"
                          value={formData.license}
                          onChange={(e) => handleSimpleChange('license', e.target.value)}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-300 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Años de experiencia</label>
                        <input
                          type="text"
                          value={formData.experience}
                          onChange={(e) => handleSimpleChange('experience', e.target.value)}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-300 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Educación</label>
                        <input
                          type="text"
                          value={formData.education}
                          onChange={(e) => handleSimpleChange('education', e.target.value)}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-300 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Biografía profesional</label>
                      <textarea
                        rows="5"
                        value={formData.bio}
                        onChange={(e) => handleSimpleChange('bio', e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-300 outline-none"
                        placeholder="Cuéntanos sobre tu experiencia y enfoque profesional..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Idiomas</label>
                      <div className="flex flex-wrap gap-2">
                        {formData.languages.map((lang, idx) => (
                          <span key={idx} className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm flex items-center gap-2">
                            {lang}
                            <button
                              onClick={() => {
                                const newLangs = formData.languages.filter((_, i) => i !== idx);
                                handleSimpleChange('languages', newLangs);
                              }}
                              className="text-emerald-600 hover:text-emerald-800"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                        <button
                          onClick={() => {
                            const newLang = prompt('Añadir idioma:');
                            if (newLang) {
                              handleSimpleChange('languages', [...formData.languages, newLang]);
                            }
                          }}
                          className="px-3 py-1 border border-dashed border-gray-300 rounded-full text-sm text-gray-600 hover:border-emerald-400 hover:text-emerald-600"
                        >
                          + Añadir idioma
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'schedule' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Horarios de Trabajo</h2>
                  
                  <div className="space-y-4">
                    {daysOfWeek.map((day) => (
                      <div key={day.key} className="flex items-center gap-4 p-4 border rounded-lg">
                        <div className="w-32">
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={formData.workingHours[day.key].active}
                              onChange={(e) => handleInputChange('workingHours', day.key, {
                                ...formData.workingHours[day.key],
                                active: e.target.checked,
                              })}
                              className="rounded"
                            />
                            <span className="font-medium text-gray-700">{day.label}</span>
                          </label>
                        </div>

                        {formData.workingHours[day.key].active && (
                          <div className="flex items-center gap-4 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-500">De</span>
                              <input
                                type="time"
                                value={formData.workingHours[day.key].start}
                                onChange={(e) => handleInputChange('workingHours', day.key, {
                                  ...formData.workingHours[day.key],
                                  start: e.target.value,
                                })}
                                className="px-3 py-2 border rounded"
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-500">a</span>
                              <input
                                type="time"
                                value={formData.workingHours[day.key].end}
                                onChange={(e) => handleInputChange('workingHours', day.key, {
                                  ...formData.workingHours[day.key],
                                  end: e.target.value,
                                })}
                                className="px-3 py-2 border rounded"
                              />
                            </div>
                          </div>
                        )}

                        {!formData.workingHours[day.key].active && (
                          <div className="flex-1 text-sm text-gray-400">No disponible</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Configuración de la Cuenta</h2>
                  
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Notificaciones</h3>
                      <div className="space-y-3">
                        {Object.entries({
                          emailAppointments: 'Recibir emails de nuevas citas',
                          emailCancellations: 'Recibir emails de cancelaciones',
                          emailPayments: 'Recibir emails de pagos',
                          smsReminders: 'Recibir recordatorios por SMS',
                          marketingEmails: 'Recibir emails de marketing',
                        }).map(([key, label]) => (
                          <label key={key} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                            <input
                              type="checkbox"
                              checked={formData.notifications[key]}
                              onChange={(e) => handleInputChange('notifications', key, e.target.checked)}
                              className="rounded"
                            />
                            <span className="text-gray-700">{label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacidad</h3>
                      <div className="space-y-3">
                        {Object.entries({
                          profilePublic: 'Perfil público (visible para pacientes)',
                          showPhone: 'Mostrar teléfono en perfil público',
                          showEmail: 'Mostrar email en perfil público',
                        }).map(([key, label]) => (
                          <label key={key} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                            <input
                              type="checkbox"
                              checked={formData.privacy[key]}
                              onChange={(e) => handleInputChange('privacy', key, e.target.checked)}
                              className="rounded"
                            />
                            <span className="text-gray-700">{label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Cambiar Contraseña</h3>
                      <div className="space-y-4 max-w-md">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña actual</label>
                          <input
                            type="password"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-300 outline-none"
                            placeholder="••••••••"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Nueva contraseña</label>
                          <input
                            type="password"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-300 outline-none"
                            placeholder="••••••••"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Confirmar nueva contraseña</label>
                          <input
                            type="password"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-300 outline-none"
                            placeholder="••••••••"
                          />
                        </div>
                        <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
                          Actualizar Contraseña
                        </button>
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <h3 className="text-lg font-semibold text-red-600 mb-4">Zona de Peligro</h3>
                      <button
                        onClick={() => {
                          if (confirm('¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.')) {
                            alert('Función de eliminación de cuenta por implementar');
                          }
                        }}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        Eliminar Cuenta
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-8 pt-6 border-t flex justify-end gap-3">
                <button
                  onClick={() => setFormData({ ...profileData })}
                  className="px-6 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
                >
                  {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalProfile;