# 🔧 Solución de Problemas CORS y Errores Comunes

## ✅ CORS Solucionado

El error de CORS ha sido corregido. El backend ahora permite conexiones desde:
- `http://localhost:5173`
- `http://localhost:5174`
- `http://127.0.0.1:5173`
- `http://127.0.0.1:5174`

**El servidor backend se ha reiniciado con la nueva configuración.**

## 🚨 Si persiste el error

### 1. Verifica que los servidores estén corriendo:

**Backend** (debe estar en puerto 8000):
```bash
cd backend
python main.py
```
Deberías ver: `INFO: Uvicorn running on http://0.0.0.0:8000`

**Frontend** (puede estar en puerto 5173 o 5174):
```bash
cd frontend
npm run dev
```
Deberías ver: `Local: http://localhost:5174/`

### 2. Limpia el caché del navegador:
- Presiona `Ctrl + Shift + R` (Windows/Linux)
- O `Cmd + Shift + R` (Mac)
- O abre la consola (F12) y haz clic derecho en el botón de recargar → "Empty Cache and Hard Reload"

### 3. Verifica la conexión a la base de datos:
```bash
cd backend
python -c "from database import engine; print('✅ Base de datos conectada' if engine else '❌ Error de conexión')"
```

### 4. Si el error es 500 (Internal Server Error):

Revisa los logs del backend en la terminal donde ejecutaste `python main.py`. El error específico aparecerá allí.

Errores comunes:
- **"No module named 'paypalrestsdk'"** → Ejecuta: `pip install -r requirements.txt`
- **"PAYPAL_CLIENT_ID not found"** → Las credenciales de PayPal no están configuradas (esto es opcional si solo quieres probar sin PayPal)
- **"Connection refused"** → PostgreSQL no está corriendo

### 5. Probar sin PayPal temporalmente:

Si quieres probar el sistema sin configurar PayPal aún, puedes usar el método de pago con tarjeta (simulado).

Para deshabilitar PayPal temporalmente:

**Opción 1**: En `Pasarela_pago.jsx`, cambia la línea:
```javascript
const [paymentMethod, setPaymentMethod] = useState('paypal');
```
A:
```javascript
const [paymentMethod, setPaymentMethod] = useState('card');
```

**Opción 2**: Configura credenciales vacías en `.env`:
```env
PAYPAL_MODE=sandbox
PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
```

## 🔍 Diagnóstico Rápido

Ejecuta estos comandos para verificar todo:

```bash
# 1. ¿Está el backend respondiendo?
curl http://localhost:8000/health

# 2. ¿Está la base de datos conectada?
cd backend
python -c "from database import get_db; from sqlalchemy.orm import Session; print('✅ DB OK')"

# 3. ¿Están las dependencias instaladas?
cd backend
pip list | findstr paypal

# 4. ¿Puede crear una cita?
# (Necesitas un token válido de autenticación)
```

## 📝 Registro de Cambios Aplicados

1. ✅ Actualizado `main.py` con configuración de CORS más permisiva
2. ✅ Agregado soporte para puerto 5174 (cuando 5173 está ocupado)
3. ✅ Configurado `allow_methods` y `allow_headers` como `["*"]`
4. ✅ Servidor backend reiniciado con nueva configuración

## 🎯 Próximos Pasos

1. **Recarga la página del frontend** (Ctrl + Shift + R)
2. **Intenta reservar una cita de nuevo**
3. Si hay error, **copia el mensaje completo** de la consola del navegador (F12)
4. **Revisa la terminal del backend** para ver el error específico

## 💡 Tip

Si ves un error diferente ahora, es probable que sea un problema de datos (no de CORS). El mensaje de error del backend te dirá exactamente qué falta o qué está mal.

---

**El sistema debería funcionar ahora. Si persiste algún error, revisa los logs del backend para más detalles.**
