Backend en Python (Flask) — instrucciones rápidas

1) Crear entorno virtual e instalar dependencias (PowerShell):

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

2) Copia `.env.example` a `.env` y ajusta si es necesario.

3) Ejecutar la app:

```powershell
python app.py
```

La API quedará en http://localhost:5000

Endpoints principales:
- POST /auth/register          (JSON: name,email,password,role)
- POST /auth/login             (JSON: email,password) -> devuelve user + token
- GET  /auth/me                (Authorization: Bearer <token>) -> datos del usuario
- PUT  /auth/me                (Authorization: Bearer <token>) -> actualizar name/email/password
- POST /appointments/create    (JSON: user_id,professional_id,date_time,notes) or enviar Authorization: Bearer <token> para usar user autenticado
- GET  /appointments/list?user_id=...&professional_id=...

Notas:
- Asegúrate de que MySQL (XAMPP) esté corriendo y que la base `citas` exista con las tablas (usa `backend/schema.sql` del proyecto si lo necesitas).
- Los endpoints que requieren autenticación aceptan el token en el header `Authorization: Bearer <token>` o en el parámetro `?token=`.
- En producción considera usar waitress o gunicorn (Linux) y/o configurar un proxy inverso en Apache.
