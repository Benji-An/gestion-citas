# 🚀 Despliegue: Frontend (Hostinger) + Backend (Railway) + DB (Supabase)

## 📋 Resumen de la Arquitectura

- **Frontend (React)** → Hostinger (Archivos estáticos)
- **Backend (FastAPI)** → Railway (Servidor Python)
- **Base de Datos (PostgreSQL)** → Supabase (Gratis hasta 500MB)

---

## 🗄️ PASO 1: Configurar Base de Datos en Supabase

### 1.1 Crear cuenta y proyecto
1. Ir a https://supabase.com
2. Click en "Start your project"
3. Crear cuenta (GitHub recomendado)
4. Click en "New Project"
5. Configurar:
   - **Name:** gestion-citas
   - **Database Password:** (Genera uno seguro, guárdalo)
   - **Region:** South America (São Paulo)
   - **Plan:** Free
6. Click "Create new project" (tarda ~2 minutos)

### 1.2 Obtener credenciales
1. En el proyecto, ir a **Settings** (engranaje) → **Database**
2. Buscar sección **Connection string**
3. Modo: **URI**
4. Copiar la URL, se ve así:
```
postgresql://postgres.xyz:[YOUR-PASSWORD]@aws-0-sa-east-1.pooler.supabase.com:5432/postgres
```

5. Reemplazar `[YOUR-PASSWORD]` con la contraseña que creaste

### 1.3 Migrar los datos

#### Opción A: Desde tu PC (local)

```powershell
# En tu PC, conectarte a Supabase
cd backend
.\env\Scripts\Activate.ps1

# Instalar psycopg2
pip install psycopg2-binary

# Crear script temporal para migrar
```

Crea `backend/migrate_to_supabase.py`:
```python
import os
from sqlalchemy import create_engine, text
from models import Base, User, PerfilProfesional, Cita, Pago, Disponibilidad, Notificacion, Favorito
from database import SessionLocal, engine as local_engine
from security import get_password_hash

# URL de Supabase (reemplazar con la tuya)
SUPABASE_URL = "postgresql://postgres.xyz:TU_PASSWORD@aws-0-sa-east-1.pooler.supabase.com:5432/postgres"

def migrate():
    # Crear engine de Supabase
    supabase_engine = create_engine(SUPABASE_URL)
    
    # Crear todas las tablas
    print("🔨 Creando tablas en Supabase...")
    Base.metadata.create_all(bind=supabase_engine)
    print("✅ Tablas creadas")
    
    # Migrar datos si existen
    print("\n📦 Migrando datos...")
    local_db = SessionLocal()
    
    from sqlalchemy.orm import sessionmaker
    SupabaseSession = sessionmaker(bind=supabase_engine)
    supabase_db = SupabaseSession()
    
    try:
        # Migrar usuarios
        users = local_db.query(User).all()
        print(f"  Migrando {len(users)} usuarios...")
        for user in users:
            supabase_db.merge(user)
        supabase_db.commit()
        
        # Migrar perfiles profesionales
        perfiles = local_db.query(PerfilProfesional).all()
        print(f"  Migrando {len(perfiles)} perfiles profesionales...")
        for perfil in perfiles:
            supabase_db.merge(perfil)
        supabase_db.commit()
        
        # Migrar disponibilidades
        disponibilidades = local_db.query(Disponibilidad).all()
        print(f"  Migrando {len(disponibilidades)} horarios...")
        for disp in disponibilidades:
            supabase_db.merge(disp)
        supabase_db.commit()
        
        # Migrar citas
        citas = local_db.query(Cita).all()
        print(f"  Migrando {len(citas)} citas...")
        for cita in citas:
            supabase_db.merge(cita)
        supabase_db.commit()
        
        # Migrar pagos
        pagos = local_db.query(Pago).all()
        print(f"  Migrando {len(pagos)} pagos...")
        for pago in pagos:
            supabase_db.merge(pago)
        supabase_db.commit()
        
        # Migrar notificaciones
        notifs = local_db.query(Notificacion).all()
        print(f"  Migrando {len(notifs)} notificaciones...")
        for notif in notifs:
            supabase_db.merge(notif)
        supabase_db.commit()
        
        # Migrar favoritos
        favs = local_db.query(Favorito).all()
        print(f"  Migrando {len(favs)} favoritos...")
        for fav in favs:
            supabase_db.merge(fav)
        supabase_db.commit()
        
        print("\n✅ Migración completada exitosamente")
        
    except Exception as e:
        print(f"\n❌ Error en migración: {e}")
        supabase_db.rollback()
    finally:
        local_db.close()
        supabase_db.close()

if __name__ == "__main__":
    migrate()
```

Ejecutar:
```powershell
python migrate_to_supabase.py
```

#### Opción B: Crear solo las tablas
```powershell
# Editar database.py temporalmente
# Cambiar DATABASE_URL por la de Supabase
# Ejecutar init_db.py
python init_db.py
```

### 1.4 Verificar en Supabase
1. En Supabase, ir a **Table Editor**
2. Deberías ver todas tus tablas: users, perfil_profesional, citas, etc.

---

## 🐍 PASO 2: Desplegar Backend en Railway

### 2.1 Preparar el proyecto

#### Crear `backend/.env.example` (template):
```env
DATABASE_URL=postgresql://user:pass@host:5432/dbname
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

PAYPAL_MODE=sandbox
PAYPAL_CLIENT_ID=your-paypal-client-id
PAYPAL_CLIENT_SECRET=your-paypal-secret

FRONTEND_URL=https://tudominio.com
```

#### Crear `backend/Procfile`:
```
web: uvicorn main:app --host 0.0.0.0 --port $PORT
```

#### Crear `backend/runtime.txt`:
```
python-3.11.0
```

#### Actualizar `backend/main.py` para Railway:
```python
import os

# ... código existente ...

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)
```

#### Crear `backend/.gitignore` (si no existe):
```
env/
venv/
__pycache__/
*.pyc
.env
*.db
uploads/
.DS_Store
```

### 2.2 Subir código a GitHub

```powershell
# Si no tienes repo iniciado
git init
git add .
git commit -m "Preparar para despliegue en Railway"

# Crear repo en GitHub
# Ir a github.com → New repository → "gestion-citas"

# Conectar y subir
git remote add origin https://github.com/TU-USUARIO/gestion-citas.git
git branch -M main
git push -u origin main
```

### 2.3 Desplegar en Railway

1. Ir a https://railway.app
2. Click "Start a New Project"
3. Login con GitHub
4. Click "Deploy from GitHub repo"
5. Seleccionar tu repositorio `gestion-citas`
6. Railway detectará Python automáticamente
7. Click "Deploy Now"

### 2.4 Configurar Variables de Entorno

1. En Railway, click en tu proyecto
2. Ir a pestaña **Variables**
3. Agregar cada variable:

```
DATABASE_URL = postgresql://postgres.xyz:TU_PASSWORD@aws-0-sa-east-1.pooler.supabase.com:5432/postgres
SECRET_KEY = (genera con: openssl rand -hex 32)
ALGORITHM = HS256
ACCESS_TOKEN_EXPIRE_MINUTES = 30
PAYPAL_MODE = sandbox
PAYPAL_CLIENT_ID = tu_client_id
PAYPAL_CLIENT_SECRET = tu_client_secret
FRONTEND_URL = https://tudominio.com
```

Para generar SECRET_KEY en PowerShell:
```powershell
# Generar 32 bytes aleatorios en hex
-join ((48..57) + (97..102) | Get-Random -Count 64 | ForEach-Object {[char]$_})
```

### 2.5 Configurar Root Directory

1. En Railway, ir a **Settings**
2. Buscar "Root Directory"
3. Cambiar a: `backend`
4. Click "Update"

### 2.6 Obtener URL del Backend

1. En Railway, ir a **Settings**
2. Sección "Domains"
3. Click "Generate Domain"
4. Copiar la URL: `https://tu-app.railway.app`

**✅ Tu backend está listo en:** `https://tu-app.railway.app`

### 2.7 Verificar despliegue

1. Ir a **Deployments** en Railway
2. Ver logs en tiempo real
3. Esperar a que diga "Build successful"
4. Visitar: `https://tu-app.railway.app/docs`
5. Deberías ver la documentación de FastAPI

---

## ⚛️ PASO 3: Preparar Frontend para Hostinger

### 3.1 Configurar variables de entorno

#### Editar `frontend/.env.production`:
```env
VITE_API_URL=https://tu-app.railway.app
```

Reemplazar `tu-app.railway.app` con tu URL real de Railway.

### 3.2 Actualizar CORS en el backend

Esto es crítico. Ve a tu repositorio y edita `backend/main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://tudominio.com",  # Tu dominio en Hostinger
        "https://www.tudominio.com",
        "http://localhost:5173",  # Para desarrollo local
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)
```

Commit y push:
```powershell
git add backend/main.py
git commit -m "Actualizar CORS para Hostinger"
git push
```

Railway desplegará automáticamente los cambios.

### 3.3 Actualizar todas las referencias de API

Verificar que todos los archivos usen la variable de entorno:

```javascript
// Todos los archivos deben importar:
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
```

Archivos a verificar:
- `src/pages/Dashboard_admin.jsx`
- `src/pages/Admin_profesionales.jsx`
- `src/pages/Admin_pacientes.jsx`
- `src/pages/Admin_citas.jsx`
- Y cualquier otro que haga peticiones

### 3.4 Build de producción

```powershell
cd frontend
npm run build
```

Esto crea la carpeta `frontend/dist/` con todo optimizado.

### 3.5 Verificar el build

```powershell
# Ver contenido
ls dist

# Deberías ver:
# - index.html
# - assets/ (con archivos .js y .css)
```

---

## 🌐 PASO 4: Subir Frontend a Hostinger

### 4.1 Acceder a File Manager

1. Login en Hostinger: https://hpanel.hostinger.com
2. Click en tu hosting
3. Ir a **Files** → **File Manager**
4. Navegar a `public_html` (carpeta raíz del sitio)

### 4.2 Limpiar carpeta public_html

1. Seleccionar todo dentro de `public_html`
2. Click derecho → Delete
3. Confirmar

### 4.3 Subir archivos del build

#### Opción A: Desde File Manager (navegador)

1. Click en **Upload Files**
2. Seleccionar TODO dentro de `frontend/dist/`:
   - `index.html`
   - Carpeta `assets/`
3. Esperar a que suban todos los archivos

#### Opción B: Por FTP (más rápido)

1. Obtener credenciales FTP:
   - En hPanel → **Files** → **FTP Accounts**
   - Copiar: Host, Username, Password, Port

2. Abrir FileZilla (descarga de https://filezilla-project.org/)

3. Conectar:
   - **Host:** ftp.tudominio.com (o IP)
   - **Username:** tu_usuario
   - **Password:** tu_password
   - **Port:** 21

4. En el panel derecho, navegar a `public_html`

5. En el panel izquierdo, navegar a tu carpeta `frontend/dist/`

6. Arrastrar TODO el contenido de `dist/` a `public_html`

### 4.4 Configurar .htaccess para React Router

Crear/editar `public_html/.htaccess`:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>

# Cache para assets
<FilesMatch "\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$">
  Header set Cache-Control "max-age=31536000, public"
</FilesMatch>
```

### 4.5 Verificar estructura

Tu `public_html` debe verse así:
```
public_html/
├── index.html
├── .htaccess
└── assets/
    ├── index-abc123.js
    ├── index-xyz789.css
    └── (otros archivos)
```

---

## ✅ PASO 5: Verificación Final

### 5.1 Probar el sitio

1. Ir a tu dominio: `https://tudominio.com`
2. Debería cargar el frontend

### 5.2 Probar conexión con backend

1. Abrir DevTools (F12) → Console
2. Intentar login
3. Si hay error de CORS:
   - Verificar URL en `.env.production`
   - Verificar CORS en `backend/main.py`
   - Push cambios a GitHub
   - Railway redesplegará automáticamente

### 5.3 Checklist de verificación

- [ ] Frontend carga en tu dominio
- [ ] Backend responde en Railway URL
- [ ] Login funciona
- [ ] Registro funciona
- [ ] Dashboard carga datos
- [ ] Subir foto funciona (⚠️ ver nota abajo)
- [ ] Notificaciones funcionan
- [ ] Citas se crean correctamente

### ⚠️ Nota sobre subida de archivos

Railway tiene almacenamiento efímero. Los archivos subidos se borran cuando la app se redespliega. 

**Soluciones:**

1. **Railway Volumes** (Persistente, $)
2. **Cloudinary** (Recomendado, gratis hasta 25GB)
3. **AWS S3** ($)
4. **Supabase Storage** (Gratis 1GB)

---

## 📦 PASO 6: Configurar Cloudinary para Imágenes (Opcional pero Recomendado)

### 6.1 Crear cuenta

1. Ir a https://cloudinary.com
2. Sign up (gratis)
3. Verificar email

### 6.2 Obtener credenciales

1. Dashboard → **Product Environment Settings**
2. Copiar:
   - Cloud Name
   - API Key
   - API Secret

### 6.3 Instalar en backend

```powershell
cd backend
.\env\Scripts\Activate.ps1
pip install cloudinary
pip freeze > requirements.txt
```

### 6.4 Agregar a variables de Railway

En Railway, agregar:
```
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

### 6.5 Actualizar código de subida

Editar `backend/routes/perfil.py`:

```python
import cloudinary
import cloudinary.uploader

# Configurar Cloudinary
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)

@router.post("/upload-foto")
async def upload_foto(
    file: UploadFile = File(...),
    current_user = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    # Subir a Cloudinary
    result = cloudinary.uploader.upload(
        file.file,
        folder="gestion-citas/perfiles",
        public_id=f"user_{current_user.id}",
        overwrite=True
    )
    
    # Guardar URL en base de datos
    foto_url = result['secure_url']
    
    # ... resto del código
```

Push cambios:
```powershell
git add .
git commit -m "Integrar Cloudinary para imágenes"
git push
```

---

## 🔄 Actualización del Sitio

### Frontend (Hostinger)

```powershell
# Build nuevo
cd frontend
npm run build

# Subir por FTP o File Manager
# Reemplazar archivos en public_html
```

### Backend (Railway)

```powershell
# Hacer cambios
git add .
git commit -m "Actualización"
git push

# Railway redespliega automáticamente
```

### Base de Datos (Supabase)

Se actualiza automáticamente desde el backend.

---

## 🐛 Solución de Problemas

### Error: "Failed to fetch" en el frontend

**Causa:** CORS o URL incorrecta

**Solución:**
1. Verificar `.env.production`: `VITE_API_URL=https://tu-app.railway.app`
2. Rebuilder el frontend: `npm run build`
3. Re-subir a Hostinger
4. Verificar CORS en `backend/main.py`
5. Push a GitHub

### Error: "Internal Server Error" en Railway

**Causa:** Falta variable de entorno o error en código

**Solución:**
1. Ver logs en Railway → **Deployments** → Click en deploy → **View Logs**
2. Buscar el error específico
3. Verificar que todas las variables de entorno estén configuradas

### Frontend muestra página en blanco

**Causa:** Rutas de React Router

**Solución:**
1. Verificar que `.htaccess` está en `public_html`
2. Verificar contenido del `.htaccess` (arriba)

### Base de datos no conecta

**Causa:** URL incorrecta o firewall

**Solución:**
1. En Supabase → Settings → Database
2. Copiar **Connection string** URI
3. Reemplazar `[YOUR-PASSWORD]` con tu contraseña real
4. Actualizar en Railway variables

### Imágenes no se guardan

**Causa:** Railway tiene almacenamiento efímero

**Solución:**
- Implementar Cloudinary (ver PASO 6)

---

## 💰 Costos

- **Supabase:** Gratis hasta 500MB, 2GB bandwidth
- **Railway:** $5/mes crédito gratis, luego $0.000463/GB-hora (~$5-10/mes)
- **Hostinger:** Lo que ya pagas por el hosting
- **Cloudinary:** Gratis hasta 25GB storage, 25GB bandwidth

**Total estimado:** $0-15/mes dependiendo del tráfico

---

## 📚 URLs Importantes

### Desarrollo
- Frontend local: http://localhost:5173
- Backend local: http://localhost:8000
- Docs local: http://localhost:8000/docs

### Producción
- Frontend: https://tudominio.com
- Backend: https://tu-app.railway.app
- API Docs: https://tu-app.railway.app/docs
- Supabase Dashboard: https://app.supabase.com

---

## ✅ Checklist Final de Despliegue

### Supabase
- [ ] Proyecto creado
- [ ] Contraseña guardada
- [ ] URL de conexión copiada
- [ ] Tablas creadas
- [ ] Datos migrados (opcional)

### Railway
- [ ] Cuenta creada
- [ ] Repo conectado
- [ ] Variables de entorno configuradas
- [ ] Root directory = `backend`
- [ ] Domain generado
- [ ] Deploy exitoso (verde)
- [ ] `/docs` carga correctamente

### Hostinger
- [ ] public_html limpio
- [ ] Archivos de dist/ subidos
- [ ] .htaccess creado
- [ ] Sitio carga correctamente
- [ ] Login funciona
- [ ] API conecta

### Código
- [ ] .env.production configurado
- [ ] CORS actualizado en backend
- [ ] API_URL usa variable de entorno
- [ ] Build de producción creado
- [ ] Cambios pusheados a GitHub

---

**¡Tu aplicación está lista para producción!** 🎉

Si encuentras algún problema, revisa los logs:
- **Railway:** Deployments → View Logs
- **Frontend:** DevTools (F12) → Console
- **Supabase:** Logs → Query Performance
