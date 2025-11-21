"""
Script para crear usuarios de prueba en la base de datos.

Uso:
    python create_test_users.py
"""

import sys
from pathlib import Path

# Agregar el directorio backend al path
backend_dir = Path(__file__).resolve().parent
sys.path.insert(0, str(backend_dir))

from database import SessionLocal
from models import User, PerfilProfesional, TipoUsuario
from security import get_password_hash


def create_test_users():
    """Crea usuarios de prueba para desarrollo"""
    db = SessionLocal()
    
    try:
        print("=" * 60)
        print("👥 CREANDO USUARIOS DE PRUEBA")
        print("=" * 60)
        print()
        
        # Verificar si ya existen usuarios
        existing_users = db.query(User).count()
        if existing_users > 0:
            print(f"⚠️  Ya existen {existing_users} usuarios en la base de datos.")
            respuesta = input("¿Deseas continuar de todos modos? (s/N): ")
            if respuesta.lower() != 's':
                print("❌ Operación cancelada.")
                return
            print()
        
        # Usuario Admin
        admin = User(
            email="admin@tiiwa.com",
            hashed_password=get_password_hash("admin123"),
            nombre="Admin",
            apellido="Tiiwa",
            telefono="3001234567",
            tipo_usuario=TipoUsuario.ADMIN,
            is_active=True
        )
        db.add(admin)
        print("✅ Admin creado: admin@tiiwa.com / admin123")
        
        # Usuario Cliente 1
        cliente1 = User(
            email="cliente@tiiwa.com",
            hashed_password=get_password_hash("cliente123"),
            nombre="María",
            apellido="García",
            telefono="3009876543",
            tipo_usuario=TipoUsuario.CLIENTE,
            is_active=True
        )
        db.add(cliente1)
        print("✅ Cliente creado: cliente@tiiwa.com / cliente123")
        
        # Usuario Cliente 2
        cliente2 = User(
            email="juan.perez@gmail.com",
            hashed_password=get_password_hash("juan123"),
            nombre="Juan",
            apellido="Pérez",
            telefono="3101112233",
            tipo_usuario=TipoUsuario.CLIENTE,
            is_active=True
        )
        db.add(cliente2)
        print("✅ Cliente creado: juan.perez@gmail.com / juan123")
        
        # Commit para asegurar que los clientes estén creados
        db.commit()
        
        # Usuario Profesional 1
        profesional1 = User(
            email="profesional@tiiwa.com",
            hashed_password=get_password_hash("prof123"),
            nombre="Dr. Carlos",
            apellido="Rodríguez",
            telefono="3157894561",
            tipo_usuario=TipoUsuario.PROFESIONAL,
            is_active=True
        )
        db.add(profesional1)
        db.flush()  # Para obtener el ID
        
        # Crear perfil profesional
        perfil1 = PerfilProfesional(
            usuario_id=profesional1.id,
            especialidad="Psicología Clínica",
            descripcion="Especialista en terapia cognitivo-conductual con 10 años de experiencia.",
            experiencia_anos=10,
            precio_consulta=150000,
            direccion="Calle 100 #15-20",
            ciudad="Bogotá",
            calificacion_promedio=5,
            numero_resenas=0
        )
        db.add(perfil1)
        print("✅ Profesional creado: profesional@tiiwa.com / prof123")
        
        # Usuario Profesional 2
        profesional2 = User(
            email="dra.martinez@tiiwa.com",
            hashed_password=get_password_hash("ana123"),
            nombre="Dra. Ana",
            apellido="Martínez",
            telefono="3209998877",
            tipo_usuario=TipoUsuario.PROFESIONAL,
            is_active=True
        )
        db.add(profesional2)
        db.flush()
        
        # Crear perfil profesional
        perfil2 = PerfilProfesional(
            usuario_id=profesional2.id,
            especialidad="Psiquiatría",
            descripcion="Especialista en trastornos de ansiedad y depresión. Atención personalizada.",
            experiencia_anos=15,
            precio_consulta=200000,
            direccion="Carrera 7 #80-45",
            ciudad="Bogotá",
            calificacion_promedio=5,
            numero_resenas=0
        )
        db.add(perfil2)
        print("✅ Profesional creado: dra.martinez@tiiwa.com / ana123")
        
        # Usuario Profesional 3
        profesional3 = User(
            email="dr.gomez@tiiwa.com",
            hashed_password=get_password_hash("luis123"),
            nombre="Dr. Luis",
            apellido="Gómez",
            telefono="3187776655",
            tipo_usuario=TipoUsuario.PROFESIONAL,
            is_active=True
        )
        db.add(profesional3)
        db.flush()
        
        # Crear perfil profesional
        perfil3 = PerfilProfesional(
            usuario_id=profesional3.id,
            especialidad="Psicología Infantil",
            descripcion="Especialista en desarrollo infantil y adolescente. Terapia de juego.",
            experiencia_anos=8,
            precio_consulta=120000,
            direccion="Avenida 68 #45-30",
            ciudad="Bogotá",
            calificacion_promedio=4,
            numero_resenas=0
        )
        db.add(perfil3)
        print("✅ Profesional creado: dr.gomez@tiiwa.com / luis123")
        
        # Commit de todos los cambios
        db.commit()
        
        print()
        print("=" * 60)
        print("🎉 ¡USUARIOS DE PRUEBA CREADOS EXITOSAMENTE!")
        print("=" * 60)
        print()
        print("📋 Resumen de usuarios creados:")
        print()
        print("👨‍💼 ADMINISTRADOR:")
        print("   Email: admin@tiiwa.com")
        print("   Password: admin123")
        print()
        print("👥 CLIENTES:")
        print("   Email: cliente@tiiwa.com | Password: cliente123")
        print("   Email: juan.perez@gmail.com | Password: juan123")
        print()
        print("👨‍⚕️ PROFESIONALES:")
        print("   Email: profesional@tiiwa.com | Password: prof123")
        print("   Email: dra.martinez@tiiwa.com | Password: ana123")
        print("   Email: dr.gomez@tiiwa.com | Password: luis123")
        print()
        print("🚀 Puedes iniciar sesión con cualquiera de estos usuarios.")
        print()
        
    except Exception as e:
        db.rollback()
        print(f"\n❌ Error al crear usuarios: {str(e)}")
    finally:
        db.close()


if __name__ == "__main__":
    create_test_users()
