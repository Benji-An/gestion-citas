"""
Script para crear notificaciones de prueba
"""
import sys
from pathlib import Path

backend_dir = Path(__file__).resolve().parent
sys.path.insert(0, str(backend_dir))

from database import SessionLocal
from models import User, TipoNotificacion
from utils.notificaciones import crear_notificacion

def crear_notificaciones_prueba():
    db = SessionLocal()
    
    try:
        print("=" * 60)
        print("📬 CREANDO NOTIFICACIONES DE PRUEBA")
        print("=" * 60)
        print()
        
        # Obtener usuario Juan Pérez
        usuario = db.query(User).filter(User.email == "juan.perez@gmail.com").first()
        
        if not usuario:
            print("❌ Usuario juan.perez@gmail.com no encontrado")
            return
        
        print(f"✅ Usuario encontrado: {usuario.nombre} {usuario.apellido} (ID: {usuario.id})")
        print()
        
        # Crear varias notificaciones de prueba
        notificaciones = [
            {
                "tipo": TipoNotificacion.SISTEMA,
                "titulo": "¡Bienvenido a Tiiwa!",
                "mensaje": "Gracias por unirte a nuestra plataforma. Ahora puedes buscar profesionales y agendar citas fácilmente."
            },
            {
                "tipo": TipoNotificacion.RECORDATORIO,
                "titulo": "Recordatorio de Cita",
                "mensaje": "Recuerda completar tu perfil para obtener mejores recomendaciones de profesionales."
            },
            {
                "tipo": TipoNotificacion.MENSAJE,
                "titulo": "Nueva Característica",
                "mensaje": "Ahora puedes guardar tus profesionales favoritos para acceder rápidamente a ellos."
            },
            {
                "tipo": TipoNotificacion.SISTEMA,
                "titulo": "Actualización de Seguridad",
                "mensaje": "Hemos mejorado la seguridad de tu cuenta. Tu información está protegida."
            }
        ]
        
        for i, notif_data in enumerate(notificaciones, 1):
            notif = crear_notificacion(
                db=db,
                usuario_id=usuario.id,
                tipo=notif_data["tipo"],
                titulo=notif_data["titulo"],
                mensaje=notif_data["mensaje"],
                cita_id=None
            )
            print(f"✅ Notificación {i} creada: {notif.titulo}")
        
        print()
        print("=" * 60)
        print("🎉 NOTIFICACIONES CREADAS EXITOSAMENTE")
        print("=" * 60)
        print()
        print(f"Se crearon {len(notificaciones)} notificaciones para {usuario.email}")
        print()
        
    except Exception as e:
        db.rollback()
        print(f"\n❌ Error al crear notificaciones: {str(e)}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()


if __name__ == "__main__":
    crear_notificaciones_prueba()
