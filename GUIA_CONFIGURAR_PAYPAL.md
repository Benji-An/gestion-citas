# 🎯 Guía Rápida: Configurar PayPal para el Sistema de Citas

## ⚡ Paso 1: Crear Cuenta de Desarrollador PayPal

1. Ve a: https://developer.paypal.com/
2. Haz clic en "Log in to Dashboard" (arriba a la derecha)
3. Si no tienes cuenta, haz clic en "Sign Up" y crea una
4. Si ya tienes cuenta de PayPal personal, puedes usarla para iniciar sesión

## 🔑 Paso 2: Crear una Aplicación Sandbox

1. Una vez dentro del dashboard, ve a la sección **"My Apps & Credentials"**
2. Asegúrate de estar en la pestaña **"Sandbox"** (no "Live")
3. Haz clic en el botón **"Create App"**
4. Completa el formulario:
   - **App Name**: "Sistema Gestion Citas" (o el nombre que prefieras)
   - **Sandbox Business Account**: Selecciona una cuenta o crea una nueva
5. Haz clic en **"Create App"**

## 📋 Paso 3: Obtener las Credenciales

Después de crear la app, verás una pantalla con:

```
Client ID
AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPp...

Secret
[Show]
```

1. **Copia el Client ID** (es visible directamente)
2. Haz clic en **"Show"** junto a "Secret"
3. **Copia el Secret** (aparecerá un código largo)

## ⚙️ Paso 4: Configurar las Variables de Entorno

1. Ve a la carpeta `backend` de tu proyecto
2. Crea un archivo llamado `.env` (si no existe)
3. Agrega estas líneas con tus credenciales:

```env
# PayPal Sandbox Configuration
PAYPAL_MODE=sandbox
PAYPAL_CLIENT_ID=pega_aqui_tu_client_id
PAYPAL_CLIENT_SECRET=pega_aqui_tu_secret
```

**Ejemplo real:**
```env
PAYPAL_MODE=sandbox
PAYPAL_CLIENT_ID=AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz
PAYPAL_CLIENT_SECRET=EEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ0A1B2C3D4
```

## 🧪 Paso 5: Crear Cuentas de Prueba (Para Testing)

1. En el Dashboard de PayPal Developer, ve a **"Sandbox" > "Accounts"**
2. Verás dos cuentas por defecto:
   - **Personal (Buyer)**: Para simular un cliente que paga
   - **Business (Seller)**: Para recibir pagos

3. Haz clic en "..." junto a la cuenta Personal y selecciona "View/Edit account"
4. Copia las credenciales:
   - Email: `sb-xxxxx@personal.example.com`
   - Password: `xxxxxxxx`

## 🚀 Paso 6: Probar el Sistema

1. **Inicia el backend:**
   ```bash
   cd backend
   python main.py
   ```

2. **Inicia el frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Realiza una prueba de pago:**
   - Inicia sesión en tu aplicación
   - Reserva una cita con un profesional
   - Selecciona "PayPal" como método de pago
   - Haz clic en "Continuar con PayPal"
   - Serás redirigido a PayPal Sandbox
   - **Usa las credenciales de la cuenta Personal (Buyer)** que copiaste
   - Completa el pago
   - Serás redirigido de vuelta con la confirmación

## ✅ Verificar que Funciona

### En la aplicación:
- ✅ Deberías ver "Pago Exitoso"
- ✅ La cita cambia a estado "confirmada"
- ✅ Recibes una notificación

### En PayPal Sandbox:
1. Ve a https://developer.paypal.com/
2. Ve a "Sandbox" > "Accounts"
3. Haz clic en la cuenta Business
4. Deberías ver la transacción recibida

## 🔧 Solución de Problemas Comunes

### Error: "Invalid credentials"
- ✅ Verifica que copiaste correctamente el Client ID y Secret
- ✅ Asegúrate de no tener espacios extras al inicio o final
- ✅ Verifica que estás usando credenciales de "Sandbox", no "Live"

### Error: "Connection refused"
- ✅ Verifica que el backend esté corriendo en http://localhost:8000
- ✅ Revisa que no haya errores en la consola del backend

### No me redirige a PayPal
- ✅ Abre la consola del navegador (F12) y busca errores
- ✅ Verifica que el token de autenticación esté presente
- ✅ Comprueba que las credenciales de PayPal estén configuradas

### El pago se aprueba pero no se confirma
- ✅ Revisa los logs del backend
- ✅ Verifica que el endpoint `/api/pagos/paypal/ejecutar-pago` esté funcionando
- ✅ Comprueba la conexión a la base de datos

## 🌟 URLs de Retorno

El sistema usa estas URLs para el flujo de PayPal:

- **URL de Éxito**: `http://localhost:5174/pago-completado?paymentId=XXX&PayerID=XXX&cita_id=X`
- **URL de Cancelación**: `http://localhost:5174/pago-cancelado?cita_id=X`

Si cambias el puerto del frontend, actualiza estas URLs en `backend/routes/pagos.py`:

```python
return_url = f"http://localhost:5174/pago-completado?cita_id={cita_id}"
cancel_url = f"http://localhost:5174/pago-cancelado?cita_id={cita_id}"
```

## 📱 Para Producción (Cuando esté listo)

1. **Obtén credenciales de producción:**
   - En PayPal Developer, ve a la pestaña "Live"
   - Crea una nueva app o usa una existente
   - Copia las credenciales de producción

2. **Actualiza las variables de entorno:**
   ```env
   PAYPAL_MODE=live
   PAYPAL_CLIENT_ID=tu_live_client_id
   PAYPAL_CLIENT_SECRET=tu_live_secret
   ```

3. **Actualiza las URLs de retorno:**
   - Cambia `localhost` por tu dominio real
   - Asegúrate de usar HTTPS

4. **Activa tu cuenta de PayPal Business:**
   - Completa la verificación de tu cuenta
   - Proporciona información bancaria para recibir pagos

## 📞 Recursos Adicionales

- **Documentación oficial**: https://developer.paypal.com/docs/
- **Sandbox testing**: https://developer.paypal.com/docs/api-basics/sandbox/
- **API Reference**: https://developer.paypal.com/api/rest/
- **Comunidad**: https://www.paypal-community.com/

---

**¡Listo! Ya tienes PayPal configurado y funcionando en tu sistema de citas 🎊**

Si tienes problemas, revisa los logs del backend o contacta al desarrollador.
