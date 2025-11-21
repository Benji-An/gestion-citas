# Tests y Scripts de Prueba

Esta carpeta contiene scripts de prueba, utilidades de testing y verificación del sistema.

## 📋 Scripts Disponibles

### Creación de Datos de Prueba

- **`create_test_users.py`** - Crea usuarios de prueba (clientes, profesionales, admin)
- **`create_test_profesionales.py`** - Crea perfiles de profesionales completos
- **`crear_notificaciones_prueba.py`** - Genera notificaciones de prueba

### Verificación y Testing

- **`verificar_db.py`** - Verifica la conexión y estructura de la base de datos
- **`verificar_notificaciones_usuario.py`** - Verifica notificaciones de un usuario
- **`verificar_tipos_notif.py`** - Verifica tipos de notificaciones disponibles

### Tests de Endpoints

- **`test_endpoint_final.py`** - Pruebas finales de endpoints
- **`test_endpoint_notificaciones.py`** - Pruebas de endpoints de notificaciones
- **`test_notificaciones.py`** - Tests del sistema de notificaciones

### Utilidades de Migración

- **`aplicar_migracion_foto_perfil.py`** - Aplica migración de fotos de perfil
- **`fix_notificaciones_tipos.py`** - Corrige tipos de notificaciones
- **`demo_notificaciones.py`** - Demo del sistema de notificaciones

## 🚀 Uso

### Crear Usuarios de Prueba

```powershell
cd backend
python -m tests.create_test_users
```

### Verificar Base de Datos

```powershell
python -m tests.verificar_db
```

### Ejecutar Tests de Endpoints

```powershell
python -m tests.test_endpoint_final
```

## ⚙️ Configuración

Asegúrate de tener:
1. El entorno virtual activado
2. Las variables de entorno configuradas (`.env`)
3. La base de datos inicializada

## 📝 Notas

- Estos scripts son para desarrollo y pruebas locales
- No ejecutar en producción
- Algunos scripts modifican datos en la base de datos
