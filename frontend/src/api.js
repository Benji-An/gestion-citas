const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// ==================== AUTENTICACIÓN ====================

/**
 * Registra un nuevo usuario
 */
export async function register(userData) {
  const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || 'Error al registrar usuario');
  }
  
  return res.json();
}

/**
 * Inicia sesión con email y contraseña
 */
export async function login(email, password) {
  const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || 'Email o contraseña incorrectos');
  }
  
  const data = await res.json();
  // Guardar el token en localStorage
  localStorage.setItem('token', data.access_token);
  return data;
}

/**
 * Cierra sesión (elimina el token)
 */
export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

/**
 * Obtiene el token del localStorage
 */
export function getToken() {
  return localStorage.getItem('token');
}

/**
 * Verifica si el usuario está autenticado
 */
export function isAuthenticated() {
  return !!getToken();
}

/**
 * Obtiene la información del usuario actual
 */
export async function getCurrentUser() {
  const token = getToken();
  if (!token) throw new Error('No hay token de autenticación');
  
  const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!res.ok) {
    if (res.status === 401) {
      logout(); // Token inválido o expirado
      throw new Error('Sesión expirada');
    }
    throw new Error('Error al obtener información del usuario');
  }
  
  const user = await res.json();
  // Guardar usuario en localStorage
  localStorage.setItem('user', JSON.stringify(user));
  return user;
}

/**
 * Obtiene el usuario del localStorage
 */
export function getStoredUser() {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
}

// ==================== PROFESIONALES ====================

/**
 * Obtiene la lista de profesionales con filtros opcionales
 */
export async function getProfesionales(params = {}) {
  const queryParams = new URLSearchParams();
  
  if (params.skip !== undefined) queryParams.append('skip', params.skip);
  if (params.limit !== undefined) queryParams.append('limit', params.limit);
  if (params.especialidad) queryParams.append('especialidad', params.especialidad);
  if (params.ciudad) queryParams.append('ciudad', params.ciudad);
  if (params.busqueda) queryParams.append('busqueda', params.busqueda);
  
  const url = `${API_BASE_URL}/api/profesionales/?${queryParams.toString()}`;
  const res = await fetch(url);
  
  if (!res.ok) {
    throw new Error('Error al obtener profesionales');
  }
  
  return res.json();
}

/**
 * Obtiene los detalles de un profesional específico
 */
export async function getProfesional(profesionalId) {
  const res = await fetch(`${API_BASE_URL}/api/profesionales/${profesionalId}`);
  
  if (!res.ok) {
    throw new Error('Profesional no encontrado');
  }
  
  return res.json();
}

/**
 * Obtiene la lista de especialidades disponibles
 */
export async function getEspecialidades() {
  const res = await fetch(`${API_BASE_URL}/api/profesionales/especialidades/listar`);
  
  if (!res.ok) {
    throw new Error('Error al obtener especialidades');
  }
  
  return res.json();
}

/**
 * Obtiene la lista de ciudades disponibles
 */
export async function getCiudades() {
  const res = await fetch(`${API_BASE_URL}/api/profesionales/ciudades/listar`);
  
  if (!res.ok) {
    throw new Error('Error al obtener ciudades');
  }
  
  return res.json();
}

/**
 * Agrega un profesional a favoritos
 */
export async function agregarFavorito(profesionalId) {
  const token = getToken();
  if (!token) throw new Error('No hay token de autenticación');
  
  const res = await fetch(`${API_BASE_URL}/api/profesionales/favoritos/${profesionalId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || 'Error al agregar a favoritos');
  }
  
  return res.json();
}

/**
 * Elimina un profesional de favoritos
 */
export async function eliminarFavorito(profesionalId) {
  const token = getToken();
  if (!token) throw new Error('No hay token de autenticación');
  
  const res = await fetch(`${API_BASE_URL}/api/profesionales/favoritos/${profesionalId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || 'Error al eliminar de favoritos');
  }
  
  return res.json();
}

/**
 * Obtiene la lista de profesionales favoritos del usuario actual
 */
export async function getMisFavoritos() {
  const token = getToken();
  if (!token) throw new Error('No hay token de autenticación');
  
  const res = await fetch(`${API_BASE_URL}/api/profesionales/favoritos/mis-favoritos`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!res.ok) {
    throw new Error('Error al obtener favoritos');
  }
  
  const data = await res.json();
  return data.favoritos || [];
}

// ==================== CITAS ====================

/**
 * Obtiene las citas del cliente actual
 * @param {string} estado - Filtro opcional por estado (pendiente, confirmada, cancelada, completada)
 */
export async function getMisCitas(estado = null) {
  const token = getToken();
  if (!token) throw new Error('No hay token de autenticación');
  
  const url = estado 
    ? `${API_BASE_URL}/api/citas/mis-citas?estado=${estado}`
    : `${API_BASE_URL}/api/citas/mis-citas`;
  
  const res = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || 'Error al obtener citas');
  }
  
  return res.json();
}

/**
 * Obtiene los detalles de una cita específica
 */
export async function getCita(citaId) {
  const token = getToken();
  if (!token) throw new Error('No hay token de autenticación');
  
  const res = await fetch(`${API_BASE_URL}/api/citas/cita/${citaId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || 'Cita no encontrada');
  }
  
  return res.json();
}

/**
 * Agenda una nueva cita
 */
export async function agendarCita(citaData) {
  const token = getToken();
  if (!token) throw new Error('No hay token de autenticación');
  
  const res = await fetch(`${API_BASE_URL}/api/citas/agendar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(citaData),
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || 'Error al agendar cita');
  }
  
  return res.json();
}

/**
 * Cancela una cita
 */
export async function cancelarCita(citaId) {
  const token = getToken();
  if (!token) throw new Error('No hay token de autenticación');
  
  const res = await fetch(`${API_BASE_URL}/api/citas/cita/${citaId}/cancelar`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || 'Error al cancelar cita');
  }
  
  return res.json();
}

/**
 * Reagenda una cita
 */
export async function reagendarCita(citaId, nuevaFecha) {
  const token = getToken();
  if (!token) throw new Error('No hay token de autenticación');
  
  const res = await fetch(`${API_BASE_URL}/api/citas/cita/${citaId}/reagendar?nueva_fecha=${nuevaFecha}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || 'Error al reagendar cita');
  }
  
  return res.json();
}

// ==================== PAGOS ====================

/**
 * Obtiene el historial de pagos del cliente
 */
export async function getMisPagos(estado = null) {
  const token = getToken();
  if (!token) throw new Error('No hay token de autenticación');
  
  const url = estado 
    ? `${API_BASE_URL}/api/pagos/mis-pagos?estado=${estado}`
    : `${API_BASE_URL}/api/pagos/mis-pagos`;
  
  const res = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || 'Error al obtener pagos');
  }
  
  return res.json();
}

/**
 * Obtiene los detalles de un pago específico
 */
export async function getPago(pagoId) {
  const token = getToken();
  if (!token) throw new Error('No hay token de autenticación');
  
  const res = await fetch(`${API_BASE_URL}/api/pagos/pago/${pagoId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || 'Pago no encontrado');
  }
  
  return res.json();
}

/**
 * Procesa un pago para una cita
 */
export async function procesarPago(pagoData) {
  const token = getToken();
  if (!token) throw new Error('No hay token de autenticación');
  
  const res = await fetch(`${API_BASE_URL}/api/pagos/procesar-pago`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(pagoData),
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || 'Error al procesar pago');
  }
  
  return res.json();
}

/**
 * Obtiene estadísticas de pagos
 */
export async function getEstadisticasPagos() {
  const token = getToken();
  if (!token) throw new Error('No hay token de autenticación');
  
  const res = await fetch(`${API_BASE_URL}/api/pagos/estadisticas`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!res.ok) {
    throw new Error('Error al obtener estadísticas');
  }
  
  return res.json();
}

// ==================== PAYPAL ====================

/**
 * Crea un pago con PayPal
 */
export async function crearPagoPaypal(citaId) {
  const token = getToken();
  if (!token) throw new Error('No hay token de autenticación');
  
  const res = await fetch(`${API_BASE_URL}/api/pagos/paypal/crear-pago`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ cita_id: citaId }),
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || 'Error al crear pago con PayPal');
  }
  
  return res.json();
}

/**
 * Ejecuta un pago de PayPal
 */
export async function ejecutarPagoPaypal(paymentId, payerId) {
  const token = getToken();
  if (!token) throw new Error('No hay token de autenticación');
  
  const res = await fetch(
    `${API_BASE_URL}/api/pagos/paypal/ejecutar-pago?payment_id=${paymentId}&payer_id=${payerId}`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }
  );
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || 'Error al ejecutar pago');
  }
  
  return res.json();
}

/**
 * Obtiene el estado de un pago de PayPal
 */
export async function getEstadoPagoPaypal(paymentId) {
  const token = getToken();
  if (!token) throw new Error('No hay token de autenticación');
  
  const res = await fetch(`${API_BASE_URL}/api/pagos/paypal/estado/${paymentId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || 'Error al obtener estado del pago');
  }
  
  return res.json();
}

// ==================== NOTIFICACIONES ====================

/**
 * Obtiene las notificaciones del usuario
 * @param {boolean} leidas - Filtro opcional por estado leídas/no leídas
 * @param {number} limite - Límite de notificaciones a obtener
 */
export async function getMisNotificaciones(leidas = null, limite = 50) {
  const token = getToken();
  if (!token) throw new Error('No hay token de autenticación');
  
  const params = new URLSearchParams();
  if (leidas !== null) params.append('leidas', leidas);
  if (limite) params.append('limite', limite);
  
  const url = `${API_BASE_URL}/api/notificaciones/mis-notificaciones?${params.toString()}`;
  
  const res = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || 'Error al obtener notificaciones');
  }
  
  return res.json();
}

/**
 * Obtiene el contador de notificaciones no leídas
 */
export async function getContadorNoLeidas() {
  const token = getToken();
  if (!token) throw new Error('No hay token de autenticación');
  
  const res = await fetch(`${API_BASE_URL}/api/notificaciones/no-leidas/count`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || 'Error al obtener contador');
  }
  
  return res.json();
}

/**
 * Marca una notificación como leída
 */
export async function marcarNotificacionLeida(notificacionId) {
  const token = getToken();
  if (!token) throw new Error('No hay token de autenticación');
  
  const res = await fetch(`${API_BASE_URL}/api/notificaciones/marcar-leida/${notificacionId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || 'Error al marcar como leída');
  }
  
  return res.json();
}

/**
 * Marca todas las notificaciones como leídas
 */
export async function marcarTodasLeidas() {
  const token = getToken();
  if (!token) throw new Error('No hay token de autenticación');
  
  const res = await fetch(`${API_BASE_URL}/api/notificaciones/marcar-todas-leidas`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || 'Error al marcar todas como leídas');
  }
  
  return res.json();
}

/**
 * Elimina una notificación
 */
export async function eliminarNotificacion(notificacionId) {
  const token = getToken();
  if (!token) throw new Error('No hay token de autenticación');
  
  const res = await fetch(`${API_BASE_URL}/api/notificaciones/eliminar/${notificacionId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || 'Error al eliminar notificación');
  }
  
  return res.json();
}

// ==================== PERFIL ====================

/**
 * Obtiene el perfil del usuario actual
 */
export async function getPerfil() {
  const token = getToken();
  if (!token) throw new Error('No hay token de autenticación');
  
  const res = await fetch(`${API_BASE_URL}/api/perfil/me`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!res.ok) {
    throw new Error('Error al obtener perfil');
  }
  
  return res.json();
}

/**
 * Actualiza el perfil del usuario
 */
export async function actualizarPerfil(perfilData) {
  const token = getToken();
  if (!token) throw new Error('No hay token de autenticación');
  
  const res = await fetch(`${API_BASE_URL}/api/perfil/actualizar`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(perfilData),
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || 'Error al actualizar perfil');
  }
  
  return res.json();
}

/**
 * Cambia la contraseña del usuario
 */
export async function cambiarPassword(passwordData) {
  const token = getToken();
  if (!token) throw new Error('No hay token de autenticación');
  
  const res = await fetch(`${API_BASE_URL}/api/perfil/cambiar-password`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(passwordData),
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || 'Error al cambiar contraseña');
  }
  
  return res.json();
}

/**
 * Elimina (desactiva) la cuenta del usuario
 */
export async function eliminarCuenta(password) {
  const token = getToken();
  if (!token) throw new Error('No hay token de autenticación');
  
  const res = await fetch(`${API_BASE_URL}/api/perfil/eliminar-cuenta?password=${encodeURIComponent(password)}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || 'Error al eliminar cuenta');
  }
  
  return res.json();
}

// ==================== OTROS ENDPOINTS ====================

export async function getRoot() {
  const res = await fetch(`${API_BASE_URL}/`);
  if (!res.ok) throw new Error('Network response was not ok');
  return res.json();
}

export async function getPatients() {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE_URL}/api/profesionales/dashboard/pacientes`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error('Failed to fetch patients');
  const data = await res.json();
  return data.patients || [];
}

export async function addPatient(patient) {
  const res = await fetch(`${API_BASE_URL}/patients`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patient),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || 'Failed to create patient');
  }
  const data = await res.json();
  return data.patient;
}

export default {
  API_BASE_URL,
  // Auth
  register,
  login,
  logout,
  getToken,
  isAuthenticated,
  getCurrentUser,
  getStoredUser,
  // Profesionales
  getProfesionales,
  getProfesional,
  getEspecialidades,
  getCiudades,
  agregarFavorito,
  eliminarFavorito,
  getMisFavoritos,
  // Citas
  getMisCitas,
  getCita,
  agendarCita,
  cancelarCita,
  reagendarCita,
  // Pagos
  getMisPagos,
  getPago,
  procesarPago,
  getEstadisticasPagos,
  // Notificaciones
  getMisNotificaciones,
  getContadorNoLeidas,
  marcarNotificacionLeida,
  marcarTodasLeidas,
  eliminarNotificacion,
  // Perfil
  getPerfil,
  actualizarPerfil,
  cambiarPassword,
  eliminarCuenta,
  // Others
  getRoot,
  getPatients,
  addPatient,
};
