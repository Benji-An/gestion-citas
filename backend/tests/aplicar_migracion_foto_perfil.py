"""
Script para aplicar la migración que agrega el campo foto_perfil a la tabla users
"""
from database import SessionLocal, engine
from sqlalchemy import text

def aplicar_migracion():
    db = SessionLocal()
    
    try:
        print("=" * 60)
        print("🔄 Aplicando migración: Agregar foto_perfil a users")
        print("=" * 60)
        print()
        
        # Verificar si la columna ya existe
        result = db.execute(text("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'users' AND column_name = 'foto_perfil'
        """))
        
        if result.fetchone():
            print("ℹ️  La columna foto_perfil ya existe en la tabla users")
        else:
            # Agregar la columna
            db.execute(text("ALTER TABLE users ADD COLUMN foto_perfil TEXT"))
            db.commit()
            print("✅ Columna foto_perfil agregada exitosamente")
        
        # Verificar que se agregó correctamente
        result = db.execute(text("""
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'users' AND column_name = 'foto_perfil'
        """))
        
        row = result.fetchone()
        if row:
            print()
            print("Verificación:")
            print(f"  - Columna: {row[0]}")
            print(f"  - Tipo: {row[1]}")
            print()
            print("=" * 60)
            print("✅ Migración completada exitosamente")
            print("=" * 60)
        
    except Exception as e:
        print(f"❌ Error durante la migración: {e}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    aplicar_migracion()
