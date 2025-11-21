"""
Script para obtener y verificar la URL de Supabase correcta
"""

print("="*60)
print("🔧 AYUDA: Obtener URL de conexión de Supabase")
print("="*60)

print("\n📍 PASO 1: Ve a tu proyecto en Supabase")
print("   https://app.supabase.com")

print("\n📍 PASO 2: Navega a:")
print("   Settings (⚙️) → Database → Connection string")

print("\n📍 PASO 3: Selecciona el modo de conexión:")
print("\n   🔹 Connection Pooling (Recomendado para Railway)")
print("      - Más eficiente para aplicaciones web")
print("      - Puerto: 6543")
print("      - Formato: postgresql://postgres.[REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres")

print("\n   🔹 Direct Connection")
print("      - Conexión directa")
print("      - Puerto: 5432")
print("      - Formato: postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres")

print("\n📍 PASO 4: Copia la URL y reemplaza [YOUR-PASSWORD]")

print("\n" + "="*60)
print("🧪 PROBAR CONEXIÓN")
print("="*60)

try:
    from sqlalchemy import create_engine, text
    
    print("\n¿Deseas probar una URL ahora? (si/no): ", end="")
    respuesta = input().lower()
    
    if respuesta in ['si', 's', 'yes', 'y']:
        print("\nPega tu URL completa de Supabase:")
        print("(La contraseña estará visible, asegúrate de estar solo)")
        url = input().strip()
        
        if not url or "YOUR-PASSWORD" in url:
            print("\n❌ Error: Debes reemplazar [YOUR-PASSWORD] con tu contraseña real")
        else:
            print("\n🔄 Probando conexión...")
            try:
                engine = create_engine(url)
                with engine.connect() as conn:
                    result = conn.execute(text("SELECT version();"))
                    version = result.fetchone()[0]
                    print(f"\n✅ ¡CONEXIÓN EXITOSA!")
                    print(f"PostgreSQL: {version[:60]}...")
                    
                    # Verificar tablas existentes
                    result = conn.execute(text("SELECT tablename FROM pg_tables WHERE schemaname='public';"))
                    tables = result.fetchall()
                    
                    if tables:
                        print(f"\n📊 Tablas existentes ({len(tables)}):")
                        for table in tables[:10]:  # Mostrar primeras 10
                            print(f"   - {table[0]}")
                        if len(tables) > 10:
                            print(f"   ... y {len(tables) - 10} más")
                    else:
                        print("\n📝 Base de datos vacía (sin tablas)")
                    
                    print("\n✅ Esta URL funciona correctamente.")
                    print("Cópiala en migrate_to_supabase.py en la variable SUPABASE_URL")
                    
            except Exception as e:
                print(f"\n❌ Error de conexión:")
                print(f"   {str(e)}")
                print("\n💡 Posibles causas:")
                print("   1. Contraseña incorrecta")
                print("   2. URL mal formateada")
                print("   3. Proyecto pausado/eliminado")
                print("   4. Firewall bloqueando la conexión")
                
except ImportError:
    print("\n⚠️  SQLAlchemy no está instalado")
    print("   Instala con: pip install sqlalchemy psycopg2-binary")

print("\n" + "="*60)
print("📚 Más información:")
print("   https://supabase.com/docs/guides/database/connecting-to-postgres")
print("="*60)
