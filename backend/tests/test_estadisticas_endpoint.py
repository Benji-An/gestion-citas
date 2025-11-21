"""
Script para probar el endpoint de estadísticas y ver qué error está causando el 500
"""
import sys
import os

# Agregar el directorio backend al path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import SessionLocal
from models import User, TipoUsuario
from services.profesional_service import obtener_estadisticas_profesional

def test_estadisticas():
    db = SessionLocal()
    
    try:
        # Buscar un profesional en la base de datos
        profesional = db.query(User).filter(
            User.tipo_usuario == TipoUsuario.PROFESIONAL
        ).first()
        
        if not profesional:
            print("❌ No hay profesionales en la base de datos")
            return
        
        print(f"✅ Profesional encontrado: {profesional.email} (ID: {profesional.id})")
        
        # Intentar obtener estadísticas
        print("\n🔍 Intentando obtener estadísticas...")
        try:
            estadisticas = obtener_estadisticas_profesional(db, profesional.id)
            print("\n✅ Estadísticas obtenidas correctamente:")
            print(estadisticas)
        except Exception as e:
            print(f"\n❌ ERROR al obtener estadísticas:")
            print(f"Tipo: {type(e).__name__}")
            print(f"Mensaje: {str(e)}")
            import traceback
            print("\nTraceback completo:")
            traceback.print_exc()
        
    finally:
        db.close()

if __name__ == "__main__":
    print("=" * 60)
    print("TEST: Endpoint de estadísticas del profesional")
    print("=" * 60)
    test_estadisticas()
