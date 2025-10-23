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
- POST /auth/register
- POST /auth/login
- POST /appointments/create
- GET /appointments/list?user_id=...

Notas:
- Asegúrate de que MySQL (XAMPP) esté corriendo y que la base `citas` exista con las tablas (usa `backend/db/schema.sql` del proyecto si lo necesitas).
- En producción considera usar waitress o gunicorn (Linux) y/o configurar un proxy inverso en Apache.
