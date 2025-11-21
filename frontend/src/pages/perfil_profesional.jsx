import React, { useState } from 'react';
import ProfessionalNavbar from '../components/Navbar_profesional';

const ImageUpload = ({ currentImage, onImageChange, userName }) => {
  const [preview, setPreview] = useState(currentImage);
  const [showOptions, setShowOptions] = useState(false);
  const videoRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

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

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsCameraActive(true);
      }
    } catch (error) {
      console.error('Error accediendo a la cámara:', error);
      alert('No se pudo acceder a la cámara. Por favor, verifica los permisos en tu navegador.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (canvasRef.current && videoRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
      const imageData = canvas.toDataURL('image/jpeg');
      setPreview(imageData);
      onImageChange(imageData);
      stopCamera();
      setShowOptions(false);
    }
  };

  const getInitials = () => {
    if (!userName) return '?';
    const names = userName.split(' ');
    if (names.length >= 2) {
      return `${names[0].charAt(0)}${names[1].charAt(0)}`.toUpperCase();
    }
    return userName.charAt(0).toUpperCase();
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        {preview ? (
          <img
            src={preview}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
          />
        ) : (
          <div className="w-32 h-32 rounded-full bg-emerald-600 flex items-center justify-center border-4 border-white shadow-lg">
            <span className="text-white text-4xl font-semibold">{getInitials()}</span>
          </div>
        )}
        <button
          type="button"
          onClick={() => setShowOptions(!showOptions)}
          className="absolute bottom-0 right-0 w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-emerald-700 shadow-lg"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
        
        {showOptions && (
          <div className="absolute top-full mt-2 right-0 bg-white rounded-lg shadow-lg p-2 z-10 min-w-[200px]">
            <label className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer rounded">
              📁 Subir archivo
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  handleFileChange(e);
                  setShowOptions(false);
                }}
                className="hidden"
              />
            </label>
            <button
              type="button"
              onClick={() => {
                startCamera();
                setShowOptions(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
            >
              📷 Tomar foto
            </button>
            {preview && (
              <button
                type="button"
                onClick={() => {
                  setPreview('');
                  onImageChange('');
                  setShowOptions(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 rounded"
              >
                🗑️ Eliminar foto
              </button>
            )}
          </div>
        )}
      </div>
      
      {isCameraActive && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[9999]" style={{ zIndex: 9999 }}>
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <h3 className="text-lg font-semibold mb-4 text-center">Tomar Foto de Perfil</h3>
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted
              className="w-full rounded-lg mb-4 bg-black"
              style={{ maxHeight: '60vh' }}
            />
            <canvas ref={canvasRef} className="hidden" />
            <div className="flex gap-3 justify-center">
              <button
                type="button"
                onClick={capturePhoto}
                className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium"
              >
                📸 Capturar
              </button>
              <button
                type="button"
                onClick={stopCamera}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
      
      <p className="text-xs text-gray-500">Haz clic en el ícono para cambiar tu foto</p>
    </div>
  );
};

/* ---------- Main Component ---------- */
const ProfessionalProfile = () => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(true);

  const [profileData, setProfileData] = useState({
    avatar: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    birthDate: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    
    specialty: '',
    license: '',
    experience: '',
    education: '',
    bio: '',
    languages: [],
    precioConsulta: 0,
    direccionConsultorio: '',
    ciudadConsultorio: '',
    
    workingHours: {
      monday: { active: false, start: '09:00', end: '18:00' },
      tuesday: { active: false, start: '09:00', end: '18:00' },
      wednesday: { active: false, start: '09:00', end: '18:00' },
      thursday: { active: false, start: '09:00', end: '18:00' },
      friday: { active: false, start: '09:00', end: '15:00' },
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
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  React.useEffect(() => {
    cargarPerfil();
  }, []);

  const cargarPerfil = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Cargar perfil
      const response = await fetch(`${API_URL}/api/profesionales/perfil`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Error al cargar perfil');
      }

      const data = await response.json();
      
      // Cargar disponibilidad
      const dispResponse = await fetch(`${API_URL}/api/profesionales/disponibilidad`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      let workingHours = {
        monday: { active: false, start: '09:00', end: '18:00' },
        tuesday: { active: false, start: '09:00', end: '18:00' },
        wednesday: { active: false, start: '09:00', end: '18:00' },
        thursday: { active: false, start: '09:00', end: '18:00' },
        friday: { active: false, start: '09:00', end: '15:00' },
        saturday: { active: false, start: '10:00', end: '14:00' },
        sunday: { active: false, start: '10:00', end: '14:00' },
      };
      
      if (dispResponse.ok) {
        const dispData = await dispResponse.json();
        const dayMap = {
          'lunes': 'monday',
          'martes': 'tuesday',
          'miercoles': 'wednesday',
          'jueves': 'thursday',
          'viernes': 'friday',
          'sabado': 'saturday',
          'domingo': 'sunday'
        };
        
        console.log('Disponibilidad cargada desde BD:', dispData.disponibilidad);
        
        if (dispData.disponibilidad && Array.isArray(dispData.disponibilidad)) {
          dispData.disponibilidad.forEach(bloque => {
            // Normalizar a minúsculas porque el backend devuelve en minúsculas
            const diaNormalizado = bloque.dia_semana.toLowerCase();
            const dayKey = dayMap[diaNormalizado];
            if (dayKey) {
              workingHours[dayKey] = {
                active: true,
                start: bloque.hora_inicio,
                end: bloque.hora_fin,
                id: bloque.id
              };
              console.log(`Cargado: ${dayKey} -> ${bloque.hora_inicio} a ${bloque.hora_fin}`);
            } else {
              console.warn(`Día no reconocido: ${bloque.dia_semana}`);
            }
          });
        }
      }
      
      const perfilCargado = {
        avatar: data.usuario.foto_perfil || '',
        firstName: data.usuario.nombre || '',
        lastName: data.usuario.apellido || '',
        email: data.usuario.email || '',
        phone: data.usuario.telefono || '',
        birthDate: data.usuario.fecha_nacimiento ? data.usuario.fecha_nacimiento.split('T')[0] : '',
        address: data.usuario.direccion || '',
        city: data.usuario.ciudad || '',
        postalCode: data.usuario.codigo_postal || '',
        country: data.usuario.pais || '',
        
        specialty: data.perfil_profesional.especialidad || '',
        license: data.perfil_profesional.licencia || '',
        experience: data.perfil_profesional.experiencia_anos ? `${data.perfil_profesional.experiencia_anos} años` : '',
        education: data.perfil_profesional.educacion || '',
        bio: data.perfil_profesional.descripcion || '',
        languages: data.perfil_profesional.idiomas ? data.perfil_profesional.idiomas.split(',').map(l => l.trim()).filter(l => l) : [],
        precioConsulta: data.perfil_profesional.precio_consulta || 0,
        direccionConsultorio: data.perfil_profesional.direccion || '',
        ciudadConsultorio: data.perfil_profesional.ciudad || '',
        
        workingHours: workingHours,
        notifications: {
          emailAppointments: data.usuario.notificaciones?.email_citas ?? true,
          emailCancellations: data.usuario.notificaciones?.email_cancelaciones ?? true,
          emailPayments: data.usuario.notificaciones?.email_pagos ?? true,
          smsReminders: data.usuario.notificaciones?.sms_recordatorios ?? false,
          marketingEmails: data.usuario.notificaciones?.email_marketing ?? false,
        },
        privacy: {
          profilePublic: data.usuario.privacidad?.perfil_publico ?? true,
          showPhone: data.usuario.privacidad?.mostrar_telefono ?? false,
          showEmail: data.usuario.privacidad?.mostrar_email ?? true,
        },
      };
      
      setProfileData(perfilCargado);
      setFormData(perfilCargado);
    } catch (error) {
      console.error('Error cargando perfil:', error);
      alert('Error al cargar el perfil. Por favor, recarga la página.');
    } finally {
      setLoading(false);
    }
  };

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
    try {
      setIsSaving(true);
      const token = localStorage.getItem('token');
      
      const experienciaAnos = formData.experience ? parseInt(formData.experience.match(/\d+/)?.[0] || '0') : 0;
      
      const params = new URLSearchParams({
        nombre: formData.firstName,
        apellido: formData.lastName,
        telefono: formData.phone,
        direccion: formData.address,
        ciudad: formData.city,
        pais: formData.country,
        codigo_postal: formData.postalCode,
        especialidad: formData.specialty,
        descripcion: formData.bio,
        experiencia_anos: experienciaAnos.toString(),
        precio_consulta: formData.precioConsulta.toString(),
        direccion_consultorio: formData.direccionConsultorio,
        ciudad_consultorio: formData.ciudadConsultorio,
        licencia: formData.license || '',
        educacion: formData.education || '',
        idiomas: formData.languages.join(', '),
        notif_email_citas: formData.notifications.emailAppointments.toString(),
        notif_email_cancelaciones: formData.notifications.emailCancellations.toString(),
        notif_email_pagos: formData.notifications.emailPayments.toString(),
        notif_sms_recordatorios: formData.notifications.smsReminders.toString(),
        notif_email_marketing: formData.notifications.marketingEmails.toString(),
        perfil_publico: formData.privacy.profilePublic.toString(),
        mostrar_telefono: formData.privacy.showPhone.toString(),
        mostrar_email: formData.privacy.showEmail.toString()
      });
      
      if (formData.birthDate) {
        params.append('fecha_nacimiento', formData.birthDate);
      }
      if (formData.avatar) {
        params.append('foto_perfil', formData.avatar);
      }
      
      const response = await fetch(`${API_URL}/api/profesionales/perfil?${params.toString()}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Error al actualizar perfil');
      }
      
      // 2. Actualizar disponibilidad
      const dayMap = {
        'monday': 'LUNES',
        'tuesday': 'MARTES',
        'wednesday': 'MIERCOLES',
        'thursday': 'JUEVES',
        'friday': 'VIERNES',
        'saturday': 'SABADO',
        'sunday': 'DOMINGO'
      };
      
      console.log('Guardando disponibilidad...', formData.workingHours);
      
      // Obtener disponibilidad actual
      const dispActual = await fetch(`${API_URL}/api/profesionales/disponibilidad`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!dispActual.ok) {
        console.error('Error al obtener disponibilidad actual');
      }
      
      const dispData = dispActual.ok ? await dispActual.json() : { disponibilidad: [] };
      const bloquesActuales = dispData.disponibilidad || [];
      console.log('Bloques actuales en BD:', bloquesActuales);
      
      // Normalizar día de semana (backend devuelve en minúsculas)
      const normalizeDia = (dia) => dia.toUpperCase();
      
      // Eliminar bloques que ya no están activos
      for (const bloque of bloquesActuales) {
        const diaNormalizado = normalizeDia(bloque.dia_semana);
        const dayKey = Object.keys(dayMap).find(k => dayMap[k] === diaNormalizado);
        if (!dayKey || !formData.workingHours[dayKey].active) {
          console.log(`Eliminando bloque ${bloque.id} (${bloque.dia_semana})`);
          const deleteRes = await fetch(`${API_URL}/api/profesionales/disponibilidad/${bloque.id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (!deleteRes.ok) {
            console.error(`Error al eliminar bloque ${bloque.id}:`, await deleteRes.text());
          }
        }
      }
      
      // Crear o actualizar bloques activos
      for (const [dayKey, config] of Object.entries(formData.workingHours)) {
        if (config.active) {
          const diaSemana = dayMap[dayKey];
          const bloqueExistente = bloquesActuales.find(b => normalizeDia(b.dia_semana) === diaSemana);
          
          if (bloqueExistente) {
            // Actualizar si cambió
            if (bloqueExistente.hora_inicio !== config.start || bloqueExistente.hora_fin !== config.end) {
              console.log(`Actualizando bloque ${bloqueExistente.id}: ${config.start}-${config.end}`);
              const updateRes = await fetch(`${API_URL}/api/profesionales/disponibilidad/${bloqueExistente.id}?hora_inicio=${config.start}&hora_fin=${config.end}`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
              });
              if (!updateRes.ok) {
                console.error(`Error al actualizar bloque ${bloqueExistente.id}:`, await updateRes.text());
              } else {
                console.log('Bloque actualizado:', await updateRes.json());
              }
            }
          } else {
            // Crear nuevo
            console.log(`Creando nuevo bloque ${diaSemana}: ${config.start}-${config.end}`);
            const createRes = await fetch(`${API_URL}/api/profesionales/disponibilidad?dia_semana=${diaSemana}&hora_inicio=${config.start}&hora_fin=${config.end}`, {
              method: 'POST',
              headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!createRes.ok) {
              console.error(`Error al crear bloque ${diaSemana}:`, await createRes.text());
            } else {
              console.log('Bloque creado:', await createRes.json());
            }
          }
        }
      }
      
      console.log('Disponibilidad guardada correctamente');
      
      // Actualizar estado local
      setProfileData({ ...formData });
      if (formData.avatar) {
        localStorage.setItem('foto_perfil', formData.avatar);
      } else {
        localStorage.removeItem('foto_perfil');
      }
      
      // Actualizar nombre en localStorage
      localStorage.setItem('user_name', formData.firstName);
      localStorage.setItem('user_lastname', formData.lastName);
      
      alert('Perfil actualizado correctamente');
    } catch (error) {
      console.error('Error guardando perfil:', error);
      alert('Error al guardar los cambios: ' + error.message);
    } finally {
      setIsSaving(false);
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ProfessionalNavbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando perfil...</p>
          </div>
        </div>
      </div>
    );
  }

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
                userName={`${formData.firstName} ${formData.lastName}`}
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
                        <label className="block text-sm font-medium text-gray-700 mb-2">Especialidad *</label>
                        <input
                          type="text"
                          value={formData.specialty}
                          onChange={(e) => handleSimpleChange('specialty', e.target.value)}
                          placeholder="Ej: Psicología Clínica, Medicina General, Odontología"
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-300 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Número de Licencia</label>
                        <input
                          type="text"
                          value={formData.license}
                          onChange={(e) => handleSimpleChange('license', e.target.value)}
                          placeholder="Ej: MP-12345"
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-300 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Años de experiencia</label>
                        <input
                          type="number"
                          min="0"
                          max="50"
                          value={formData.experience ? parseInt(formData.experience.match(/\d+/)?.[0] || '0') : ''}
                          onChange={(e) => handleSimpleChange('experience', e.target.value ? `${e.target.value} años` : '')}
                          placeholder="5"
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-300 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Educación</label>
                        <input
                          type="text"
                          value={formData.education}
                          onChange={(e) => handleSimpleChange('education', e.target.value)}
                          placeholder="Ej: Universidad Nacional de Colombia"
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-300 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Precio por Consulta (COP) *</label>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                          <input
                            type="number"
                            min="0"
                            step="1000"
                            value={formData.precioConsulta}
                            onChange={(e) => handleSimpleChange('precioConsulta', parseInt(e.target.value) || 0)}
                            placeholder="50000"
                            className="w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-300 outline-none"
                          />
                        </div>
                        {formData.precioConsulta > 0 && (
                          <p className="text-xs text-gray-500 mt-1">
                            {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(formData.precioConsulta)}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Dirección del Consultorio *</label>
                        <input
                          type="text"
                          value={formData.direccionConsultorio}
                          onChange={(e) => handleSimpleChange('direccionConsultorio', e.target.value)}
                          placeholder="Ej: Calle 123 #45-67, Edificio Médico, Of. 301"
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-300 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Ciudad del Consultorio *</label>
                        <input
                          type="text"
                          value={formData.ciudadConsultorio}
                          onChange={(e) => handleSimpleChange('ciudadConsultorio', e.target.value)}
                          placeholder="Ej: Bogotá, Medellín, Cali"
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
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-300 outline-none"
                            placeholder="••••••••"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Nueva contraseña</label>
                          <input
                            type="password"
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-300 outline-none"
                            placeholder="••••••••"
                          />
                          {passwordData.newPassword && passwordData.newPassword.length < 6 && (
                            <p className="text-xs text-red-500 mt-1">La contraseña debe tener al menos 6 caracteres</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Confirmar nueva contraseña</label>
                          <input
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-300 outline-none"
                            placeholder="••••••••"
                          />
                          {passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
                            <p className="text-xs text-red-500 mt-1">Las contraseñas no coinciden</p>
                          )}
                        </div>
                        <button 
                          onClick={async () => {
                            if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
                              alert('Por favor, completa todos los campos');
                              return;
                            }
                            if (passwordData.newPassword !== passwordData.confirmPassword) {
                              alert('Las contraseñas no coinciden');
                              return;
                            }
                            if (passwordData.newPassword.length < 6) {
                              alert('La contraseña debe tener al menos 6 caracteres');
                              return;
                            }
                            
                            try {
                              const token = localStorage.getItem('token');
                              const response = await fetch(`${API_URL}/api/auth/cambiar-contrasena`, {
                                method: 'PUT',
                                headers: {
                                  'Authorization': `Bearer ${token}`,
                                  'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                  current_password: passwordData.currentPassword,
                                  new_password: passwordData.newPassword
                                })
                              });
                              
                              if (response.ok) {
                                alert('Contraseña actualizada correctamente');
                                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                              } else {
                                const error = await response.json();
                                alert(error.detail || 'Error al actualizar contraseña');
                              }
                            } catch (error) {
                              console.error('Error:', error);
                              alert('Error al actualizar contraseña');
                            }
                          }}
                          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                        >
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