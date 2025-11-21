# 🚀 Guía de Despliegue en Hostinger

## 📋 Índice
1. [Requisitos Previos](#requisitos-previos)
2. [Preparar el Backend (FastAPI)](#preparar-el-backend-fastapi)
3. [Preparar el Frontend (React)](#preparar-el-frontend-react)
4. [Configurar Base de Datos](#configurar-base-de-datos)
5. [Desplegar en Hostinger](#desplegar-en-hostinger)
6. [Configuración de Dominio](#configuración-de-dominio)
7. [Variables de Entorno](#variables-de-entorno)
8. [Solución de Problemas](#solución-de-problemas)

---

## ✅ Requisitos Previos

### Lo que necesitas:
- [ ] Cuenta en Hostinger (plan VPS o Business)
- [ ] Dominio (puede ser el incluido con Hostinger)
- [ ] Acceso SSH a tu servidor
- [ ] Cliente FTP/SFTP (FileZilla, WinSCP, o similar)
- [ ] Git instalado localmente

### Planes de Hostinger recomendados:
- **VPS** (Recomendado) - Permite instalar Python, Node.js, PostgreSQL
- **Business/Cloud** - Con soporte para aplicaciones Node.js
- ⚠️ **Shared Hosting básico** - No es suficiente (no soporta Python/FastAPI)

---

## 🐍 Preparar el Backend (FastAPI)

### 1. Crear archivo de requisitos actualizado

```powershell
cd backend
.\env\Scripts\Activate.ps1
pip freeze > requirements.txt
```

### 2. Crear archivo `.env` para producción

Crea `backend/.env`:
```env
# Base de datos
DATABASE_URL=postgresql://usuario:password@localhost:5432/nombre_db

# JWT
SECRET_KEY=tu_clave_secreta_super_segura_aqui_genera_una_nueva
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# PayPal (Producción o Sandbox)
PAYPAL_MODE=live
PAYPAL_CLIENT_ID=tu_client_id_produccion
PAYPAL_CLIENT_SECRET=tu_client_secret_produccion

# CORS (tu dominio)
FRONTEND_URL=https://tudominio.com

# Servidor
HOST=0.0.0.0
PORT=8000
```

### 3. Actualizar `config.py` para usar variables de entorno

Edita `backend/config.py`:
```python
import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    DATABASE_URL: str = os.getenv("DATABASE_URL")
    SECRET_KEY: str = os.getenv("SECRET_KEY")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))
    
    # PayPal
    PAYPAL_MODE: str = os.getenv("PAYPAL_MODE", "sandbox")
    PAYPAL_CLIENT_ID: str = os.getenv("PAYPAL_CLIENT_ID")
    PAYPAL_CLIENT_SECRET: str = os.getenv("PAYPAL_CLIENT_SECRET")
    
    # CORS
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:5173")
    
    # Server
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", 8000))

settings = Settings()
```

### 4. Actualizar `main.py` para CORS dinámico

```python
from config import settings

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.FRONTEND_URL,
        "http://localhost:5173",  # Para desarrollo
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)
```

### 5. Crear `Procfile` o script de inicio

Crea `backend/start.sh`:
```bash
#!/bin/bash
source env/bin/activate
uvicorn main:app --host 0.0.0.0 --port 8000
```

Dale permisos:
```bash
chmod +x start.sh
```

### 6. Instalar python-dotenv

```powershell
pip install python-dotenv
pip freeze > requirements.txt
```

---

## ⚛️ Preparar el Frontend (React)

### 1. Actualizar `api.js` para usar variable de entorno

Edita `frontend/src/api.js`:
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default API_URL;
```

### 2. Crear archivo `.env` para producción

Crea `frontend/.env.production`:
```env
VITE_API_URL=https://api.tudominio.com
```

Y `frontend/.env.development`:
```env
VITE_API_URL=http://localhost:8000
```

### 3. Actualizar todas las referencias de API

Busca y reemplaza en todos los archivos:
```javascript
// Antes:
const API_URL = 'http://localhost:8000';

// Después:
import API_URL from '../api.js';
```

### 4. Build de producción

```powershell
cd frontend
npm run build
```

Esto genera la carpeta `dist/` con los archivos estáticos.

---

## 🗄️ Configurar Base de Datos

### Opción 1: PostgreSQL en Hostinger VPS

#### 1. Conectar por SSH
```bash
ssh usuario@tu-servidor.hostinger.com
```

#### 2. Instalar PostgreSQL
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

#### 3. Configurar PostgreSQL
```bash
sudo -u postgres psql

# Dentro de PostgreSQL:
CREATE DATABASE gestion_citas;
CREATE USER tu_usuario WITH PASSWORD 'tu_password_seguro';
GRANT ALL PRIVILEGES ON DATABASE gestion_citas TO tu_usuario;
\q
```

#### 4. Permitir conexiones remotas (si es necesario)
```bash
sudo nano /etc/postgresql/14/main/postgresql.conf
# Cambiar: listen_addresses = 'localhost' por listen_addresses = '*'

sudo nano /etc/postgresql/14/main/pg_hba.conf
# Agregar: host all all 0.0.0.0/0 md5

sudo systemctl restart postgresql
```

### Opción 2: Base de Datos Externa (Recomendado)

Usar servicios como:
- **ElephantSQL** (PostgreSQL gratuito/pago)
- **Supabase** (PostgreSQL gratuito)
- **Railway** (PostgreSQL gratuito/pago)
- **Render** (PostgreSQL gratuito/pago)

#### Ejemplo con ElephantSQL:
1. Ir a https://www.elephantsql.com/
2. Crear cuenta gratuita
3. Crear nueva instancia
4. Copiar la URL de conexión: `postgresql://usuario:pass@servidor/db`
5. Usar esta URL en tu `.env`

---

## 🚀 Desplegar en Hostinger

### Método 1: VPS con SSH (Recomendado)

#### 1. Conectar por SSH
```bash
ssh root@tu-vps.hostinger.com
```

#### 2. Instalar dependencias
```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Python 3.11+
sudo apt install python3.11 python3.11-venv python3-pip -y

# Instalar Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install nodejs -y

# Instalar Nginx
sudo apt install nginx -y

# Instalar PostgreSQL (si usas local)
sudo apt install postgresql postgresql-contrib -y
```

#### 3. Clonar el repositorio
```bash
cd /var/www
git clone https://github.com/Benji-An/gestion-citas.git
cd gestion-citas
```

#### 4. Configurar Backend
```bash
cd backend

# Crear entorno virtual
python3.11 -m venv env
source env/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Crear archivo .env (copiar el template)
nano .env
# Pega tu configuración de producción

# Crear carpeta uploads
mkdir -p uploads/perfil
chmod 755 uploads

# Inicializar base de datos
python init_db.py
```

#### 5. Configurar Frontend
```bash
cd ../frontend

# Instalar dependencias
npm install

# Crear .env.production
nano .env.production
# VITE_API_URL=https://api.tudominio.com

# Build
npm run build
```

#### 6. Configurar Nginx

Crea `/etc/nginx/sites-available/gestion-citas`:
```nginx
# Backend (API)
server {
    listen 80;
    server_name api.tudominio.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Para archivos estáticos (uploads)
    location /uploads/ {
        alias /var/www/gestion-citas/backend/uploads/;
    }
}

# Frontend
server {
    listen 80;
    server_name tudominio.com www.tudominio.com;

    root /var/www/gestion-citas/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache para assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Activar el sitio:
```bash
sudo ln -s /etc/nginx/sites-available/gestion-citas /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 7. Crear servicio systemd para FastAPI

Crea `/etc/systemd/system/gestion-citas-api.service`:
```ini
[Unit]
Description=Gestion Citas API
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/gestion-citas/backend
Environment="PATH=/var/www/gestion-citas/backend/env/bin"
ExecStart=/var/www/gestion-citas/backend/env/bin/uvicorn main:app --host 0.0.0.0 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
```

Iniciar el servicio:
```bash
sudo systemctl daemon-reload
sudo systemctl start gestion-citas-api
sudo systemctl enable gestion-citas-api
sudo systemctl status gestion-citas-api
```

#### 8. Configurar SSL con Let's Encrypt
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d tudominio.com -d www.tudominio.com -d api.tudominio.com
```

---

### Método 2: Panel de Control de Hostinger (hPanel)

Si tu plan no tiene SSH, pero soporta Node.js:

#### 1. Build local
```powershell
# Frontend
cd frontend
npm run build

# Comprimir dist
Compress-Archive -Path dist\* -DestinationPath frontend-build.zip
```

#### 2. Subir por FTP
1. Conectar con FileZilla a tu servidor Hostinger
2. Ir a `public_html`
3. Subir el contenido de `frontend/dist`

#### 3. Backend (requiere soporte Python)
⚠️ Hostinger shared hosting NO soporta FastAPI
- Necesitas VPS o migrar backend a otro servicio

---

## 🌐 Configuración de Dominio

### Opción A: Dominio en Hostinger

1. Panel de Hostinger → Dominios
2. Seleccionar tu dominio
3. Configurar DNS:
```
Tipo    Nombre      Valor
A       @           IP_de_tu_VPS
A       www         IP_de_tu_VPS
A       api         IP_de_tu_VPS
```

### Opción B: Dominio externo

En tu proveedor de dominios, apuntar:
```
A       @           IP_del_VPS_Hostinger
A       www         IP_del_VPS_Hostinger
A       api         IP_del_VPS_Hostinger
```

---

## 🔐 Variables de Entorno en Producción

### Backend `.env`
```env
# ⚠️ NUNCA subir este archivo a Git
DATABASE_URL=postgresql://user:pass@host:5432/dbname
SECRET_KEY=genera_una_clave_con_openssl_rand_hex_32
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

PAYPAL_MODE=live
PAYPAL_CLIENT_ID=tu_client_id_real
PAYPAL_CLIENT_SECRET=tu_client_secret_real

FRONTEND_URL=https://tudominio.com
HOST=0.0.0.0
PORT=8000
```

### Generar SECRET_KEY seguro:
```bash
openssl rand -hex 32
```

### Frontend `.env.production`
```env
VITE_API_URL=https://api.tudominio.com
```

---

## 📦 Estructura de Archivos en Servidor

```
/var/www/gestion-citas/
├── backend/
│   ├── env/                    # Entorno virtual
│   ├── uploads/               # Archivos subidos
│   │   └── perfil/
│   ├── .env                   # ⚠️ NO en Git
│   ├── main.py
│   ├── requirements.txt
│   └── ...
├── frontend/
│   ├── dist/                  # Build de producción
│   │   ├── index.html
│   │   ├── assets/
│   │   └── ...
│   └── ...
└── .git/
```

---

## 🔄 Actualización (CI/CD Manual)

### Script de actualización

Crea `deploy.sh` en el servidor:
```bash
#!/bin/bash
cd /var/www/gestion-citas

# Pull cambios
git pull origin main

# Actualizar backend
cd backend
source env/bin/activate
pip install -r requirements.txt
sudo systemctl restart gestion-citas-api

# Actualizar frontend
cd ../frontend
npm install
npm run build

# Reiniciar Nginx
sudo systemctl restart nginx

echo "✅ Despliegue completado"
```

Ejecutar:
```bash
chmod +x deploy.sh
./deploy.sh
```

---

## 🐛 Solución de Problemas

### 1. Error 502 Bad Gateway
```bash
# Verificar que FastAPI está corriendo
sudo systemctl status gestion-citas-api

# Ver logs
sudo journalctl -u gestion-citas-api -n 50

# Reiniciar servicio
sudo systemctl restart gestion-citas-api
```

### 2. Error de CORS
Verificar en `backend/main.py`:
```python
allow_origins=[
    "https://tudominio.com",
    "https://www.tudominio.com",
]
```

### 3. Base de datos no conecta
```bash
# Verificar PostgreSQL
sudo systemctl status postgresql

# Probar conexión
psql -U usuario -d gestion_citas -h localhost
```

### 4. Frontend muestra página en blanco
```bash
# Verificar que index.html existe
ls /var/www/gestion-citas/frontend/dist/

# Verificar permisos
sudo chown -R www-data:www-data /var/www/gestion-citas/frontend/dist
sudo chmod -R 755 /var/www/gestion-citas/frontend/dist

# Ver logs Nginx
sudo tail -f /var/log/nginx/error.log
```

### 5. Archivos de perfil no se suben
```bash
# Verificar permisos carpeta uploads
sudo chown -R www-data:www-data /var/www/gestion-citas/backend/uploads
sudo chmod -R 755 /var/www/gestion-citas/backend/uploads
```

---

## 📊 Monitoreo

### Ver logs en tiempo real
```bash
# Backend
sudo journalctl -u gestion-citas-api -f

# Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# PostgreSQL
sudo tail -f /var/log/postgresql/postgresql-14-main.log
```

### Verificar uso de recursos
```bash
# CPU y RAM
htop

# Disco
df -h

# Servicios activos
sudo systemctl status gestion-citas-api
sudo systemctl status nginx
sudo systemctl status postgresql
```

---

## 🔒 Seguridad

### 1. Firewall
```bash
sudo ufw allow 22/tcp      # SSH
sudo ufw allow 80/tcp      # HTTP
sudo ufw allow 443/tcp     # HTTPS
sudo ufw enable
```

### 2. Actualizar regularmente
```bash
sudo apt update && sudo apt upgrade -y
```

### 3. Backup de base de datos
```bash
# Crear backup
pg_dump -U usuario gestion_citas > backup_$(date +%Y%m%d).sql

# Restaurar
psql -U usuario gestion_citas < backup_20250121.sql
```

Script de backup automático:
```bash
#!/bin/bash
# /root/backup-db.sh
pg_dump -U usuario gestion_citas | gzip > /backups/db_$(date +%Y%m%d_%H%M%S).sql.gz

# Borrar backups de más de 30 días
find /backups -name "db_*.sql.gz" -mtime +30 -delete
```

Agregar a crontab:
```bash
crontab -e
# Backup diario a las 2 AM
0 2 * * * /root/backup-db.sh
```

---

## 🎯 Checklist de Despliegue

### Pre-despliegue
- [ ] Build de frontend funciona localmente
- [ ] Backend funciona con variables de entorno
- [ ] Base de datos configurada
- [ ] Credenciales PayPal de producción
- [ ] Dominio configurado

### Durante despliegue
- [ ] Servidor configurado (Python, Node, Nginx, PostgreSQL)
- [ ] Repositorio clonado
- [ ] Backend instalado y corriendo
- [ ] Frontend buildeado y servido
- [ ] Nginx configurado
- [ ] SSL instalado

### Post-despliegue
- [ ] Sitio accesible desde dominio
- [ ] API responde en api.tudominio.com
- [ ] Login funciona
- [ ] Registro funciona
- [ ] Subida de archivos funciona
- [ ] Notificaciones funcionan
- [ ] PayPal funciona

---

## 🌟 Alternativas a Hostinger VPS

Si Hostinger no funciona, considera:

### Backend:
- **Railway** - Fácil, gratis tier, soporta Python
- **Render** - Gratis tier, PostgreSQL incluido
- **Fly.io** - Gratis tier generoso
- **PythonAnywhere** - Especializado en Python
- **Heroku** - Clásico, tiene free tier limitado

### Frontend:
- **Vercel** - Perfecto para React, gratis
- **Netlify** - Similar a Vercel
- **Cloudflare Pages** - Rápido y gratis
- **GitHub Pages** - Gratis, pero solo estático

### Base de Datos:
- **Supabase** - PostgreSQL gratis hasta 500MB
- **ElephantSQL** - PostgreSQL gratis 20MB
- **Railway** - PostgreSQL incluido
- **Render** - PostgreSQL gratis

---

## 📚 Recursos Adicionales

- [Documentación Hostinger VPS](https://support.hostinger.com/es/collections/1742814-vps)
- [Documentación FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)
- [Documentación Vite Build](https://vitejs.dev/guide/build.html)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt](https://letsencrypt.org/)

---

**¿Necesitas ayuda?** Revisa la sección de solución de problemas o contacta con soporte de Hostinger.

¡Buena suerte con el despliegue! 🚀
