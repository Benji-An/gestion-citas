# 🧪 Guía Completa de Pruebas - Sistema de Gestión de Citas

## 📋 Índice
1. [Preparación del Entorno](#preparación-del-entorno)
2. [Credenciales de Prueba](#credenciales-de-prueba)
3. [Pruebas Panel Admin](#pruebas-panel-admin)
4. [Pruebas Cliente](#pruebas-cliente)
5. [Pruebas Profesional](#pruebas-profesional)
6. [Pruebas de Pagos (PayPal)](#pruebas-de-pagos-paypal)
7. [Pruebas de Notificaciones](#pruebas-de-notificaciones)
8. [Verificación Base de Datos](#verificación-base-de-datos)

---

## 🚀 Preparación del Entorno

### 1. Iniciar Backend
```powershell
cd backend
.\env\Scripts\Activate.ps1
python main.py
```
**✅ Verificar:** Backend corriendo en `http://localhost:8000`

### 2. Iniciar Frontend
```powershell
cd frontend
npm run dev
```
**✅ Verificar:** Frontend corriendo en `http://localhost:5173`

### 3. Verificar Base de Datos
```powershell
cd backend
.\env\Scripts\python.exe tests\verificar_db.py
```
**✅ Verificar:** Conexión exitosa a PostgreSQL

---

## 🔐 Credenciales de Prueba

### Admin
- **Email:** admin@tiiwa.com
- **Password:** admin123
- **Tipo:** Administrador

### Cliente 1
- **Email:** cliente@tiiwa.com
- **Password:** cliente123
- **Nombre:** Andrea Camila Ruiz Pinto
- **Tipo:** Cliente

### Cliente 2
- **Email:** juan.perez@gmail.com
- **Password:** (verificar con resetear_password_admin.py)
- **Nombre:** Juan Pérez
- **Tipo:** Cliente

### Profesional 1
- **Email:** profesional@tiiwa.com
- **Password:** profesional123
- **Nombre:** Dr. Carlos Rodríguez
- **Especialidad:** Cardiología
- **Tipo:** Profesional

### Profesional 2
- **Email:** dra.martinez@tiiwa.com
- **Password:** (verificar con resetear_password_admin.py)
- **Nombre:** Dra. Ana Martínez
- **Especialidad:** Dermatología
- **Tipo:** Profesional

### Profesional 3
- **Email:** dr.gomez@tiiwa.com
- **Password:** (verificar con resetear_password_admin.py)
- **Nombre:** Dr. Luis Gómez
- **Especialidad:** Pediatría
- **Tipo:** Profesional

---

## 👨‍💼 Pruebas Panel Admin

### A. Login Admin
1. Ir a `http://localhost:5173`
2. Click en "Iniciar Sesión"
3. Email: `admin@tiiwa.com`
4. Password: `admin123`
5. Click "Iniciar Sesión"

**✅ Verificar:**
- Redirección a `/Dashboard_admin`
- Navbar muestra "Admin Tiiwa"
- Sidebar visible con opciones: Dashboard, Profesionales, Pacientes, Citas

---

### B. Dashboard Admin

**Ruta:** `/Dashboard_admin`

**Pruebas:**
1. **Tarjetas de Estadísticas:**
   - [ ] "Total Profesionales" muestra número correcto (debe ser 3)
   - [ ] "Total Pacientes" muestra número correcto (debe ser 2)
   - [ ] "Total Citas" muestra número correcto (debe ser 1)
   - [ ] "Citas Activas" muestra citas pendientes/confirmadas

2. **Actividad Reciente:**
   - [ ] Muestra últimos 5 usuarios registrados
   - [ ] Muestra nombre, tipo de usuario y tiempo

3. **Próximas Citas:**
   - [ ] Muestra próximas citas confirmadas/pendientes
   - [ ] Muestra paciente, profesional, fecha y hora
   - [ ] Badge de estado (Confirmada/Pendiente)

**🐛 Si no aparecen las citas:**
- Verificar que estás logueado como admin
- Abrir DevTools (F12) → Console
- Verificar errores en la petición a `/api/citas/admin/todas`

---

### C. Gestión de Profesionales

**Ruta:** `/admin/profesionales`

**Pruebas:**
1. **Vista de Lista:**
   - [ ] Muestra tabla con todos los profesionales
   - [ ] Columnas: ID, Nombre, Email, Teléfono, Estado, Fecha Registro

2. **Estadísticas:**
   - [ ] Total de profesionales
   - [ ] Profesionales activos
   - [ ] Profesionales inactivos

3. **Búsqueda:**
   - [ ] Buscar por nombre: "Carlos"
   - [ ] Buscar por email: "martinez"
   - [ ] Verificar filtrado en tiempo real

4. **Filtros:**
   - [ ] Filtrar por "Activos"
   - [ ] Filtrar por "Inactivos"
   - [ ] Filtrar por "Todos"

5. **Acciones:**
   - [ ] Click en "Desactivar" de un profesional activo
   - [ ] Verificar que cambia a estado inactivo
   - [ ] Click en "Activar" de un profesional inactivo
   - [ ] Verificar que cambia a estado activo

**⚠️ Nota:** La activación/desactivación actualmente solo actualiza el estado local, no persiste en base de datos.

---

### D. Gestión de Pacientes

**Ruta:** `/admin/pacientes`

**Pruebas:**
1. **Vista de Lista:**
   - [ ] Muestra tabla con todos los pacientes
   - [ ] Columnas: ID, Nombre, Email, Teléfono, Ciudad, Estado, Fecha Registro

2. **Estadísticas:**
   - [ ] Total de pacientes
   - [ ] Pacientes activos
   - [ ] Pacientes inactivos

3. **Búsqueda:**
   - [ ] Buscar por nombre: "Andrea"
   - [ ] Buscar por email: "juan"
   - [ ] Verificar filtrado en tiempo real

4. **Filtros:**
   - [ ] Filtrar por "Activos"
   - [ ] Filtrar por "Inactivos"
   - [ ] Filtrar por "Todos"

5. **Acciones:**
   - [ ] Click en "Desactivar" de un paciente activo
   - [ ] Verificar que cambia a estado inactivo
   - [ ] Click en "Activar" de un paciente inactivo
   - [ ] Verificar que cambia a estado activo

---

### E. Gestión de Citas

**Ruta:** `/admin/citas`

**Pruebas:**
1. **Estadísticas:**
   - [ ] Total de citas
   - [ ] Citas confirmadas
   - [ ] Citas pendientes
   - [ ] Citas completadas

2. **Vista de Lista:**
   - [ ] Tabla con todas las citas
   - [ ] Columnas: ID, Paciente, Profesional, Especialidad, Fecha/Hora, Duración, Estado, Precio
   - [ ] Badge de estado con colores (amarillo=pendiente, verde=confirmada, azul=completada, rojo=cancelada)

3. **Búsqueda:**
   - [ ] Buscar por nombre de paciente
   - [ ] Buscar por nombre de profesional
   - [ ] Buscar por especialidad

4. **Filtros:**
   - [ ] Filtrar por "Todas"
   - [ ] Filtrar por "Pendientes"
   - [ ] Filtrar por "Confirmadas"
   - [ ] Filtrar por "Completadas"
   - [ ] Filtrar por "Canceladas"

---

## 👤 Pruebas Cliente

### A. Registro de Cliente
1. Ir a `http://localhost:5173`
2. Click en "Registrarse"
3. Completar formulario:
   - Email: `nuevocliente@test.com`
   - Contraseña: `Test123!`
   - Confirmar contraseña: `Test123!`
   - Nombre: `Nuevo`
   - Apellido: `Cliente`
   - Teléfono: `3001234567`
   - Ciudad: `Bogotá`
   - Tipo de usuario: **Cliente**
4. Click "Registrarse"

**✅ Verificar:**
- Redirección a login
- Mensaje de éxito

---

### B. Login Cliente
1. Email: `cliente@tiiwa.com`
2. Password: `cliente123`
3. Click "Iniciar Sesión"

**✅ Verificar:**
- Redirección a `/Dashboard_cliente`
- Navbar muestra "Andrea Camila Ruiz Pinto"

---

### C. Dashboard Cliente

**Ruta:** `/Dashboard_cliente`

**Pruebas:**
1. **Estadísticas:**
   - [ ] Total de citas
   - [ ] Citas pendientes
   - [ ] Citas completadas

2. **Próximas Citas:**
   - [ ] Muestra citas próximas
   - [ ] Información del profesional
   - [ ] Fecha y hora
   - [ ] Botón "Ver Detalles"

3. **Citas Recientes:**
   - [ ] Muestra historial de citas
   - [ ] Estados correctos

---

### D. Buscar Profesionales

**Ruta:** `/profesionales`

**Pruebas:**
1. **Búsqueda:**
   - [ ] Ver lista completa de profesionales
   - [ ] Buscar por nombre
   - [ ] Buscar por especialidad
   - [ ] Buscar por ciudad

2. **Filtros:**
   - [ ] Filtrar por especialidad en dropdown
   - [ ] Filtrar por ciudad en dropdown

3. **Tarjeta de Profesional:**
   - [ ] Foto de perfil
   - [ ] Nombre completo
   - [ ] Especialidad
   - [ ] Calificación con estrellas
   - [ ] Precio
   - [ ] Ciudad
   - [ ] Años de experiencia
   - [ ] Botón "Ver Perfil"
   - [ ] Ícono de favorito (corazón)

4. **Favoritos:**
   - [ ] Click en ícono de corazón vacío
   - [ ] Verificar que se llena (color rojo)
   - [ ] Click nuevamente
   - [ ] Verificar que se vacía

---

### E. Perfil Profesional Público

**Ruta:** `/profesional/:id`

**Pruebas:**
1. **Información Profesional:**
   - [ ] Foto de perfil
   - [ ] Nombre completo
   - [ ] Especialidad
   - [ ] Calificación
   - [ ] Precio
   - [ ] Años de experiencia
   - [ ] Ciudad
   - [ ] Dirección
   - [ ] Teléfono
   - [ ] Email

2. **Sobre Mí:**
   - [ ] Biografía del profesional
   - [ ] Formación académica
   - [ ] Servicios ofrecidos

3. **Agendar Cita:**
   - [ ] Calendario interactivo
   - [ ] Seleccionar fecha futura
   - [ ] Campo de motivo de consulta
   - [ ] Campo de notas adicionales
   - [ ] Botón "Agendar Cita"

4. **Proceso de Agendamiento:**
   - [ ] Seleccionar fecha
   - [ ] Escribir motivo: "Consulta general"
   - [ ] Escribir nota: "Primera visita"
   - [ ] Click "Agendar Cita"
   - [ ] Verificar mensaje de confirmación
   - [ ] Verificar redirección a dashboard

---

### F. Mis Citas

**Ruta:** `/mis-citas`

**Pruebas:**
1. **Vista de Citas:**
   - [ ] Lista de todas las citas
   - [ ] Información del profesional
   - [ ] Fecha y hora
   - [ ] Estado
   - [ ] Precio

2. **Filtros:**
   - [ ] Filtrar por "Todas"
   - [ ] Filtrar por "Pendientes"
   - [ ] Filtrar por "Confirmadas"
   - [ ] Filtrar por "Completadas"
   - [ ] Filtrar por "Canceladas"

3. **Acciones:**
   - [ ] Botón "Cancelar Cita" (solo pendientes/confirmadas)
   - [ ] Click en cancelar
   - [ ] Confirmar cancelación
   - [ ] Verificar cambio de estado

---

### G. Notificaciones

**Ruta:** Click en icono de campana en navbar

**Pruebas:**
1. **Dropdown de Notificaciones:**
   - [ ] Muestra lista de notificaciones
   - [ ] Badge con número de no leídas
   - [ ] Notificaciones no leídas en negrita

2. **Tipos de Notificaciones:**
   - [ ] Notificación de cita creada
   - [ ] Notificación de cita confirmada
   - [ ] Notificación de cita cancelada
   - [ ] Notificación de recordatorio

3. **Acciones:**
   - [ ] Click en notificación no leída
   - [ ] Verificar que se marca como leída
   - [ ] Badge actualiza el número
   - [ ] Botón "Marcar todas como leídas"
   - [ ] Botón "Ver todas"

---

### H. Perfil Cliente

**Ruta:** Click en nombre de usuario → "Perfil"

**Pruebas:**
1. **Información Personal:**
   - [ ] Foto de perfil actual
   - [ ] Botón "Cambiar Foto"
   - [ ] Opción "Tomar Foto" (requiere cámara)
   - [ ] Opción "Subir Archivo"
   - [ ] Verificar actualización en navbar

2. **Editar Información:**
   - [ ] Nombre
   - [ ] Apellido
   - [ ] Teléfono
   - [ ] Ciudad
   - [ ] Dirección
   - [ ] Botón "Guardar Cambios"
   - [ ] Verificar mensaje de éxito

3. **Cambiar Contraseña:**
   - [ ] Campo "Contraseña Actual"
   - [ ] Campo "Nueva Contraseña"
   - [ ] Campo "Confirmar Nueva Contraseña"
   - [ ] Botón "Actualizar Contraseña"
   - [ ] Verificar mensaje de éxito

4. **Configuración de Notificaciones:**
   - [ ] Toggle "Notificaciones Push"
   - [ ] Toggle "Notificaciones por Email"
   - [ ] Verificar que se guardan

---

## 👨‍⚕️ Pruebas Profesional

### A. Registro de Profesional
1. Ir a `http://localhost:5173`
2. Click en "Registrarse"
3. Completar formulario:
   - Email: `nuevoprofesional@test.com`
   - Contraseña: `Test123!`
   - Nombre: `Nuevo`
   - Apellido: `Profesional`
   - Teléfono: `3001234567`
   - Tipo de usuario: **Profesional**
4. Click "Registrarse"

**✅ Verificar:**
- Redirección a login
- Mensaje de éxito

---

### B. Login Profesional
1. Email: `profesional@tiiwa.com`
2. Password: `profesional123`
3. Click "Iniciar Sesión"

**✅ Verificar:**
- Redirección a `/Dashboard_profesional`
- Navbar muestra "Dr. Carlos Rodríguez"

---

### C. Dashboard Profesional

**Ruta:** `/Dashboard_profesional`

**Pruebas:**
1. **Estadísticas:**
   - [ ] Citas de hoy
   - [ ] Citas pendientes
   - [ ] Citas del mes
   - [ ] Ingresos del mes

2. **Próximas Citas:**
   - [ ] Lista de próximas citas
   - [ ] Información del paciente
   - [ ] Fecha y hora
   - [ ] Motivo
   - [ ] Botón "Ver Detalles"

3. **Calendario:**
   - [ ] Vista de calendario mensual
   - [ ] Citas marcadas en el calendario
   - [ ] Click en día muestra citas

---

### D. Perfil Profesional (Edición)

**Ruta:** Click en nombre → "Perfil"

**Pruebas:**

#### 1. Información Personal
- [ ] Foto de perfil
- [ ] Cambiar foto (subir/cámara)
- [ ] Nombre
- [ ] Apellido
- [ ] Email (solo lectura)
- [ ] Teléfono
- [ ] Ciudad
- [ ] Dirección
- [ ] Botón "Guardar Cambios"

#### 2. Información Profesional
- [ ] Especialidad (dropdown)
- [ ] Años de experiencia (número)
- [ ] Precio por consulta
- [ ] Número de licencia profesional
- [ ] Campo "Sobre Mí" (biografía)
- [ ] Campo "Formación Académica"
- [ ] Campo "Servicios" (lista)
- [ ] Botón "Guardar Información Profesional"
- [ ] Verificar mensaje de éxito

#### 3. Horarios de Disponibilidad
- [ ] Tabla con días de la semana
- [ ] Checkbox para activar/desactivar día
- [ ] Hora de inicio (selector)
- [ ] Hora de fin (selector)
- [ ] Ejemplo: Lunes 8:00 - 17:00
- [ ] Botón "Guardar Horarios"
- [ ] Verificar mensaje de éxito

**Probar configuración completa:**
```
Lunes:    ✓  08:00 - 17:00
Martes:   ✓  08:00 - 17:00
Miércoles: ✓  08:00 - 17:00
Jueves:   ✓  08:00 - 17:00
Viernes:  ✓  08:00 - 14:00
Sábado:   ✗  (desactivado)
Domingo:  ✗  (desactivado)
```

#### 4. Configuración
- [ ] Toggle "Notificaciones Push"
- [ ] Toggle "Notificaciones Email - Nuevas Citas"
- [ ] Toggle "Notificaciones Email - Recordatorios"
- [ ] Toggle "Notificaciones Email - Cancelaciones"
- [ ] Botón "Guardar Configuración"

#### 5. Cambiar Contraseña
- [ ] Contraseña actual
- [ ] Nueva contraseña
- [ ] Confirmar nueva contraseña
- [ ] Botón "Actualizar Contraseña"

---

### E. Mis Citas (Profesional)

**Ruta:** `/profesional/citas`

**Pruebas:**
1. **Vista de Citas:**
   - [ ] Lista de todas las citas
   - [ ] Información del paciente
   - [ ] Fecha y hora
   - [ ] Motivo de consulta
   - [ ] Estado
   - [ ] Precio

2. **Filtros:**
   - [ ] Filtrar por estado
   - [ ] Filtrar por fecha

3. **Acciones:**
   - [ ] Botón "Confirmar" (para pendientes)
   - [ ] Botón "Completar" (para confirmadas)
   - [ ] Botón "Cancelar"
   - [ ] Verificar cambios de estado

---

## 💳 Pruebas de Pagos (PayPal)

### A. Configuración PayPal Sandbox

**Archivo:** `backend/utils/paypal_config.py`

Verificar credenciales sandbox:
```python
PAYPAL_MODE = "sandbox"
PAYPAL_CLIENT_ID = "tu_client_id_sandbox"
PAYPAL_CLIENT_SECRET = "tu_client_secret_sandbox"
```

### B. Proceso de Pago

**Desde cliente logueado:**

1. **Reservar Cita con Pago:**
   - [ ] Ir a perfil de profesional
   - [ ] Agendar cita
   - [ ] Sistema crea orden de pago
   - [ ] Redirección a PayPal Sandbox

2. **Pagar en PayPal:**
   - [ ] Login en PayPal Sandbox
   - [ ] Email: `sb-buyer@personal.example.com` (tu cuenta sandbox)
   - [ ] Password: (contraseña sandbox)
   - [ ] Confirmar pago
   - [ ] Redirección de vuelta a la aplicación

3. **Verificación:**
   - [ ] Cita marcada como pagada
   - [ ] Registro en tabla `pagos`
   - [ ] Estado: "completado"
   - [ ] Transaction ID de PayPal guardado

4. **Consultar en Base de Datos:**
```powershell
cd backend
.\env\Scripts\python.exe -c "from database import SessionLocal; from models import Pago; db = SessionLocal(); pagos = db.query(Pago).all(); [print(f'Pago ID: {p.id}, Cita: {p.cita_id}, Monto: {p.monto}, Estado: {p.estado}') for p in pagos]; db.close()"
```

---

## 🔔 Pruebas de Notificaciones

### A. Notificación de Cita Creada

1. **Como Cliente:**
   - [ ] Agendar una cita
   - [ ] Click en campana de notificaciones
   - [ ] Verificar notificación: "Cita agendada con Dr. [Nombre]"
   - [ ] Tipo: `cita_creada`

2. **Como Profesional (del profesional que recibe la cita):**
   - [ ] Logout y login con cuenta profesional
   - [ ] Click en campana
   - [ ] Verificar notificación: "Nueva cita solicitada por [Cliente]"
   - [ ] Tipo: `nueva_cita`

### B. Notificación de Cita Cancelada

1. **Como Cliente:**
   - [ ] Ir a "Mis Citas"
   - [ ] Cancelar una cita
   - [ ] Verificar notificación de cancelación

2. **Como Profesional:**
   - [ ] Verificar notificación: "[Cliente] ha cancelado su cita"
   - [ ] Tipo: `cita_cancelada`

### C. Verificar en Base de Datos

```powershell
cd backend
.\env\Scripts\python.exe tests\verificar_notificaciones_usuario.py
```

**Salida esperada:**
- Lista de notificaciones por usuario
- Tipos de notificación
- Estado (leída/no leída)

---

## 🗄️ Verificación Base de Datos

### A. Consultas Rápidas

#### Verificar Usuarios
```powershell
.\env\Scripts\python.exe -c "from database import SessionLocal; from models import User; db = SessionLocal(); users = db.query(User).all(); [print(f'{u.id}: {u.nombre} {u.apellido} ({u.email}) - {u.tipo_usuario}') for u in users]; db.close()"
```

#### Verificar Citas
```powershell
.\env\Scripts\python.exe tests\verificar_citas.py
```

#### Verificar Notificaciones
```powershell
.\env\Scripts\python.exe tests\verificar_notificaciones_usuario.py
```

#### Verificar Profesionales
```powershell
.\env\Scripts\python.exe tests\verificar_credenciales_prof.py
```

---

## 📊 Scripts de Prueba Disponibles

### En `backend/tests/`

1. **crear_admin.py** - Crear/verificar usuario admin
2. **crear_notificaciones_prueba.py** - Crear notificaciones de prueba
3. **create_test_profesionales.py** - Crear profesionales de prueba
4. **create_test_users.py** - Crear usuarios de prueba
5. **generar_token_admin.py** - Generar token JWT para admin
6. **resetear_password_admin.py** - Resetear contraseña de admin
7. **verificar_citas.py** - Ver todas las citas
8. **verificar_credenciales_prof.py** - Ver profesionales y contraseñas
9. **verificar_db.py** - Verificar conexión a BD
10. **verificar_notificaciones_usuario.py** - Ver notificaciones por usuario
11. **verificar_tipos_notif.py** - Verificar tipos de notificación

### Ejecución
```powershell
cd backend
.\env\Scripts\python.exe tests\[nombre_script].py
```

---

## ✅ Checklist Final

### Backend
- [ ] Servidor corriendo en puerto 8000
- [ ] Base de datos PostgreSQL conectada
- [ ] Endpoints respondiendo correctamente
- [ ] CORS configurado
- [ ] Autenticación JWT funcionando

### Frontend
- [ ] Servidor corriendo en puerto 5173
- [ ] Conexión con backend
- [ ] Login funcional
- [ ] Registro funcional
- [ ] Rutas protegidas

### Funcionalidades Principales
- [ ] Login/Registro (Admin, Cliente, Profesional)
- [ ] Dashboard Admin (con estadísticas reales)
- [ ] Gestión de profesionales
- [ ] Gestión de pacientes
- [ ] Gestión de citas
- [ ] Búsqueda de profesionales
- [ ] Agendar citas
- [ ] Cancelar citas
- [ ] Notificaciones en tiempo real
- [ ] Perfil editable (foto, info, horarios)
- [ ] Cambio de contraseña
- [ ] Favoritos

### Integraciones
- [ ] PayPal sandbox (pagos)
- [ ] Notificaciones (base de datos)
- [ ] Upload de imágenes

---

## 🐛 Solución de Problemas Comunes

### 1. "No aparecen las citas en el dashboard admin"
- Verificar que estás logueado como admin
- Verificar en consola del navegador (F12) si hay errores
- Ejecutar: `python tests\verificar_citas.py`

### 2. "Error de CORS"
- Verificar que backend está en puerto 8000
- Verificar que frontend está en puerto 5173
- Reiniciar ambos servidores

### 3. "No puedo subir foto de perfil"
- Verificar que la carpeta `backend/uploads/` existe
- Verificar permisos de escritura

### 4. "Error al agendar cita"
- Verificar que el profesional tiene horarios configurados
- Verificar que la fecha es futura
- Verificar que no hay conflicto con otra cita

### 5. "No aparecen notificaciones"
- Ejecutar: `python tests\crear_notificaciones_prueba.py`
- Verificar en: `python tests\verificar_notificaciones_usuario.py`

---

## 📞 Endpoints API Importantes

### Autenticación
- `POST /api/auth/register` - Registro
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Usuario actual
- `GET /api/auth/users` - Listar usuarios (admin)

### Profesionales
- `GET /api/profesionales` - Buscar profesionales
- `GET /api/profesionales/{id}` - Perfil público
- `GET /api/profesionales/perfil` - Mi perfil (autenticado)
- `PUT /api/profesionales/perfil` - Actualizar perfil
- `PUT /api/profesionales/horarios` - Actualizar horarios

### Citas
- `GET /api/citas/mis-citas` - Mis citas (cliente)
- `POST /api/citas/agendar` - Agendar cita
- `PUT /api/citas/cita/{id}/cancelar` - Cancelar cita
- `GET /api/citas/admin/todas` - Todas las citas (admin)

### Notificaciones
- `GET /api/notificaciones` - Mis notificaciones
- `PUT /api/notificaciones/{id}/leer` - Marcar como leída
- `PUT /api/notificaciones/marcar-todas-leidas` - Marcar todas

### Perfil
- `POST /api/perfil/upload-foto` - Subir foto de perfil
- `PUT /api/perfil/cambiar-password` - Cambiar contraseña

### Pagos
- `POST /api/pagos/crear-orden` - Crear orden PayPal
- `POST /api/pagos/capturar-pago` - Capturar pago
- `GET /api/pagos/mis-pagos` - Historial de pagos

---

## 📝 Notas Finales

- Todos los endpoints requieren autenticación excepto login y registro
- El token JWT se guarda en `localStorage` con key `token`
- Las fotos de perfil se guardan en `backend/uploads/perfil/`
- PayPal está en modo sandbox, usar credenciales de prueba
- Las notificaciones se crean automáticamente al crear/cancelar citas

---

**¡Listo! Ahora tienes una guía completa para probar todas las funcionalidades del sistema.** 🎉
