# Services - Capa de Lógica de Negocio

Esta carpeta contiene la lógica de negocio de la aplicación, separada de los endpoints HTTP.

## 🎯 Propósito

Los servicios encapsulan la lógica de negocio compleja y pueden ser reutilizados por diferentes endpoints o módulos. Esto mantiene el código más organizado y testeable.

## 📦 Servicios Disponibles

### `cliente_service.py`

Servicios relacionados con operaciones de clientes:

- `obtener_citas_cliente()` - Obtiene citas de un cliente con filtros
- `obtener_proximas_citas()` - Próximas citas del cliente
- `obtener_historial_citas()` - Historial de citas pasadas
- `obtener_pagos_cliente()` - Pagos del cliente con información enriquecida
- `obtener_estadisticas_cliente()` - Estadísticas completas del cliente
- `verificar_puede_agendar()` - Valida si puede agendar nuevas citas

**Ejemplo de uso:**

```python
from services.cliente_service import ClienteService

# Obtener próximas citas
proximas_citas = ClienteService.obtener_proximas_citas(db, cliente_id=1, limit=5)

# Obtener estadísticas
stats = ClienteService.obtener_estadisticas_cliente(db, cliente_id=1)
```

### `pago_service.py`

Servicios relacionados con procesamiento de pagos:

- `crear_pago_simulado()` - Crea un pago simulado para testing
- `ejecutar_pago_simulado()` - Completa un pago simulado
- `obtener_estadisticas_pagos()` - Estadísticas de pagos
- `verificar_pago_duplicado()` - Verifica pagos duplicados

**Ejemplo de uso:**

```python
from services.pago_service import PagoService

# Crear pago simulado
pago = PagoService.crear_pago_simulado(db, cita_id=1, monto=50000)

# Obtener estadísticas
stats = PagoService.obtener_estadisticas_pagos(db, cliente_id=1)
```

## 🏗️ Arquitectura

```
Routes (HTTP) → Services (Lógica) → Models (Base de Datos)
```

- **Routes**: Manejan requests HTTP, validación de entrada
- **Services**: Contienen la lógica de negocio
- **Models**: Interactúan con la base de datos

## 📝 Convenciones

1. Cada servicio es una clase con métodos estáticos
2. Los métodos reciben `db: Session` como primer parámetro
3. Retornan datos procesados o diccionarios, no objetos SQLAlchemy directamente
4. Manejan la lógica de negocio, no validación HTTP (eso es de las rutas)

### `profesional_service.py` ✅

Servicio completo para gestión de profesionales:

**Estadísticas y Métricas:**
- `obtener_estadisticas_profesional()` - Total citas, ingresos, estado de citas
- `obtener_citas_profesional()` - Listado con filtros de fecha y estado
- `obtener_proximas_citas()` - Próximas citas confirmadas
- `obtener_citas_del_dia()` - Agenda del día específico

**Gestión de Perfil:**
- `obtener_perfil_propio()` - Perfil completo del profesional autenticado
- `obtener_perfil_profesional_publico()` - Perfil público (respeta privacidad)
- `actualizar_perfil_profesional()` - Actualización completa de datos
- `buscar_profesionales()` - Búsqueda con filtros (especialidad, ciudad, precio)

**Disponibilidad y Horarios:**
- `obtener_disponibilidad_profesional()` - Horarios configurados
- `actualizar_horarios_disponibilidad()` - Actualización masiva de horarios
- `obtener_horarios_disponibles()` - Slots disponibles para un día
- `crear_disponibilidad()` - Crear bloque de disponibilidad
- `actualizar_disponibilidad()` - Modificar bloque existente
- `eliminar_disponibilidad()` - Eliminar bloque

**Favoritos:**
- `agregar_favorito()` - Añadir profesional a favoritos
- `eliminar_favorito()` - Quitar de favoritos
- `obtener_favoritos()` - Lista de favoritos del cliente

**Gestión de Citas:**
- `actualizar_estado_cita()` - Cambiar estado (pendiente, confirmada, completada)

**Ejemplo de uso:**

```python
from services import profesional_service

# Obtener perfil completo
perfil = profesional_service.obtener_perfil_propio(db, profesional_id=1)

# Actualizar perfil
perfil_actualizado = profesional_service.actualizar_perfil_profesional(
    db,
    user_id=1,
    especialidad="Psicología Clínica",
    anos_experiencia=5,
    precio_por_sesion=50000,
    biografia="Especialista en terapia cognitivo-conductual"
)

# Buscar profesionales
profesionales = profesional_service.buscar_profesionales(
    db,
    especialidad="Psicología",
    ciudad="Bogotá",
    precio_min=30000,
    precio_max=60000
)

# Actualizar horarios
resultado = profesional_service.actualizar_horarios_disponibilidad(
    db,
    profesional_id=1,
    horarios={
        "lunes": {"activo": True, "hora_inicio": "08:00", "hora_fin": "17:00"},
        "martes": {"activo": True, "hora_inicio": "08:00", "hora_fin": "17:00"},
        "miercoles": {"activo": False}
    }
)
```

## 🔜 Servicios Futuros

- `cita_service.py` - Lógica avanzada de citas (validaciones, conflictos)
- `notificacion_service.py` - Gestión centralizada de notificaciones
- `auth_service.py` - Lógica de autenticación y permisos
