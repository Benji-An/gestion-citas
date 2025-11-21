from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from config import settings

# Crear el engine de SQLAlchemy
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,  # Verifica la conexión antes de usarla
    echo=False  # Cambiar a True para ver las queries SQL en consola
)

# Crear la sesión
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base para los modelos
Base = declarative_base()


def get_db():
    """
    Función para obtener una sesión de base de datos.
    Se usa como dependencia en FastAPI.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """
    Inicializa la base de datos creando todas las tablas.
    """
    import models  # Importar aquí para evitar dependencias circulares
    Base.metadata.create_all(bind=engine)
    print("✅ Base de datos inicializada correctamente")


def drop_db():
    """
    Elimina todas las tablas de la base de datos.
    ⚠️ Usar con cuidado!
    """
    import models
    Base.metadata.drop_all(bind=engine)
    print("⚠️ Todas las tablas han sido eliminadas")
