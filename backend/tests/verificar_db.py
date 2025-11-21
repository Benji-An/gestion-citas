"""
Script para verificar el estado de la base de datos
"""

import sys
from pathlib import Path

# Agregar el directorio backend al path
backend_dir = Path(__file__).resolve().parent
sys.path.insert(0, str(backend_dir))

from database import engine
from sqlalchemy import inspect, text


def verificar_base_datos():
    """Verifica el estado de la base de datos"""
    print("=" * 60)
    print("🔍 VERIFICANDO BASE DE DATOS")
    print("=" * 60)
    print()
    
    try:
        # Probar conexión
        with engine.connect() as conn:
            result = conn.execute(text("SELECT version();"))
            version = result.fetchone()[0]
            print(f"✅ Conexión exitosa a PostgreSQL")
            print(f"📌 Versión: {version[:50]}...")
            print()
        
        # Verificar tablas existentes
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        
        if not tables:
            print("❌ NO SE ENCONTRARON TABLAS EN LA BASE DE DATOS")
            print()
            print("🔧 Solución:")
            print("   1. Ejecuta: python init_db.py")
            print("   2. O verifica la configuración de DATABASE_URL en .env")
            print()
        else:
            print(f"✅ Se encontraron {len(tables)} tablas:")
            print()
            
            # Mostrar información detallada de cada tabla
            for table_name in sorted(tables):
                columns = inspector.get_columns(table_name)
                pk = inspector.get_pk_constraint(table_name)
                fks = inspector.get_foreign_keys(table_name)
                
                print(f"📋 Tabla: {table_name}")
                print(f"   Columnas: {len(columns)}")
                print(f"   Clave primaria: {pk['constrained_columns']}")
                if fks:
                    print(f"   Claves foráneas: {len(fks)}")
                
                # Contar registros
                with engine.connect() as conn:
                    result = conn.execute(text(f"SELECT COUNT(*) FROM {table_name}"))
                    count = result.fetchone()[0]
                    print(f"   Registros: {count}")
                print()
            
            print("=" * 60)
            print("✅ BASE DE DATOS VERIFICADA CORRECTAMENTE")
            print("=" * 60)
            
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        print()
        print("🔧 Posibles soluciones:")
        print("   1. Verifica que PostgreSQL esté ejecutándose")
        print("   2. Verifica DATABASE_URL en el archivo .env")
        print("   3. Verifica que la base de datos 'tiiwa_db' exista")
        print()
        print("Para crear la base de datos, ejecuta en psql:")
        print("   CREATE DATABASE tiiwa_db;")
        print()


if __name__ == "__main__":
    verificar_base_datos()
