# Backend API - Tiiwa

Sistema de gestión de citas médicas desarrollado con FastAPI y PostgreSQL.

## 🚀 Tecnologías

- **FastAPI** - Framework web moderno y rápido
- **PostgreSQL** - Base de datos relacional
- **SQLAlchemy** - ORM para Python
- **JWT** - Autenticación basada en tokens
- **Bcrypt** - Hash seguro de contraseñas

## 📋 Requisitos Previos

- Python 3.8+
- PostgreSQL 12+
- pip (gestor de paquetes de Python)

## 🔧 Instalación

### 1. Crear y activar el entorno virtual

```powershell
cd backend
python -m venv env
.\env\Scripts\Activate.ps1
```

### 2. Instalar dependencias

```powershell
pip install -r requirements.txt
```

### 3. Configurar PostgreSQL

Asegúrate de tener PostgreSQL instalado y ejecutándose. Luego crea la base de datos:

```sql
CREATE DATABASE tiiwa_db;
```

### 4. Configurar variables de entorno

Copia el archivo `.env.example` a `.env` y ajusta las configuraciones:

```powershell
copy .env.example .env
```

Edita `.env` con tus credenciales de PostgreSQL:

```env
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/tiiwa_db
SECRET_KEY=tu_clave_secreta_aqui
```

### 5. Inicializar la base de datos

```powershell
python init_db.py
```

### 6. (Opcional) Crear usuarios de prueba

```powershell
python create_test_users.py
```

## 🏃 Ejecución

```powershell
python main.py
```

El servidor estará disponible en: `http://localhost:8000`

Documentación interactiva (Swagger UI): `http://localhost:8000/docs`

## 📁 Estructura del Proyecto

```
backend/
├── main.py                 # Punto de entrada de la aplicación
├── config.py              # Configuración y variables de entorno
├── database.py            # Conexión a base de datos
├── models.py              # Modelos SQLAlchemy (ORM)
├── schemas.py             # Esquemas Pydantic (validación)
├── security.py            # Seguridad (JWT, bcrypt)
├── init_db.py             # Script inicialización BD
│
├── routes/                # 🌐 Endpoints de la API REST
│   ├── __init__.py
│   ├── auth.py           # Autenticación y registro
│   ├── citas.py          # Gestión de citas
│   ├── pagos.py          # Procesamiento de pagos
│   ├── profesionales.py  # Profesionales y perfiles
│   ├── perfil.py         # Perfil de usuario
│   └── notificaciones.py # Sistema de notificaciones
│
├── services/              # 🧠 Lógica de negocio
│   ├── __init__.py
│   ├── cliente_service.py      # Servicios para clientes
│   ├── pago_service.py         # Servicios de pagos
│   └── profesional_service.py  # Servicios de profesionales
│
├── repositories/          # 💾 Capa de acceso a datos (SQL)
│   ├── __init__.py
│   ├── user_repository.py            # CRUD de usuarios
│   ├── profesional_repository.py     # Perfiles profesionales
│   ├── cita_repository.py            # Gestión de citas
│   ├── pago_repository.py            # Pagos y transacciones
│   ├── disponibilidad_repository.py  # Horarios
│   ├── notificacion_repository.py    # Notificaciones
│   └── favorito_repository.py        # Favoritos
│
├── utils/                 # 🔧 Utilidades y helpers
│   ├── __init__.py
│   ├── notificaciones.py     # Helpers de notificaciones
│   └── paypal_config.py      # Configuración PayPal
│
└── tests/                 # 🧪 Scripts de prueba y testing
    ├── __init__.py
    ├── create_test_users.py
    ├── create_test_profesionales.py
    ├── test_endpoint_final.py
    └── verificar_db.py
```

## 🔐 API Endpoints

### Autenticación

- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Usuario actual (requiere token)
- `GET /api/auth/users` - Listar usuarios (requiere token)

## 👥 Usuarios de Prueba

**Admin:** `admin@tiiwa.com` / `admin123`

**Clientes:**
- `cliente@tiiwa.com` / `cliente123`
- `juan.perez@gmail.com` / `juan123`

**Profesionales:**
- `profesional@tiiwa.com` / `profesional123`
- `dra.martinez@tiiwa.com` / `martinez123`
- `dr.gomez@tiiwa.com` / `gomez123`

## 🗄️ Modelos de Base de Datos

1. **users** - Usuarios del sistema
2. **perfiles_profesionales** - Info de profesionales
3. **citas** - Citas agendadas
4. **pagos** - Registros de pagos
5. **disponibilidad** - Horarios disponibles
6. **favoritos** - Profesionales favoritos
7. **notificaciones** - Sistema de notificaciones

## 📚 Arquitectura en Capas (Clean Architecture)

El backend sigue una arquitectura en **4 capas** bien definidas:

```
┌─────────────────────┐
│   Routes (API)      │  🌐 Endpoints HTTP, validación de entrada
├─────────────────────┤
│   Services          │  🧠 Lógica de negocio, orquestación
├─────────────────────┤
│   Repositories      │  💾 Acceso a datos, queries SQL
├─────────────────────┤
│   Models (ORM)      │  📊 Definición de tablas y relaciones
└─────────────────────┘
```

**Utils**: Funciones auxiliares usadas por cualquier capa

### 🎯 Responsabilidades por Capa

#### 1. **Routes** (Controladores HTTP)
- Recibir y validar requests HTTP
- Autenticación y autorización
- Formatear respuestas
- Manejo de errores HTTP

```python
@router.get("/profesionales")
async def listar_profesionales(
    ciudad: Optional[str] = None,
    db: Session = Depends(get_db)
):
    return profesional_service.buscar_profesionales(db, ciudad=ciudad)
```

#### 2. **Services** (Lógica de Negocio)
- Orquestar múltiples operaciones
- Aplicar reglas de negocio
- Coordinar repositorios
- Transformar datos

```python
def obtener_estadisticas_profesional(db: Session, profesional_id: int):
    perfil = ProfesionalRepository.obtener_perfil(db, profesional_id)
    total_citas = CitaRepository.contar_total(db, profesional_id)
    ingresos = PagoRepository.calcular_ingresos_profesional(db, profesional_id)
    
    return {
        "perfil": perfil,
        "total_citas": total_citas,
        "ingresos_totales": ingresos
    }
```

#### 3. **Repositories** (Acceso a Datos)
- Ejecutar queries SQL
- CRUD operations
- Joins y agregaciones
- Filtros y búsquedas

```python
class ProfesionalRepository:
    @staticmethod
    def buscar_profesionales(db, especialidad=None, ciudad=None):
        query = db.query(User, PerfilProfesional).join(...)
        if especialidad:
            query = query.filter(...)
        return query.all()
```

#### 4. **Models** (ORM)
- Definir estructura de tablas
- Relaciones entre entidades
- Validaciones básicas
- Índices y constraints

```python
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True)
```

### ✅ Beneficios de esta Arquitectura

- ✅ **Separación de responsabilidades**: Cada capa tiene un propósito claro
- ✅ **Reutilización de código**: Repositorios y servicios usables en múltiples lugares
- ✅ **Testabilidad**: Cada capa se testea independientemente con mocks
- ✅ **Mantenibilidad**: Cambios localizados sin efectos secundarios
- ✅ **Escalabilidad**: Fácil agregar features sin tocar código existente
- ✅ **Legibilidad**: Código autodocumentado y fácil de entender

### 📊 Flujo de una Request

```
1. Cliente hace request → GET /api/profesionales?ciudad=Bogotá

2. Route (profesionales.py)
   ↓ Valida parámetros
   ↓ Verifica autenticación
   ↓ Llama al servicio

3. Service (profesional_service.py)
   ↓ Aplica lógica de negocio
   ↓ Llama repositorio(s)

4. Repository (profesional_repository.py)
   ↓ Ejecuta query SQL
   ↓ Retorna modelos ORM

5. Models (models.py)
   ↓ SQLAlchemy mapea filas → objetos

6. Response
   ← Repository retorna datos
   ← Service transforma/enriquece
   ← Route serializa a JSON
   ← Cliente recibe respuesta
```

## 🔧 Ejemplos de Uso

### Ejemplo 1: Búsqueda de Profesionales

```python
# ❌ ANTES: Todo mezclado en la ruta
@router.get("/profesionales")
def listar(ciudad: str, db: Session = Depends(get_db)):
    # SQL mezclado con lógica HTTP
    query = db.query(User, PerfilProfesional).join(...)
    if ciudad:
        query = query.filter(User.ciudad.ilike(f"%{ciudad}%"))
    results = query.all()
    
    # Formateo mezclado
    return [{"id": u.id, "nombre": u.nombre, ...} for u, p in results]

# ✅ DESPUÉS: Capas separadas

# Route (profesionales.py)
@router.get("/profesionales")
def listar(ciudad: str, db: Session = Depends(get_db)):
    return profesional_service.buscar_profesionales(db, ciudad=ciudad)

# Service (profesional_service.py)
def buscar_profesionales(db, ciudad):
    profesionales = ProfesionalRepository.buscar_profesionales(db, ciudad=ciudad)
    return [formatear_profesional(u, p) for u, p in profesionales]

# Repository (profesional_repository.py)
class ProfesionalRepository:
    @staticmethod
    def buscar_profesionales(db, ciudad=None):
        query = db.query(User, PerfilProfesional).join(...)
        if ciudad:
            query = query.filter(User.ciudad.ilike(f"%{ciudad}%"))
        return query.all()
```

### Ejemplo 2: Estadísticas Profesional

```python
# Route
@router.get("/estadisticas")
def stats(db: Session = Depends(get_db), user = Depends(get_current_user)):
    return profesional_service.obtener_estadisticas_profesional(db, user.id)

# Service (orquesta múltiples repositorios)
def obtener_estadisticas_profesional(db, prof_id):
    total_citas = CitaRepository.contar_total(db, prof_id, es_profesional=True)
    citas_por_estado = CitaRepository.contar_por_estado(db, prof_id, es_profesional=True)
    ingresos_totales = PagoRepository.calcular_ingresos_profesional(db, prof_id)
    
    return {
        "total_citas": total_citas,
        "estados": citas_por_estado,
        "ingresos": ingresos_totales
    }

# Repositories (queries especializadas)
class CitaRepository:
    @staticmethod
    def contar_total(db, user_id, es_profesional=False):
        filtro = Cita.profesional_id if es_profesional else Cita.cliente_id
        return db.query(Cita).filter(filtro == user_id).count()

class PagoRepository:
    @staticmethod
    def calcular_ingresos_profesional(db, prof_id):
        return db.query(func.sum(Pago.monto)).join(Cita).filter(...).scalar()
```

## 🎓 Guía de Contribución

Al agregar nueva funcionalidad, sigue este orden:

1. **Define el Modelo** (si es necesario)
   - `models.py` → Crear tabla/relación

2. **Crea el Repository**
   - `repositories/` → Queries SQL específicas

3. **Implementa el Service**
   - `services/` → Lógica de negocio

4. **Agrega la Route**
   - `routes/` → Endpoint HTTP

5. **Documenta**
   - Docstrings en cada función
   - Actualiza README si es necesario
