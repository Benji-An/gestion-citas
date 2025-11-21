# Utils - Utilidades y Helpers

Funciones auxiliares y configuraciones reutilizables.

## 📦 Módulos Disponibles

### `notificaciones.py`

Funciones para crear y enviar notificaciones a usuarios.

**Funciones:**
- `notificar_cita_creada()` - Notifica nueva cita a cliente y profesional
- `notificar_cita_cancelada()` - Notifica cancelación de cita
- `notificar_cita_reagendada()` - Notifica reagendamiento
- `notificar_pago_exitoso()` - Notifica pago exitoso
- `notificar_pago_fallido()` - Notifica fallo en el pago

**Ejemplo:**
```python
from utils.notificaciones import notificar_cita_creada

notificar_cita_creada(db, cita, cliente, profesional)
```

### `paypal_config.py`

Configuración y funciones para integración con PayPal.

**Funciones:**
- `crear_pago_paypal()` - Crea un pago en PayPal
- `ejecutar_pago_paypal()` - Ejecuta/completa un pago
- `obtener_pago_paypal()` - Obtiene estado de un pago

**Ejemplo:**
```python
from utils.paypal_config import crear_pago_paypal

resultado = crear_pago_paypal(
    monto=50000,
    descripcion="Pago de cita",
    return_url="http://...",
    cancel_url="http://..."
)
```

## 🎯 Cuándo usar Utils vs Services

- **Utils**: Funciones auxiliares, helpers, configuraciones
  - Envío de notificaciones
  - Configuraciones de APIs externas
  - Formateo de datos
  - Validaciones genéricas

- **Services**: Lógica de negocio compleja
  - Operaciones que involucran múltiples modelos
  - Cálculos de negocio
  - Orquestación de operaciones

## 📝 Convenciones

1. Funciones simples y reutilizables
2. No deben contener lógica de negocio compleja
3. Pueden ser usadas por servicios o rutas
4. Deben ser fáciles de testear
