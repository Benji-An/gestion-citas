import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from database import SessionLocal
from models import User
from security import get_password_hash

db = SessionLocal()

try:
    # Verificar si existe un admin
    admin = db.query(User).filter(User.tipo_usuario == "admin").first()
    
    if admin:
        print(f"✅ Usuario admin existente:")
        print(f"   Email: {admin.email}")
        print(f"   Nombre: {admin.nombre} {admin.apellido}")
        print(f"   ID: {admin.id}")
        print(f"   Activo: {admin.is_active}")
    else:
        print("⚠️  No hay usuario admin. Creando uno...")
        
        # Crear usuario admin
        admin_user = User(
            email="admin@tiiwa.com",
            hashed_password=get_password_hash("admin123"),
            nombre="Admin",
            apellido="Sistema",
            telefono="3000000000",
            tipo_usuario="admin",
            is_active=True
        )
        
        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)
        
        print(f"✅ Usuario admin creado:")
        print(f"   Email: admin@tiiwa.com")
        print(f"   Password: admin123")
        print(f"   ID: {admin_user.id}")
        
    # Listar todos los usuarios
    print("\n📋 Todos los usuarios en el sistema:")
    usuarios = db.query(User).all()
    for user in usuarios:
        print(f"   - {user.nombre} {user.apellido} ({user.email}) - Tipo: {user.tipo_usuario}")
        
finally:
    db.close()
