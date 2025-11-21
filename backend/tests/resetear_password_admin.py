import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from database import SessionLocal
from models import User
from security import get_password_hash

db = SessionLocal()

try:
    admin = db.query(User).filter(User.email == "admin@tiiwa.com").first()
    
    if admin:
        # Actualizar contraseña a "admin123"
        nueva_password = "admin123"
        admin.hashed_password = get_password_hash(nueva_password)
        db.commit()
        
        print("✅ Contraseña del admin actualizada correctamente")
        print(f"\n📧 Email: admin@tiiwa.com")
        print(f"🔑 Contraseña: {nueva_password}")
        print(f"\n🌐 Inicia sesión con estas credenciales en http://localhost:5173")
        
    else:
        print("❌ No se encontró el usuario admin")
        
finally:
    db.close()
