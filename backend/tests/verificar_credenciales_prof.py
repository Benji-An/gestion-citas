"""
Script para verificar credenciales de profesionales
"""

from database import SessionLocal
from models import User
from security import verify_password

def verificar_profesionales():
    db = SessionLocal()
    
    profesionales = db.query(User).filter(User.tipo_usuario == 'profesional').all()
    
    print("=== VERIFICACIÓN DE CREDENCIALES PROFESIONALES ===\n")
    
    for prof in profesionales:
        print(f"Email: {prof.email}")
        print(f"Nombre: {prof.nombre} {prof.apellido}")
        print(f"Tipo: {prof.tipo_usuario}")
        print(f"Activo: {prof.is_active}")
        
        # Intentar con contraseñas comunes del readme
        contraseñas_prueba = [
            'profesional123',
            'martinez123',
            'gomez123'
        ]
        
        for pwd in contraseñas_prueba:
            if verify_password(pwd, prof.hashed_password):
                print(f"✅ Password correcta: {pwd}")
                break
        else:
            print("❌ Ninguna password de prueba funcionó")
        
        print("-" * 50)
    
    db.close()

if __name__ == "__main__":
    verificar_profesionales()
