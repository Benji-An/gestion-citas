# 🚀 Conexión Backend-Frontend Completada

## ✅ Archivos Actualizados

### Backend
- ✅ Base de datos PostgreSQL configurada
- ✅ Modelos de datos creados
- ✅ Rutas de autenticación funcionando
- ✅ CORS configurado para el frontend

### Frontend
- ✅ `api.js` - Funciones de autenticación agregadas
- ✅ `login_clientes.jsx` - Login conectado al backend
- ✅ `registro_clientes.jsx` - Registro conectado al backend
- ✅ `ProtectedRoute.jsx` - Componente para proteger rutas (nuevo)

## 🔧 Cómo Ejecutar

### 1. Iniciar el Backend

```powershell
cd backend
.\env\Scripts\Activate.ps1
python main.py
```

El backend estará en: `http://localhost:8000`

### 2. Iniciar el Frontend

```powershell
cd frontend
npm run dev
```

El frontend estará en: `http://localhost:5173`

## 🔐 Funcionalidades Implementadas

### API Functions (src/api.js)

- `register(userData)` - Registrar nuevo usuario
- `login(email, password)` - Iniciar sesión
- `logout()` - Cerrar sesión
- `getToken()` - Obtener token del localStorage
- `isAuthenticated()` - Verificar si está autenticado
- `getCurrentUser()` - Obtener info del usuario actual
- `getStoredUser()` - Obtener usuario del localStorage

### Login (src/pages/login_clientes.jsx)

- ✅ Conectado al endpoint `/api/auth/login`
- ✅ Guarda el token en localStorage
- ✅ Obtiene información del usuario
- ✅ Redirige según tipo de usuario:
  - Cliente → `/inicio_clientes`
  - Profesional → `/inicio_profesional`
  - Admin → `/inicio_admin`
- ✅ Muestra mensajes de error
- ✅ Estado de carga

### Registro (src/pages/registro_clientes.jsx)

- ✅ Conectado al endpoint `/api/auth/register`
- ✅ Validación de contraseñas
- ✅ Campos: nombre, apellido, email, teléfono, contraseña
- ✅ Tipo de usuario por defecto: "cliente"
- ✅ Inicia sesión automáticamente después del registro
- ✅ Redirige al dashboard correspondiente
- ✅ Muestra mensajes de error

### ProtectedRoute (src/components/ProtectedRoute.jsx)

Componente para proteger rutas que requieren autenticación.

**Uso básico:**
```jsx
import ProtectedRoute from './components/ProtectedRoute';

// Proteger una ruta (cualquier usuario autenticado)
<Route 
  path="/cliente/perfil" 
  element={
    <ProtectedRoute>
      <ClientProfile />
    </ProtectedRoute>
  } 
/>

// Proteger una ruta con rol específico
<Route 
  path="/admin/dashboard" 
  element={
    <ProtectedRoute requiredRole="admin">
      <DashboardAdmin />
    </ProtectedRoute>
  } 
/>
```

## 📝 Ejemplo: Actualizar App.jsx con Rutas Protegidas

```jsx
import ProtectedRoute from './components/ProtectedRoute';

// En tus Routes:

{/* Rutas públicas */}
<Route path="/" element={<MainLayout />} />
<Route path="/login_clientes" element={<Login />} />
<Route path="/registro_clientes" element={<Register />} />

{/* Rutas protegidas del cliente */}
<Route 
  path="/inicio_clientes" 
  element={
    <ProtectedRoute requiredRole="cliente">
      <InicioClientes />
    </ProtectedRoute>
  } 
/>

<Route 
  path="/cliente/perfil" 
  element={
    <ProtectedRoute requiredRole="cliente">
      <ClientProfile />
    </ProtectedRoute>
  } 
/>

{/* Rutas protegidas del profesional */}
<Route 
  path="/inicio_profesional" 
  element={
    <ProtectedRoute requiredRole="profesional">
      <ProfessionalAppointments />
    </ProtectedRoute>
  } 
/>

{/* Rutas protegidas del admin */}
<Route 
  path="/inicio_admin" 
  element={
    <ProtectedRoute requiredRole="admin">
      <InicioAdmin />
    </ProtectedRoute>
  } 
/>
```

## 🧪 Probar la Autenticación

### Usuarios de Prueba

**Admin:**
- Email: `admin@tiiwa.com`
- Password: `admin123`

**Clientes:**
- Email: `cliente@tiiwa.com` | Password: `cliente123`
- Email: `juan.perez@gmail.com` | Password: `juan123`

**Profesionales:**
- Email: `profesional@tiiwa.com` | Password: `prof123`
- Email: `dra.martinez@tiiwa.com` | Password: `ana123`
- Email: `dr.gomez@tiiwa.com` | Password: `luis123`

### Flujo de Prueba

1. **Registrar nuevo usuario:**
   - Ve a `/registro_clientes`
   - Llena el formulario
   - Click en "Crear Cuenta"
   - Deberías ser redirigido automáticamente

2. **Iniciar sesión:**
   - Ve a `/login_clientes`
   - Ingresa email y contraseña
   - Click en "Iniciar Sesión"
   - Serás redirigido según tu tipo de usuario

3. **Cerrar sesión:**
   - En cualquier componente:
   ```jsx
   import { logout } from '../api';
   
   const handleLogout = () => {
     logout();
     navigate('/login_clientes');
   };
   ```

## 🔄 Próximos Pasos

1. **Agregar ProtectedRoute a todas las rutas privadas** en App.jsx
2. **Crear componente de Navbar** que muestre info del usuario
3. **Agregar botón de Logout** en el navbar
4. **Implementar refresh automático del token** (opcional)
5. **Crear endpoints adicionales** (citas, profesionales, etc.)

## 💾 LocalStorage

El sistema guarda en localStorage:
- `token` - JWT token de autenticación
- `user` - Información del usuario actual

Para acceder en cualquier componente:
```jsx
import { getStoredUser, getToken } from '../api';

const user = getStoredUser();
const token = getToken();
```

## 🐛 Solución de Problemas

### Error: CORS
- Verifica que el backend esté corriendo en `localhost:8000`
- Verifica que el frontend esté en `localhost:5173`

### Error: Network
- Asegúrate que el backend esté ejecutándose
- Verifica la URL en `api.js` (debe ser `http://localhost:8000`)

### Token expirado
- Los tokens expiran en 30 minutos
- Implementa refresh automático o pide login nuevamente

## 📚 Documentación API

Backend Swagger UI: `http://localhost:8000/docs`

Aquí puedes probar todos los endpoints directamente.
