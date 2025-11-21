import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    # Configuración de la base de datos
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql://postgres:postgres@localhost:5432/tiiwa_db"
    )
    
    # Configuración de seguridad JWT
    SECRET_KEY: str = os.getenv(
        "SECRET_KEY",
        "tu_clave_secreta_super_segura_cambiala_en_produccion_123456789"
    )
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
    
    # Configuración del proyecto
    PROJECT_NAME: str = "Tiiwa - API de Gestión de Citas"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # Configuración de PayPal
    # Para desarrollo, usa el sandbox de PayPal
    # Obtén tus credenciales en: https://developer.paypal.com/
    PAYPAL_MODE: str = os.getenv("PAYPAL_MODE", "sandbox")  # sandbox o live
    PAYPAL_CLIENT_ID: str = os.getenv("PAYPAL_CLIENT_ID", "")
    PAYPAL_CLIENT_SECRET: str = os.getenv("PAYPAL_CLIENT_SECRET", "")

settings = Settings()
