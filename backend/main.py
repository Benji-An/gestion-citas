from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os

from routes import auth, profesionales, citas, pagos, perfil, notificaciones

app = FastAPI(
    title="Tiiwa - API de Gestión de Citas",
    description="API para el sistema de gestión de citas médicas",
    version="1.0.0"
)

# Obtener FRONTEND_URL de variable de entorno o usar localhost por defecto
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

# Configuración de CORS - DEBE estar ANTES de los routers
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        FRONTEND_URL,  # URL del frontend en producción (de variable de entorno)
        "mipropiedad.xyz",  # Reemplazar con tu dominio real
        "mipropiedad.xyz",
        "http://localhost:5173",  # Vite default (desarrollo)
        "http://localhost:5174",  # Vite alternativo
        "http://localhost:3000",  # React default
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],  # Permitir todos los métodos
    allow_headers=["*"],  # Permitir todos los headers
    expose_headers=["*"],
)

# Incluir routers
app.include_router(auth.router)
app.include_router(profesionales.router)
app.include_router(citas.router)
app.include_router(pagos.router)
app.include_router(perfil.router)
app.include_router(notificaciones.router)

@app.get("/")
def read_root():
    return {
        "message": "Bienvenido a la API de Tiiwa",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "ok"}

if __name__ == "__main__":
    # Para Railway: usar PORT de variable de entorno
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)