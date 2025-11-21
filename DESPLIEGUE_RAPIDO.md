# 🚀 Despliegue Rápido - Comandos Esenciales

## 📦 1. Supabase (Base de Datos)

### Crear proyecto:
1. https://supabase.com → Sign up
2. New Project → "gestion-citas"
3. Copiar Connection String (URI)

### Migrar datos:
```powershell
cd backend
.\env\Scripts\Activate.ps1

# Editar migrate_to_supabase.py con tu URL
python migrate_to_supabase.py
```

**✅ Listo:** Base de datos en la nube

---

## 🐍 2. Railway (Backend)

### Preparar:
```powershell
# Ya creados:
# - backend/Procfile
# - backend/runtime.txt
# - backend/.env.example

# Subir a GitHub
git add .
git commit -m "Preparar para Railway"
git push origin main
```

### Desplegar:
1. https://railway.app → Login con GitHub
2. New Project → Deploy from GitHub
3. Seleccionar `gestion-citas`
4. Settings → Root Directory: `backend`
5. Variables → Agregar:
   ```
   DATABASE_URL=tu_url_de_supabase
   SECRET_KEY=genera_con_openssl_rand_hex_32
   FRONTEND_URL=https://tudominio.com
   PAYPAL_CLIENT_ID=tu_id
   PAYPAL_CLIENT_SECRET=tu_secret
   ```
6. Generate Domain → Copiar URL

**✅ Listo:** https://tu-app.railway.app

---

## ⚛️ 3. Hostinger (Frontend)

### Build:
```powershell
cd frontend

# Editar .env.production con URL de Railway
# VITE_API_URL=https://tu-app.railway.app

npm run build
```

### Subir:
1. hPanel → File Manager
2. `public_html` → Borrar todo
3. Upload → Subir todo de `frontend/dist/`
4. Crear `.htaccess` (contenido en el archivo)

**✅ Listo:** https://tudominio.com

---

## 🔧 Actualizar CORS

En `backend/main.py`, línea 19, cambiar:
```python
"https://tudominio.com",  # Tu dominio real de Hostinger
"https://www.tudominio.com",
```

Luego:
```powershell
git add backend/main.py
git commit -m "Actualizar CORS"
git push
```

Railway redesplegará automáticamente.

---

## ✅ Verificar

1. **Backend:** https://tu-app.railway.app/docs
2. **Frontend:** https://tudominio.com
3. **Login:** Debería funcionar sin errores CORS

---

## 🐛 Problemas?

### CORS Error:
- Verificar FRONTEND_URL en Railway
- Verificar dominio en backend/main.py
- Push cambios

### Base de datos no conecta:
- Verificar DATABASE_URL en Railway
- Debe incluir tu contraseña real de Supabase

### Frontend en blanco:
- Verificar .htaccess en public_html
- Ver Console (F12) para errores

---

## 📚 Documentación Completa

Ver: `DESPLIEGUE_HOSTINGER_RAILWAY_SUPABASE.md`
