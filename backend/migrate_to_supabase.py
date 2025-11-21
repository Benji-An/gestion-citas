import os
import sys
from sqlalchemy import create_engine, text
from models import Base, User, PerfilProfesional, Cita, Pago, Disponibilidad, Notificacion, Favorito
from database import SessionLocal, engine as local_engine
from security import get_password_hash

# ⚠️ REEMPLAZAR CON TU URL DE SUPABASE
# Formato correcto: postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
# O el formato directo: postgresql://postgres.[PROJECT-REF]:[PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres
SUPABASE_URL = "postgresql://postgres.gjajwruxvvcklamkvdxs:benjamin1082862152@aws-1-sa-east-1.pooler.supabase.com:6543/postgres"

def test_connection(url):
    """Probar conexión a Supabase"""
    try:
        print("🔍 Probando conexión...")
        engine = create_engine(url)
        with engine.connect() as conn:
            result = conn.execute(text("SELECT version();"))
            version = result.fetchone()[0]
            print(f"✅ Conexión exitosa!")
            print(f"   PostgreSQL: {version[:50]}...")
            return True
    except Exception as e:
        print(f"❌ Error de conexión: {str(e)}")
        print("\n🔧 Soluciones posibles:")
        print("1. Verifica que la URL sea correcta (ve a Supabase → Settings → Database)")
        print("2. Copia la 'Connection string' en modo 'URI'")
        print("3. Asegúrate de reemplazar [YOUR-PASSWORD] con tu contraseña real")
        print("4. Si usas Connection Pooling, el puerto debe ser 6543")
        print("5. Si usas Direct Connection, el puerto debe ser 5432")
        return False

def migrate():
    """Migrar base de datos local a Supabase"""
    
    print("🔗 Conectando a Supabase...")
    
    # Probar conexión primero
    if not test_connection(SUPABASE_URL):
        print("\n⚠️  No se pudo conectar a Supabase. Abortando migración.")
        return
    
    supabase_engine = create_engine(SUPABASE_URL)
    
    print("🔨 Creando tablas en Supabase...")
    Base.metadata.create_all(bind=supabase_engine)
    print("✅ Tablas creadas exitosamente\n")
    
    # Configurar sesiones
    local_db = SessionLocal()
    from sqlalchemy.orm import sessionmaker
    SupabaseSession = sessionmaker(bind=supabase_engine)
    supabase_db = SupabaseSession()
    
    try:
        print("📦 Iniciando migración de datos...\n")
        
        # Migrar usuarios
        users = local_db.query(User).all()
        if users:
            print(f"  👥 Migrando {len(users)} usuarios...")
            for user in users:
                supabase_db.merge(user)
            supabase_db.commit()
            print(f"  ✅ {len(users)} usuarios migrados")
        
        # Migrar perfiles profesionales
        perfiles = local_db.query(PerfilProfesional).all()
        if perfiles:
            print(f"  👨‍⚕️ Migrando {len(perfiles)} perfiles profesionales...")
            for perfil in perfiles:
                supabase_db.merge(perfil)
            supabase_db.commit()
            print(f"  ✅ {len(perfiles)} perfiles migrados")
        
        # Migrar disponibilidades
        disponibilidades = local_db.query(Disponibilidad).all()
        if disponibilidades:
            print(f"  📅 Migrando {len(disponibilidades)} horarios...")
            for disp in disponibilidades:
                supabase_db.merge(disp)
            supabase_db.commit()
            print(f"  ✅ {len(disponibilidades)} horarios migrados")
        
        # Migrar citas
        citas = local_db.query(Cita).all()
        if citas:
            print(f"  📋 Migrando {len(citas)} citas...")
            for cita in citas:
                supabase_db.merge(cita)
            supabase_db.commit()
            print(f"  ✅ {len(citas)} citas migradas")
        
        # Migrar pagos
        pagos = local_db.query(Pago).all()
        if pagos:
            print(f"  💰 Migrando {len(pagos)} pagos...")
            for pago in pagos:
                supabase_db.merge(pago)
            supabase_db.commit()
            print(f"  ✅ {len(pagos)} pagos migrados")
        
        # Migrar notificaciones
        notifs = local_db.query(Notificacion).all()
        if notifs:
            print(f"  🔔 Migrando {len(notifs)} notificaciones...")
            for notif in notifs:
                supabase_db.merge(notif)
            supabase_db.commit()
            print(f"  ✅ {len(notifs)} notificaciones migradas")
        
        # Migrar favoritos
        favs = local_db.query(Favorito).all()
        if favs:
            print(f"  ⭐ Migrando {len(favs)} favoritos...")
            for fav in favs:
                supabase_db.merge(fav)
            supabase_db.commit()
            print(f"  ✅ {len(favs)} favoritos migrados")
        
        print("\n" + "="*50)
        print("✅ MIGRACIÓN COMPLETADA EXITOSAMENTE")
        print("="*50)
        print("\nPuedes verificar los datos en:")
        print("https://app.supabase.com → Table Editor")
        
    except Exception as e:
        print(f"\n❌ ERROR en migración: {e}")
        print("\nRevirtiendo cambios...")
        supabase_db.rollback()
        print("Rollback completado")
    finally:
        local_db.close()
        supabase_db.close()
        print("\nConexiones cerradas")

if __name__ == "__main__":
    print("="*50)
    print("MIGRACIÓN A SUPABASE")
    print("="*50)
    print("\n⚠️  IMPORTANTE:")
    print("1. Asegúrate de haber editado SUPABASE_URL con tu URL real")
    print("2. Reemplaza TU_PASSWORD con tu contraseña de Supabase")
    print("3. Este proceso puede tardar unos minutos\n")
    
    continuar = input("¿Deseas continuar? (si/no): ").lower()
    
    if continuar in ['si', 's', 'yes', 'y']:
        migrate()
    else:
        print("\n❌ Migración cancelada")
