# Repositories - Capa de Acceso a Datos

Esta carpeta contiene los repositorios que encapsulan todas las operaciones SQL y consultas a la base de datos.

## 🎯 Propósito del Patrón Repository

El patrón Repository actúa como una capa de abstracción entre la lógica de negocio (servicios) y el acceso a datos (SQL/ORM). Sus beneficios:

- ✅ **Separación de responsabilidades**: SQL aislado de la lógica de negocio
- ✅ **Reutilización**: Queries complejas usables desde múltiples servicios
- ✅ **Testabilidad**: Fácil crear mocks de repositorios para tests
- ✅ **Mantenibilidad**: Cambios en queries centralizados
- ✅ **Legibilidad**: Código más limpio y expresivo

## 📁 Repositorios Disponibles

### `user_repository.py`
Operaciones CRUD de usuarios:
- `crear()` - Crear usuario
- `obtener_por_id()` - Buscar por ID
- `obtener_por_email()` - Buscar por email
- `obtener_todos()` - Listar con filtros
- `actualizar()` - Actualizar campos
- `actualizar_password()` - Cambiar contraseña
- `eliminar()` - Soft delete
- `buscar()` - Búsqueda por nombre/email
- `existe_email()` - Verificar email único

### `profesional_repository.py`
Gestión de perfiles profesionales:
- `crear_perfil()` - Crear perfil profesional
- `obtener_perfil()` - Obtener por user_id
- `obtener_perfil_con_usuario()` - Join con usuario
- `actualizar_perfil()` - Actualizar campos
- `buscar_profesionales()` - Búsqueda avanzada con filtros
- `obtener_especialidades_unicas()` - Lista de especialidades
- `actualizar_calificacion()` - Recalcular rating
- `obtener_mejores_calificados()` - Top profesionales

### `cita_repository.py`
Gestión de citas:
- `crear()` - Nueva cita
- `obtener_por_id()` - Buscar por ID
- `obtener_por_cliente()` - Citas de cliente con filtros
- `obtener_por_profesional()` - Citas de profesional
- `obtener_proximas()` - Próximas citas
- `obtener_del_dia()` - Agenda del día
- `verificar_conflicto()` - Detectar solapamientos
- `actualizar_estado()` - Cambiar estado
- `cancelar()` - Cancelar cita
- `contar_por_estado()` - Estadísticas
- `obtener_historial()` - Citas pasadas

### `pago_repository.py`
Gestión de pagos:
- `crear()` - Registrar pago
- `obtener_por_id()` - Buscar por ID
- `obtener_por_cita()` - Pago de una cita
- `obtener_por_transaccion()` - Buscar por transaction_id
- `obtener_por_cliente()` - Pagos de cliente
- `obtener_por_profesional()` - Pagos recibidos
- `actualizar_estado()` - Cambiar estado
- `calcular_ingresos_profesional()` - Sumar ingresos
- `calcular_gastos_cliente()` - Sumar gastos
- `verificar_pago_duplicado()` - Prevenir duplicados
- `obtener_ultimos()` - Últimas transacciones

### `disponibilidad_repository.py`
Horarios de disponibilidad:
- `crear()` - Nuevo bloque
- `obtener_por_profesional()` - Todos los horarios
- `obtener_por_dia()` - Horarios de un día
- `obtener_por_fecha()` - Disponibilidad específica
- `actualizar()` - Modificar bloque
- `eliminar()` - Borrar bloque
- `eliminar_por_profesional()` - Borrar todos
- `actualizar_masivo()` - Reemplazar todos los horarios
- `verificar_disponibilidad()` - Validar horario
- `tiene_disponibilidad()` - Verificar configuración

### `notificacion_repository.py`
Sistema de notificaciones:
- `crear()` - Nueva notificación
- `obtener_por_usuario()` - Listar notificaciones
- `obtener_por_tipo()` - Filtrar por tipo
- `marcar_como_leida()` - Una notificación
- `marcar_todas_como_leidas()` - Todas del usuario
- `eliminar()` - Borrar notificación
- `eliminar_antiguas()` - Limpieza automática
- `contar_no_leidas()` - Badge de contador
- `existe_similar()` - Prevenir duplicados

### `favorito_repository.py`
Profesionales favoritos:
- `agregar()` - Añadir a favoritos
- `eliminar()` - Quitar de favoritos
- `obtener_por_cliente()` - Lista completa con joins
- `obtener_ids_favoritos()` - Solo IDs
- `es_favorito()` - Verificar si está en favoritos
- `contar_favoritos()` - Total de favoritos
- `contar_clientes_favorito()` - Popularidad
- `obtener_mas_populares()` - Top profesionales

## 🏗️ Arquitectura en Capas

```
Routes (HTTP)
    ↓
Services (Lógica de Negocio)
    ↓
Repositories (Acceso a Datos)
    ↓
Models (ORM/Base de Datos)
```

## 📝 Ejemplo de Uso

### Antes (sin repositorios):
```python
# En el servicio - SQL mezclado con lógica
def buscar_profesionales(db, ciudad):
    query = db.query(User, PerfilProfesional).join(...)
    if ciudad:
        query = query.filter(User.ciudad.ilike(f"%{ciudad}%"))
    return query.all()
```

### Después (con repositorios):
```python
# En el servicio - código limpio
from repositories import ProfesionalRepository

def buscar_profesionales(db, ciudad):
    return ProfesionalRepository.buscar_profesionales(
        db,
        ciudad=ciudad
    )
```

## 🎨 Convenciones

1. **Nombres de métodos descriptivos**: `obtener_por_email()`, no `get()`
2. **Métodos estáticos**: Todos los métodos son `@staticmethod`
3. **Session como primer parámetro**: `def crear(db: Session, ...)`
4. **Retornar modelos o None**: No levantar excepciones en repositorios
5. **Type hints completos**: Parámetros y retornos tipados
6. **Filtros opcionales**: Usar `Optional[tipo]` para filtros
7. **Queries eficientes**: Usar joins, eager loading cuando sea necesario

## 🚀 Uso desde Servicios

```python
# services/profesional_service.py
from repositories import ProfesionalRepository, CitaRepository, DisponibilidadRepository

def obtener_estadisticas_profesional(db: Session, profesional_id: int):
    # Usar múltiples repositorios
    perfil = ProfesionalRepository.obtener_perfil(db, profesional_id)
    total_citas = CitaRepository.contar_total(db, profesional_id, es_profesional=True)
    tiene_horarios = DisponibilidadRepository.tiene_disponibilidad(db, profesional_id)
    
    return {
        "perfil": perfil,
        "total_citas": total_citas,
        "configurado": tiene_horarios
    }
```

## ✅ Beneficios Reales

### 1. Código más limpio
```python
# ❌ Antes
@router.get("/profesionales")
def listar(db: Session = Depends(get_db)):
    query = db.query(User, PerfilProfesional).join(...)
    # 20 líneas de SQL...
    return results

# ✅ Después
@router.get("/profesionales")
def listar(db: Session = Depends(get_db)):
    return ProfesionalRepository.obtener_todos_profesionales(db)
```

### 2. Reutilización
```python
# Mismo query usado en múltiples lugares
# routes/profesionales.py
profesionales = ProfesionalRepository.buscar_profesionales(db, ciudad="Bogotá")

# routes/buscar.py
resultados = ProfesionalRepository.buscar_profesionales(db, especialidad="Psicología")

# services/recomendaciones.py
recomendados = ProfesionalRepository.obtener_mejores_calificados(db, limit=5)
```

### 3. Testing más fácil
```python
# Mockear repositorio en tests
class MockProfesionalRepository:
    @staticmethod
    def obtener_perfil(db, user_id):
        return PerfilProfesional(user_id=1, especialidad="Test")

# Inyectar mock en tests
def test_servicio():
    resultado = servicio.obtener_datos(db)
    assert resultado is not None
```

## 🔜 Próximos Repositorios

- `resena_repository.py` - Gestión de reseñas y calificaciones
- `configuracion_repository.py` - Configuraciones de sistema
- `auditoria_repository.py` - Logs de auditoría
