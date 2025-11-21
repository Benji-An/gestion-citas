"""
Script para actualizar contraseñas de profesionales existentes
"""

from database import SessionLocal
from models import User, TipoUsuario
from security import get_password_hash

def actualizar_contraseñas():
    db = SessionLocal()
    
    print("=== ACTUALIZANDO CONTRASEÑAS DE PROFESIONALES ===\n")
    
    # Lista de profesionales y sus nuevas contraseñas
    profesionales = [
        ("profesional@tiiwa.com", "prof123"),
        ("dra.martinez@tiiwa.com", "mart123"),
        ("dr.gomez@tiiwa.com", "gomez123")
    ]
    
    for email, password in profesionales:
        usuario = db.query(User).filter(User.email == email).first()
        if usuario:
            # Actualizar la contraseña
            usuario.hashed_password = get_password_hash(password)
            db.commit()
            print(f"✅ Contraseña actualizada: {usuario.nombre} ({email})")
        else:
            print(f"⚠️ No encontrado: {email}")
    
    print("\n✅ Contraseñas actualizadas exitosamente")
    print("\nCredenciales para iniciar sesión:")
    for email, password in profesionales:
        print(f"  Email: {email} | Password: {password}")
    
    db.close()

if __name__ == "__main__":
    actualizar_contraseñas()
