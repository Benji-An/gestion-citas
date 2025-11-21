import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ClientNavbar from '../components/Navbar_cliente';
import UploadPhotoModal from '../components/UploadPhotoModal';
import { getPerfil, actualizarPerfil, cambiarPassword, eliminarCuenta, getToken, logout } from '../api';

const ClientProfile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('personal'); // personal, medical, security
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [profileData, setProfileData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    // Campos opcionales que el backend puede no tener
    fecha_nacimiento: '',
    genero: '',
    direccion: '',
    ciudad: '',
    pais: '',
    codigo_postal: '',
    foto_perfil: null
  });

  useEffect(() => {
    // Verificar autenticación
    const token = getToken();
    if (!token) {
      alert('Debes iniciar sesión para ver tu perfil');
      navigate('/login_clientes');
      return;
    }
    cargarPerfil();
  }, [navigate]);

  const cargarPerfil = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPerfil();
      console.log('Datos del perfil recibidos:', data);
      
      // Formatear fecha de nacimiento para input type="date" (yyyy-MM-dd)
      let fechaFormateada = '';
      if (data.fecha_nacimiento) {
        const fecha = new Date(data.fecha_nacimiento);
        fechaFormateada = fecha.toISOString().split('T')[0];
      }
      
      setProfileData({
        nombre: data.nombre || '',
        apellido: data.apellido || '',
        email: data.email || '',
        telefono: data.telefono || '',
        fecha_nacimiento: fechaFormateada,
        genero: data.genero || '',
        direccion: data.direccion || '',
        ciudad: data.ciudad || '',
        pais: data.pais || '',
        codigo_postal: data.codigo_postal || '',
        foto_perfil: data.foto_perfil || null
      });
    } catch (err) {
      console.error('Error al cargar perfil:', err);
      setError(err.message || 'Error al cargar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value
    });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Enviar todos los campos del perfil
      const dataToUpdate = {
        nombre: profileData.nombre,
        apellido: profileData.apellido,
        telefono: profileData.telefono,
        email: profileData.email,
        fecha_nacimiento: profileData.fecha_nacimiento || null,
        genero: profileData.genero || null,
        direccion: profileData.direccion || null,
        ciudad: profileData.ciudad || null,
        pais: profileData.pais || null,
        codigo_postal: profileData.codigo_postal || null
      };
      
      const response = await actualizarPerfil(dataToUpdate);
      console.log('Respuesta del servidor:', response);
      alert('Perfil actualizado correctamente');
      setIsEditing(false);
      
      // Recargar datos del backend
      await cargarPerfil();
    } catch (err) {
      console.error('Error al actualizar perfil:', err);
      alert(err.message || 'Error al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      alert('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await cambiarPassword({
        password_actual: passwordData.currentPassword,
        password_nuevo: passwordData.newPassword
      });
      alert('Contraseña actualizada correctamente');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      console.error('Error al cambiar contraseña:', err);
      alert(err.message || 'Error al cambiar la contraseña');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadPhoto = () => {
    setShowPhotoModal(true);
  };

  const handleSavePhoto = async (photoData) => {
    try {
      setLoading(true);
      await actualizarPerfil({ foto_perfil: photoData });
      setProfileData({ ...profileData, foto_perfil: photoData });
      alert('Foto de perfil actualizada correctamente');
      await cargarPerfil();
    } catch (err) {
      console.error('Error al actualizar foto:', err);
      alert(err.message || 'Error al actualizar la foto de perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmacion = window.confirm(
      '¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.'
    );
    
    if (!confirmacion) return;
    
    const password = window.prompt('Por favor, ingresa tu contraseña para confirmar:');
    
    if (!password) {
      alert('Debes ingresar tu contraseña para eliminar la cuenta');
      return;
    }
    
    try {
      setLoading(true);
      await eliminarCuenta(password);
      alert('Cuenta eliminada exitosamente');
      logout();
      navigate('/login_clientes');
    } catch (err) {
      console.error('Error al eliminar cuenta:', err);
      alert(err.message || 'Error al eliminar la cuenta');
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  if (loading && !profileData.email) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ClientNavbar />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ClientNavbar />
      
      {/* Modal de foto */}
      <UploadPhotoModal
        isOpen={showPhotoModal}
        onClose={() => setShowPhotoModal(false)}
        onSave={handleSavePhoto}
        currentPhoto={profileData.foto_perfil}
      />
      
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            {/* Foto de perfil */}
            <div className="relative">
              {profileData.foto_perfil ? (
                <img
                  src={profileData.foto_perfil}
                  alt="Foto de perfil"
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center border-4 border-white shadow-lg">
                  <span className="text-5xl font-bold text-white">
                    {profileData.nombre?.[0]?.toUpperCase() || 'U'}
                    {profileData.apellido?.[0]?.toUpperCase() || ''}
                  </span>
                </div>
              )}
              <button
                onClick={handleUploadPhoto}
                className="absolute bottom-0 right-0 bg-emerald-500 hover:bg-cyan-600 text-white p-3 rounded-full shadow-lg transition-colors"
                title="Cambiar foto de perfil"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>

            {/* Información básica */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {profileData.nombre} {profileData.apellido}
              </h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-gray-600 mb-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {profileData.email}
                </div>
                {profileData.telefono && (
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {profileData.telefono}
                  </div>
                )}
                {profileData.fecha_nacimiento && (
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {calculateAge(profileData.fecha_nacimiento)} años
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <span className="px-3 py-1 bg-cyan-100 text-cyan-800 rounded-full text-sm font-medium">
                  Paciente Verificado
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  Cuenta Activa
                </span>
              </div>
            </div>

            {/* Botón de editar */}
            <div>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-medium transition-colors"
                >
                  Editar Perfil
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSaveProfile}
                    className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
                  >
                    Guardar
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('personal')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'personal'
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Información Personal
                </div>
              </button>

              <button
                onClick={() => setActiveTab('security')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'security'
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Seguridad y Privacidad
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Contenido de las tabs */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* Tab: Información Personal */}
          {activeTab === 'personal' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Información Personal
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={profileData.nombre}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Apellido
                  </label>
                  <input
                    type="text"
                    name="apellido"
                    value={profileData.apellido}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    name="telefono"
                    value={profileData.telefono}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Nacimiento
                  </label>
                  <input
                    type="date"
                    name="fecha_nacimiento"
                    value={profileData.fecha_nacimiento}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Género
                  </label>
                  <select
                    name="genero"
                    value={profileData.genero}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none disabled:bg-gray-100"
                  >
                    <option value="">Seleccionar</option>
                    <option>Masculino</option>
                    <option>Femenino</option>
                    <option>Otro</option>
                    <option>Prefiero no decir</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ciudad
                  </label>
                  <input
                    type="text"
                    name="ciudad"
                    value={profileData.ciudad}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    País
                  </label>
                  <input
                    type="text"
                    name="pais"
                    value={profileData.pais}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Código Postal
                  </label>
                  <input
                    type="text"
                    name="codigo_postal"
                    value={profileData.codigo_postal}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none disabled:bg-gray-100"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dirección
                  </label>
                  <input
                    type="text"
                    name="direccion"
                    value={profileData.direccion}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none disabled:bg-gray-100"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab: Seguridad y Privacidad */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Cambiar Contraseña
                </h2>

                <form onSubmit={handleChangePassword} className="space-y-4 max-w-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contraseña Actual
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nueva Contraseña
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                      required
                      minLength="8"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirmar Nueva Contraseña
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                      required
                      minLength="8"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2 bg-emerald-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
                  >
                    Actualizar Contraseña
                  </button>
                </form>
              </div>

              <hr className="my-8" />

              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Zona de Peligro
                </h2>
                <div className="border border-red-200 rounded-lg p-6 bg-red-50">
                  <h3 className="font-semibold text-red-900 mb-2">
                    Eliminar Cuenta
                  </h3>
                  <p className="text-sm text-red-700 mb-4">
                    Una vez que elimines tu cuenta, no hay vuelta atrás. Por favor, estate seguro.
                  </p>
                  <button 
                    onClick={handleDeleteAccount}
                    disabled={loading}
                    className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Eliminando...' : 'Eliminar mi cuenta'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientProfile;