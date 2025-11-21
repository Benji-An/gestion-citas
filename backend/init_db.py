"""
Script para inicializar la base de datos.
Ejecutar este script para crear todas las tablas en PostgreSQL.

Uso:
    python init_db.py
"""

import sys
from pathlib import Path

# Agregar el directorio backend al path
backend_dir = Path(__file__).resolve().parent
sys.path.insert(0, str(backend_dir))

from database import init_db, drop_db, engine
from models import User, PerfilProfesional, Cita, Pago, Disponibilidad, Favorito
from sqlalchemy import inspect


def check_tables():
    """Verifica qué tablas existen en la base de datos"""
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    return tables


def main():
    print("=" * 60)
    print("🚀 INICIALIZADOR DE BASE DE DATOS - TIIWA")
    print("=" * 60)
    print()
    
    # Verificar tablas existentes
    existing_tables = check_tables()
    
    if existing_tables:
        print(f"⚠️  Se encontraron {len(existing_tables)} tablas existentes:")
        for table in existing_tables:
            print(f"   - {table}")
        print()
        
        respuesta = input("¿Deseas eliminar las tablas existentes y crear nuevas? (s/N): ")
        if respuesta.lower() == 's':
            print("\n🗑️  Eliminando tablas existentes...")
            drop_db()
            print()
    
    # Crear las tablas
    print("📦 Creando tablas en la base de datos...")
    init_db()
    print()
    
    # Verificar tablas creadas
    new_tables = check_tables()
    print(f"✅ Se crearon {len(new_tables)} tablas:")
    for table in new_tables:
        print(f"   - {table}")
    print()
    
    print("=" * 60)
    print("🎉 ¡Base de datos lista para usar!")
    print("=" * 60)
    print()
    print("📝 Para crear usuarios de prueba, puedes:")
    print("   1. Usar el endpoint /api/auth/register en Swagger UI (http://localhost:8000/docs)")
    print("   2. Usar el frontend de la aplicación")
    print("   3. Ejecutar: python create_test_users.py")
    print()


if __name__ == "__main__":
    main()
